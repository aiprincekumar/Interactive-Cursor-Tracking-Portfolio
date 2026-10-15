import React from 'react';
import ButterflyCursor from '../ButterflyCursor';
import FireflyCursor from './FireflyCursor';
import StardustCursor from './StardustCursor';
import AirplaneCursor from './AirplaneCursor';
import LaserCursor from './LaserCursor';
import CameraCursor from './CameraCursor';
import MinimalCursor from './MinimalCursor';
import ModularKinematicCursor from './ModularKinematicCursor';

export {
  ButterflyCursor,
  FireflyCursor,
  StardustCursor,
  AirplaneCursor,
  LaserCursor,
  CameraCursor,
  MinimalCursor,
  ModularKinematicCursor
};

export { KINEMATIC_PROFILES, getKinematicProfile } from './kinematicProfiles';

/**
 * Factory helper that creates a dedicated cursor component for a specific ID
 */
function createCursorWrapper(id, displayName) {
  const Component = (props) => (
    <ModularKinematicCursor cursorId={id} {...props} />
  );
  Component.displayName = displayName;
  return Component;
}

// ==========================================
// 35 Individual Cursor Components
// ==========================================
// Category 1: Living & Nature
export { default as DragonflyCursor } from './ModularKinematicCursor';
export const HoneybeeCursor = createCursorWrapper('honeybee', 'HoneybeeCursor');
export const LeafCursor = createCursorWrapper('leaf', 'LeafCursor');

// Category 2: Cosmic & Magic
export const WandCursor = StardustCursor;
export const CometCursor = createCursorWrapper('comet', 'CometCursor');
export const BlackholeCursor = createCursorWrapper('blackhole', 'BlackholeCursor');
export const PrismCursor = createCursorWrapper('prism', 'PrismCursor');
export const PortalCursor = createCursorWrapper('portal', 'PortalCursor');

// Category 3: Tech & Cyberpunk
export const MatrixCursor = createCursorWrapper('matrix', 'MatrixCursor');
export const ReticleCursor = createCursorWrapper('reticle', 'ReticleCursor');
export const CircuitCursor = createCursorWrapper('circuit', 'CircuitCursor');
export const DroneCursor = createCursorWrapper('drone', 'DroneCursor');

// Category 4: Playful & Vehicles
export const RocketCursor = createCursorWrapper('rocket', 'RocketCursor');
export const UfoCursor = createCursorWrapper('ufo', 'UfoCursor');
export const SpeedsterCursor = createCursorWrapper('speedster', 'SpeedsterCursor');
export const BalloonCursor = createCursorWrapper('balloon', 'BalloonCursor');

// Category 5: Elemental & Forces
export const FlameCursor = createCursorWrapper('flame', 'FlameCursor');
export const FrostCursor = createCursorWrapper('frost', 'FrostCursor');
export const LightningCursor = createCursorWrapper('lightning', 'LightningCursor');
export const WaterdropCursor = createCursorWrapper('waterdrop', 'WaterdropCursor');
export const TornadoCursor = createCursorWrapper('tornado', 'TornadoCursor');

// Category 6: Precision & Design
export const QuillCursor = createCursorWrapper('quill', 'QuillCursor');
export const BrushCursor = createCursorWrapper('brush', 'BrushCursor');
export const CompassCursor = createCursorWrapper('compass', 'CompassCursor');

// Category 7: Arcade & Retro
export const GhostCursor = createCursorWrapper('ghost', 'GhostCursor');
export const PacmanCursor = createCursorWrapper('pacman', 'PacmanCursor');
export const JoystickCursor = createCursorWrapper('joystick', 'JoystickCursor');
export const SynthwaveCursor = createCursorWrapper('synthwave', 'SynthwaveCursor');
export const SwordCursor = createCursorWrapper('sword', 'SwordCursor');
