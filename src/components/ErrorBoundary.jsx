import React, { Component } from 'react';

/**
 * Global React ErrorBoundary Component
 *
 * Catches uncaught runtime errors anywhere in the child component tree,
 * logs diagnostic error stack traces, and renders a fallback UI instead of crashing
 * to a blank screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('💥 [ErrorBoundary Caught Unhandled Exception]:', error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5] dark:bg-[#0B0813] text-[#18181B] dark:text-[#F5F2F8] p-6 font-sans select-text"
        >
          <div className="max-w-md w-full bg-white dark:bg-[#150F24] border border-[#E7E2D8] dark:border-[#2D2340] rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center mx-auto text-2xl font-bold">
              ⚠️
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight">Something went unexpected</h1>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                The application encountered a runtime issue, but your session was preserved safely.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-stone-100 dark:bg-[#0B0813]/80 p-3 rounded-lg text-left text-[11px] font-mono text-stone-700 dark:text-stone-300 overflow-x-auto max-h-24">
                {String(this.state.error.message)}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-[#FF4D6D] to-[#9333EA] text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                Reload Application
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-[#1E162B] active:scale-95 transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
