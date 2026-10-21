import React from 'react';
import { AnnouncerProvider, useAnnounce } from '../context/AnnouncerContext';

export { AnnouncerProvider, useAnnounce };

/**
 * AriaLiveAnnouncer component for rendering standalone live region if needed,
 * or default export.
 */
export default function AriaLiveAnnouncer() {
  const { politeMessage, assertiveMessage } = useAnnounce();

  return (
    <div className="sr-only" aria-hidden="false">
      <div role="status" aria-live="polite" aria-atomic="true">
        {politeMessage}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true">
        {assertiveMessage}
      </div>
    </div>
  );
}
