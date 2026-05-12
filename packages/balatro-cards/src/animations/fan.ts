import type { CardTransform } from '../core/types'

export interface FanOptions {
  maxAngle?: number    // total fan spread in degrees, default 30
  xSpread?: number     // horizontal spacing multiplier per card, default 40
  yParabola?: number   // max y-offset at edges in px, default 15
}

export function getFanPositions(n: number, options: FanOptions = {}): CardTransform[] {
  if (n === 0) return []
  const { maxAngle = 30, xSpread = 40, yParabola = 15 } = options

  if (n === 1) return [{ x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 }]

  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1) - 0.5  // range: -0.5 to +0.5
    return {
      x: t * xSpread * Math.min(n, 8),
      y: Math.pow(t * 2, 2) * yParabola,
      rotate: t * maxAngle,
      scale: 1,
      zIndex: i + 1,
    }
  })
}

export function getPilePosition(): CardTransform {
  return { x: 0, y: 0, rotate: 0, scale: 1, zIndex: 1 }
}

export function getRowPositions(n: number, spacing = 80): CardTransform[] {
  return Array.from({ length: n }, (_, i) => ({
    x: (i - (n - 1) / 2) * spacing,
    y: 0,
    rotate: 0,
    scale: 1,
    zIndex: i + 1,
  }))
}
