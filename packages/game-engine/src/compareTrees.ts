import type { Point2D } from './Point2D.js'

export function compareTrees(a: Point2D, b: Point2D): number {
  return a.y - b.y
}
