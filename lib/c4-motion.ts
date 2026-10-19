import type { MotionDevice, MotionRange } from './immersive-motion';

/** Cancel the chapter height: opening details cannot stretch/replay the entrance. */
export function c4MotionRange(height: number, device: MotionDevice): MotionRange {
  const [start, distance] = device.breakpoint === 'desktop' ? [.86, .55] :
    device.breakpoint === 'tablet' ? [.9, .4] : [.94, .5];
  return { start, end: height / device.height + start - distance };
}
