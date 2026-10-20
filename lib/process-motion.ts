import type { MotionDevice, MotionRange } from './immersive-motion';

type ProcessGeometry = { height: number; firstTop: number; lastTop: number };

/** One scroll position always describes one conceptual step, in either direction. */
export function processVisualPhase(progress: number) {
  if (progress <= .02) return 'origin';
  if (progress < .34) return 'one';
  if (progress < .68) return 'two';
  if (progress < .96) return 'three';
  return 'complete';
}

/** Follow the real first/last markers without adding space or a separate clock. */
export function processMotionRange(geometry: ProcessGeometry, device: MotionDevice): MotionRange {
  const [entry, breathing] = device.breakpoint === 'desktop' ? [.82, .38] :
    device.breakpoint === 'tablet' ? [.84, .34] : [.88, .44];
  const start = entry - geometry.firstTop / device.height;
  const distance = Math.max(0, geometry.lastTop - geometry.firstTop) / device.height + breathing;
  return { start, end: geometry.height / device.height + start - distance };
}
