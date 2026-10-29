/* oxlint-disable react/only-export-components */
import React from 'react';
import { useLab3D } from '../../context/LabContext';

/**
 * SandboxViewportContainer
 *
 * Phase 1: State Isolation & Scoped CSS 3D Architecture
 *
 * Isolates all 3D CSS custom properties (--3d-*) to this viewport container
 * and its descendant DOM tree. Prevents preview/experimental lighting, materials,
 * camera perspective, and exploded stratum effects from bleeding into the live portfolio DOM.
 */
const SandboxViewportContainerComponent = React.forwardRef(function SandboxViewportContainer({
  children,
  className = '',
  perspective,
  style = {},
  ...restProps
}, ref) {
  const lab3D = useLab3D ? useLab3D() : null;
  const getScopedSandboxStyles = lab3D?.getScopedSandboxStyles;
  const threeD = lab3D?.threeD;

  const activePerspective = perspective !== undefined
    ? perspective
    : (threeD?.camera?.perspectiveFOV ?? 1000);

  const scopedStyles = typeof getScopedSandboxStyles === 'function'
    ? getScopedSandboxStyles()
    : {};

  return (
    <div
      ref={ref}
      className={`sandbox-viewport relative overflow-hidden select-none touch-none ${className}`}
      style={{
        ...scopedStyles,
        ...style,
        transformStyle: 'preserve-3d',
        perspective: `${activePerspective}px`
      }}
      data-sandbox-viewport="true"
      {...restProps}
    >
      {children}
    </div>
  );
});

export function SandboxViewportContainer(props) {
  return <SandboxViewportContainerComponent {...props} />;
}

export default SandboxViewportContainerComponent;
