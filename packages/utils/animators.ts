import type { AnimateConfig, AnimationType, Vec2 } from "@nimble-ui/types"
import { clamp, isVec2, leap, leapVectors } from "./math"

function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3)
}

export function getAnimateConfig(animationType: AnimationType): AnimateConfig {
  switch (animationType) {
    case 'dynamic':
      return { easing: easeOutCubic, duration: 300 }
    case 'spring':
      return { easing: easeOutBack, duration: 350 }
    case 'none':
      return { easing: (t: number) => t, duration: 1 }
  }
}

export function animate<P extends { [key: string]: number | Vec2 }>(
  from: P,
  to: { [K in keyof P]: P[K] },
  cb: (value: P, done: boolean, progress: number) => void,
  config: AnimateConfig = {
    duration: 350,
    easing: (t) => t
  }
) {
  let start: number
  function update(ts: number) {
    if (start === undefined) {
      start = ts;
    }
    const elapsed = ts - start;
    const t = clamp(elapsed / config.duration, 0, 1);
    const names = Object.keys(from) as Array<keyof P>;

    const result = {} as P
    names.forEach((key) => {
      if (typeof from[key] == 'number' && typeof to[key] == 'number') {
        result[key] = leap(
          from[key],
          to[key],
          config.easing(t)
        ) as P[keyof P]
      } else if (isVec2(from[key]) && isVec2(to[key])) {
        result[key] = leapVectors(
          from[key],
          to[key],
          config.easing(t)
        ) as P[keyof P]
      }
    })
    
    cb(result, t >= 1, t);
    if (t < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update)
}