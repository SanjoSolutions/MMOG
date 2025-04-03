import { calculateDistance } from "./calculateDistance.js"
import type { Point2D } from "./Point2D.js"

export function findClosest<T extends Point2D, K extends Point2D>(
  aPoint: T,
  points: K[],
): K | null {
  let closest: K | null = null
  let closestDistanceSoFar: number | null = null
  for (const point of points) {
    const distance = calculateDistance(point, aPoint)
    if (!closest || distance < closestDistanceSoFar!) {
      closestDistanceSoFar = distance
      closest = point
    }
  }
  return closest
}
