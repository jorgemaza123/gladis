import type { MotionDevice, MotionRange } from './immersive-motion';

/** A short approach in the existing closing block, followed by a quiet CTA. */
export function finalMotionRange(height: number, device: MotionDevice): MotionRange {
  const [start, distance] = device.breakpoint === 'desktop' ? [.78, .55] :
    device.breakpoint === 'tablet' ? [.86, .5] : [.88, .5];
  return { start, end: height / device.height + start - distance };
}
