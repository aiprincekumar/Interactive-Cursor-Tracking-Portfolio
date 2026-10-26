import React, { useEffect, useState } from 'react';
import TerminalCLI from './TerminalCLI';
import { useViewMode } from '../context/ViewModeContext';
import { useLabAudio } from '../context/LabContext';

/**
 * TerminalFullView
 * 
 * Standalone High-Performance Isolated Terminal Mode.
 * 
 * Features:
 * 1. Background Complete Isolation:
 *    - Renders on a solid, clean, pure white background (`bg-white`) when framed.
 *    - Standard heavy components (Hero, 3D Canvas, Particles, Navbar, Footer, etc.)
 *      are completely unmounted to ensure zero memory waste and ultra-fast performance.
 * 2. Fullscreen Maximize:
 *    - When maximized, takes over 100vw and 100vh edge-to-edge as a full screen part.
 * 3. Graceful Exit & Minimize:
 *    - Typing 'exit' or clicking close transitions back to modern portfolio view.
 *    - Minimizing docks to bottom-left and reveals the modern portfolio in the background.
 */
export default function TerminalFullView({
  activeCursor = 'butterfly',
  handleSelectCursor,
  onMinimize
}) {
  const { selectViewMode } = useViewMode();
  const { soundEnabled, setSoundEnabled } = useLabAudio();
  // Default to Fullscreen Maximized mode as agreed upon
  const [isMaximized, setIsMaximized] = useState(true);

  // Scroll to top on mount for clean presentation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Listen for custom event to toggle fullscreen/maximize
  useEffect(() => {
    const handleToggleMax = () => {
      setIsMaximized((prev) => !prev);
    };
    window.addEventListener('portfolio:toggle-terminal-maximize', handleToggleMax);
    return () => window.removeEventListener('portfolio:toggle-terminal-maximize', handleToggleMax);
  }, []);

  const handleClose = () => {
    selectViewMode('modern');
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    } else {
      selectViewMode('modern');
    }
  };

  return (
    <div
      role="region"
      aria-label="Full Terminal Console Portfolio View"
      className={
        isMaximized
          ? 'fixed inset-0 z-[9995] w-screen h-screen bg-black select-text p-0 m-0 overflow-hidden'
          : 'w-full min-h-screen bg-white text-stone-900 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8 select-text'
      }
    >
      {/* Centered Beautifully Framed Terminal Console Window */}
      <div
        className={
          isMaximized
            ? 'w-full h-full max-w-none max-h-none rounded-none border-0 shadow-none flex flex-col bg-black overflow-hidden'
            : 'w-full max-w-6xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-3.5rem)] max-h-[960px] flex flex-col rounded-2xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.08)] overflow-hidden bg-black'
        }
      >
        <TerminalCLI
          isOpen={true}
          fullView={true}
          isMaximized={isMaximized}
          onMaximizeChange={setIsMaximized}
          onMinimize={handleMinimize}
          onClose={handleClose}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled?.(!soundEnabled)}
          activeCursor={activeCursor}
          onSelectCursor={handleSelectCursor}
        />
      </div>
    </div>
  );
}
