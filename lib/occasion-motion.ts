import type { MotionDevice, MotionRange } from './immersive-motion';

type OccasionGeometry = { height: number; layoutTop: number; layoutHeight: number; stageHeight: number };

export function occasionMotionRange(geometry: OccasionGeometry, device: MotionDevice): MotionRange {
  const { height, layoutTop, layoutHeight, stageHeight } = geometry;
  const viewport = device.height;
  let start: number;
  let distance: number;
  if (device.breakpoint === 'desktop' && viewport >= 700) {
    start = .55 - layoutTop / viewport;
    // Include the natural entrance, then use only the index's existing sticky space.
    distance = Math.max(1, layoutHeight - stageHeight + viewport * .55 - 104) / viewport;
  } else if (device.breakpoint === 'mobile' && device.width > 375 && viewport >= 830) {
    start = .65;
    distance = .95;
  } else {
    // In-flow alternative for portrait tablets, narrow phones and short landscape.
    start = .7 - layoutTop / viewport;
    distance = device.breakpoint === 'tablet' ? .6 : viewport < 700 ? .35 : .5;
  }
  return { start, end: height / viewport + start - distance };
}
