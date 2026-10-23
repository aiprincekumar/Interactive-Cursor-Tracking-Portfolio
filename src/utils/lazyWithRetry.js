import React, { lazy, useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, WifiOff } from 'lucide-react';

/**
 * lazyWithRetry
 * 
 * Production-grade dynamic import wrapper with:
 * 1. Automatic retry mechanism on chunk load errors or momentary network glitches.
 * 2. Modern browser feature detection & offline state monitoring.
 * 3. Graceful fallback UI with an interactive "Retry / लोड करें" button so the whole application never crashes.
 * 4. Auto-reconnection trigger when browser transitions from offline to online.
 * 
 * Implemented using pure React.createElement so it requires no JSX compiler in .js files.
 * 
 * @param {() => Promise<{ default: React.ComponentType<any> }>} componentImport - Dynamic import factory
 * @param {string} [componentName='Component'] - Friendly name for logging and fallback UI
 * @param {number} [maxRetries=1] - Number of automatic retries before falling back to UI
 * @returns {React.LazyExoticComponent<React.ComponentType<any>>}
 */
export function lazyWithRetry(componentImport, componentName = 'Component', maxRetries = 1) {
  return lazy(async () => {
    let attempts = 0;

    while (attempts <= maxRetries) {
      try {
        return await componentImport();
      } catch (error) {
        attempts++;

        // If we still have retries remaining, wait with backoff and retry
        if (attempts <= maxRetries) {
          const delay = attempts * 600;
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Retries exhausted — log warning and return graceful resilient fallback
        console.warn(
          `[lazyWithRetry] All ${attempts} attempts to dynamically import "${componentName}" failed. Rendering resilient fallback UI.`,
          error
        );

        return {
          default: function LazyFallbackError(props) {
            const [isRetrying, setIsRetrying] = useState(false);
            const [loadedModule, setLoadedModule] = useState(null);
            const [isOffline, setIsOffline] = useState(() => {
              if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
                return !navigator.onLine;
              }
              return false;
            });

            // Modern browser online/offline status detection
            useEffect(() => {
              if (typeof window === 'undefined') return;

              const handleOnline = () => {
                setIsOffline(false);
                // Attempt automatic re-import when connection restores
                triggerRetry();
              };

              const handleOffline = () => {
                setIsOffline(true);
              };

              window.addEventListener('online', handleOnline);
              window.addEventListener('offline', handleOffline);

              return () => {
                window.removeEventListener('online', handleOnline);
                window.removeEventListener('offline', handleOffline);
              };
            }, []);

            const triggerRetry = async () => {
              setIsRetrying(true);
              try {
                const mod = await componentImport();
                setLoadedModule(() => mod.default || mod);
                setIsRetrying(false);
              } catch (retryErr) {
                console.error(`[lazyWithRetry] Manual retry for "${componentName}" failed:`, retryErr);
                setIsRetrying(false);
              }
            };

            // If manual or auto retry succeeded, render the dynamically loaded component seamlessly!
            if (loadedModule) {
              return React.createElement(loadedModule, props);
            }

            return React.createElement(
              'div',
              {
                role: 'alert',
                'aria-live': 'polite',
                className:
                  'my-6 mx-auto w-full max-w-xl p-6 rounded-2xl bg-white/80 dark:bg-[#120E1F]/80 backdrop-blur-md border border-amber-500/30 dark:border-amber-400/20 shadow-lg text-center transition-all duration-300'
              },
              React.createElement(
                'div',
                { className: 'flex flex-col items-center justify-center gap-3' },
                React.createElement(
                  'div',
                  {
                    className:
                      'w-12 h-12 rounded-full bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400'
                  },
                  React.createElement(isOffline ? WifiOff : AlertCircle, {
                    className: `w-6 h-6 ${isOffline ? 'animate-pulse' : ''}`
                  })
                ),
                React.createElement(
                  'div',
                  { className: 'space-y-1' },
                  React.createElement(
                    'h3',
                    { className: 'text-base font-semibold text-stone-900 dark:text-stone-100' },
                    isOffline ? 'Offline - Network Disconnected' : `Unable to load ${componentName}`
                  ),
                  React.createElement(
                    'p',
                    { className: 'text-xs text-stone-600 dark:text-stone-400 font-hindi' },
                    isOffline
                      ? 'इंटरनेट कनेक्शन कट गया है। ऑनलाइन आते ही स्वतः पुनः प्रयास होगा।'
                      : 'घटक लोड करने में समस्या आई। पुनः प्रयास करें।'
                  )
                ),
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    onClick: triggerRetry,
                    disabled: isRetrying,
                    className:
                      'mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#FF4D6D] hover:bg-[#e03d5c] text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer'
                  },
                  React.createElement(RefreshCw, {
                    className: `w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`
                  }),
                  React.createElement(
                    'span',
                    null,
                    isRetrying ? 'Loading / लोड हो रहा है...' : 'Retry / लोड करें'
                  )
                )
              )
            );
          }
        };
      }
    }
  });
}

export default lazyWithRetry;
