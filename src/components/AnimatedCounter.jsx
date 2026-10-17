import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * Parses a numeric stat string into prefix, target number, decimals, suffix, hasComma.
 * Supports:
 * - Decimals: "99.8%", "99.5%"
 * - Comma formatting: "10,000+"
 * - Zero: "0"
 * - Integers with plus/percent/text: "500+", "15+", "100%", "5+ Years", "7+ Years"
 * - Currency/Prefixes: "$500", ">99%"
 */
function parseStatValue(val) {
  if (typeof val === 'number') {
    const isDecimal = !Number.isInteger(val);
    const valStr = val.toString();
    const decimals = isDecimal ? valStr.split('.')[1].length : 0;
    return {
      prefix: '',
      targetNumber: val,
      decimals,
      suffix: '',
      hasComma: false,
      isValid: true,
    };
  }

  const str = String(val ?? '').trim();
  if (!str) {
    return {
      prefix: '',
      targetNumber: 0,
      decimals: 0,
      suffix: '',
      hasComma: false,
      isValid: false,
    };
  }

  const match = str.match(/^([^\d]*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);

  if (!match) {
    return {
      prefix: '',
      targetNumber: 0,
      decimals: 0,
      suffix: str,
      hasComma: false,
      isValid: false,
    };
  }

  const prefix = match[1] || '';
  const numStr = match[2];
  const suffix = match[3] || '';

  const hasComma = numStr.includes(',');
  const decimalParts = numStr.split('.');
  const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
  const rawNumber = parseFloat(numStr.replace(/,/g, ''));
  const targetNumber = isNaN(rawNumber) ? 0 : rawNumber;

  return {
    prefix,
    targetNumber,
    decimals,
    suffix,
    hasComma,
    isValid: true,
  };
}

/**
 * Formats a number with decimals and optional commas.
 */
function formatDisplayNumber(num, decimals, hasComma) {
  let formatted;
  if (decimals > 0) {
    formatted = num.toFixed(decimals);
  } else {
    formatted = Math.round(num).toString();
  }

  if (hasComma) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }
  return formatted;
}

/**
 * AnimatedCounter component
 * Supports smooth 0 -> target count-up with ease-out cubic curve via requestAnimationFrame.
 * Triggers cleanly via IntersectionObserver and resets/re-animates on role tab switches.
 */
export default function AnimatedCounter({
  value,
  duration = 1800,
  resetKey = null,
  className = '',
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const isInViewRef = useRef(false);

  const parsed = useMemo(() => parseStatValue(value), [value]);

  const getInitialDisplay = useCallback(() => {
    if (!parsed.isValid) return String(value ?? '');
    return `${parsed.prefix}${formatDisplayNumber(0, parsed.decimals, parsed.hasComma)}${parsed.suffix}`;
  }, [parsed, value]);

  const getFinalDisplay = useCallback(() => {
    if (!parsed.isValid) return String(value ?? '');
    return `${parsed.prefix}${formatDisplayNumber(parsed.targetNumber, parsed.decimals, parsed.hasComma)}${parsed.suffix}`;
  }, [parsed, value]);

  const [displayValue, setDisplayValue] = useState(getInitialDisplay);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const startAnimation = useCallback(() => {
    cancelAnimation();

    if (!parsed.isValid) {
      setDisplayValue(String(value ?? ''));
      return;
    }

    // Respect reduced-motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(getFinalDisplay());
      return;
    }

    // Zero value edge case: render cleanly without division or NaN
    if (parsed.targetNumber === 0) {
      setDisplayValue(getFinalDisplay());
      return;
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentVal = parsed.targetNumber * eased;

      setDisplayValue(
        `${parsed.prefix}${formatDisplayNumber(currentVal, parsed.decimals, parsed.hasComma)}${parsed.suffix}`
      );

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(getFinalDisplay());
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [cancelAnimation, duration, getFinalDisplay, parsed, value]);

  // Ref to always access the latest startAnimation function without re-binding observer
  const startAnimationRef = useRef(startAnimation);
  useEffect(() => {
    startAnimationRef.current = startAnimation;
  }, [startAnimation]);

  const cancelAnimationRef = useRef(cancelAnimation);
  useEffect(() => {
    cancelAnimationRef.current = cancelAnimation;
  }, [cancelAnimation]);

  const getInitialDisplayRef = useRef(getInitialDisplay);
  useEffect(() => {
    getInitialDisplayRef.current = getInitialDisplay;
  }, [getInitialDisplay]);

  // 1. Viewport Intersection Observer
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          isInViewRef.current = true;
          startAnimationRef.current();
        } else {
          isInViewRef.current = false;
          cancelAnimationRef.current();
          setDisplayValue(getInitialDisplayRef.current());
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationRef.current();
    };
  }, [threshold, rootMargin]);

  // 2. React to value or tab/role change (resetKey)
  useEffect(() => {
    if (isInViewRef.current) {
      startAnimation();
    } else {
      cancelAnimation();
      setDisplayValue(getInitialDisplay());
    }
  }, [value, resetKey, startAnimation, cancelAnimation, getInitialDisplay]);

  return (
    <span ref={containerRef} className={`tabular-nums inline-block ${className}`}>
      {displayValue}
    </span>
  );
}
