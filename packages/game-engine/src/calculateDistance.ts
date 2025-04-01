import type { Point2D } from './Point2D.js'

export function calculateDistance(a: Point2D, b: Point2D): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
