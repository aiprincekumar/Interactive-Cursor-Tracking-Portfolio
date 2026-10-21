import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contentEditable=true]:not([tabindex="-1"])',
].join(', ');

/**
 * Custom hook to trap keyboard focus within a modal, drawer, or dialog container.
 * Handles Tab / Shift+Tab cycling, Escape key dismissal, and restores focus on close.
 *
 * @param {boolean} isOpen Whether the overlay is active
 * @param {React.RefObject} containerRef Ref to the dialog container element
 * @param {Object} options Configuration options
 * @param {React.RefObject} [options.initialFocusRef] Optional element to focus first
 * @param {Function} [options.onEscape] Optional callback when Escape is pressed
 * @param {boolean} [options.restoreFocus=true] Whether to restore focus to trigger element on close
 */
export function useFocusTrap(isOpen, containerRef, { initialFocusRef = null, onEscape = null, restoreFocus = true } = {}) {
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Capture the trigger or currently focused element to restore when closed
    if (typeof document !== 'undefined') {
      previousActiveElementRef.current = document.activeElement;
    }

    const container = containerRef?.current;
    if (!container) return;

    // Set initial focus smoothly
    const timer = setTimeout(() => {
      if (initialFocusRef?.current && typeof initialFocusRef.current.focus === 'function') {
        initialFocusRef.current.focus();
      } else {
        const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
          (el) => el.offsetParent !== null || el.getClientRects().length > 0
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else if (typeof container.focus === 'function') {
          if (!container.hasAttribute('tabindex')) {
            container.setAttribute('tabindex', '-1');
          }
          container.focus();
        }
      }
    }, 40);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onEscape === 'function') {
          e.preventDefault();
          e.stopPropagation();
          onEscape();
        }
        return;
      }

      if (e.key === 'Tab') {
        const currentContainer = containerRef?.current;
        if (!currentContainer) return;

        const focusableElements = Array.from(currentContainer.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
          (el) => el.offsetParent !== null || el.getClientRects().length > 0
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Backward tab
          if (document.activeElement === firstElement || !currentContainer.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Forward tab
          if (document.activeElement === lastElement || !currentContainer.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown, true);

      if (restoreFocus && previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        // Defer restoration to avoid race conditions with unmounting transitions
        setTimeout(() => {
          try {
            previousActiveElementRef.current?.focus();
          } catch {}
        }, 30);
      }
    };
  }, [isOpen, containerRef, initialFocusRef, onEscape, restoreFocus]);
}
