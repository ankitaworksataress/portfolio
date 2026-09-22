export const BG = '#AD211A'
export const FRAME_COUNT = 64
export const LERP = 0.25
export const DEADZONE = 0.12

/** Shortest-path circular lerp between two angles in radians. */
export function lerpAngle(current: number, target: number, t: number): number {
  let diff = target - current
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return current + diff * t
}

/** Map atan2 angle to ring frame index.
 *  atan2(dy, dx): 0 = right, π/2 = down (screen Y), -π/2 = up.
 *  Frame 0 ≈ center/start of video loop; index advances clockwise around the ring
 *  matching the extraction order: center→up→UR→right→…→UL.
 */
export function angleToFrameIndex(angle: number, count = FRAME_COUNT): number {
  // Rotate so that "up" (-π/2) lands near index count/8 (UP keyframe)
  // Video ring: i=0 center-ish start, then progresses toward UP at ~1/8.
  // For cursor tracking we want angle 0 (right) → RIGHT frame (~3/8).
  // Convert screen atan2 to [0, 2π) where 0 = up, increasing clockwise.
  const fromUp = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2)
  // Video progresses center→up→… so offset by one sector (~1/8) from pure up-at-0.
  // Empirically: map clockwise-from-up directly onto ring, starting at UP index.
  const upIndex = count / 8
  const idx = Math.round(upIndex + (fromUp / (Math.PI * 2)) * count) % count
  return idx
}

const BASE = import.meta.env.BASE_URL

export function frameUrl(index: number): string {
  return `${BASE}frames/frame_${String(index).padStart(3, '0')}.webp`
}

export const CENTER_URL = `${BASE}frames/center.webp`
