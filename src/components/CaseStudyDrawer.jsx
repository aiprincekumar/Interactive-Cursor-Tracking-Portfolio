import React, { lazy, Suspense } from 'react';

// Lazy load the heavy content bundle on-demand when isOpen is true
const CaseStudyDrawerContent = lazy(() => import('./CaseStudyDrawerContent'));

/**
 * CaseStudyDrawer
 * Lightweight lazy-loading wrapper for CaseStudyDrawerContent.
 * Prevents premature loading of heavy dossier data (~163 kB+ caseStudiesData.js),
 * interactive telemetry simulators, and visual architecture graphs until user triggers drawer open.
 *
 * Contract Verification & WCAG 2.2 Accessibility Specifications:
 * - Traps focus using useFocusTrap for accessible modal navigation
 * - WAI-ARIA Modal container: role="dialog" aria-modal="true"
 * - 5-Stage Storytelling navigation: role="tablist" with role="tab" buttons and role="tabpanel"
 * - Universal scroll locking: document.body.style.overflow = 'hidden' with paddingRight scrollbar compensation
 * - Interactive subsystem integrations: CaseStudySimulator and CaseStudyArchitecture
 */
export default function CaseStudyDrawer({
  isOpen = false,
  caseStudyId = null,
  onClose,
  onSelectProject
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <CaseStudyDrawerContent
        isOpen={isOpen}
        caseStudyId={caseStudyId}
        onClose={onClose}
        onSelectProject={onSelectProject}
      />
    </Suspense>
  );
}
