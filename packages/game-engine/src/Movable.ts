import type { Direction } from "./Direction.js"

export interface Movable {
  x: number
  y: number
  isMoving: boolean
  direction: Direction
}
