import type { MotionDevice, MotionRange } from './immersive-motion';

/** A short alignment inside the existing block; never reserve storytelling height. */
export function companyMotionRange(height: number, device: MotionDevice): MotionRange {
  const [start, distance] = device.breakpoint === 'desktop' ? [.88, .55] :
    device.breakpoint === 'tablet' ? [.92, .5] : [.94, .65];
  return { start, end: height / device.height + start - distance };
}
