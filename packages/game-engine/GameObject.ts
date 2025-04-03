import { now } from "../shared/now.js"
import { Direction } from "./Direction.js"
import type { GUID } from "./GUID.js"
import { updatePosition } from "./updatePosition.js"

export class GameObject {
  id?: GUID
  lastI: number | null = null
  facingDirection: Direction = Direction.Down
  movingDirection: Direction = Direction.None
  isMoving: boolean = false
  x: number = 0
  y: number = 0
  baseX: number | null = null
  baseY: number | null = null
  whenMovingHasChanged: number | null = null

  updatePosition(): void {
    if (
      this.whenMovingHasChanged &&
      typeof this.baseX === "number" &&
      typeof this.baseY === "number"
    ) {
      const movable = {
        x: this.baseX,
        y: this.baseY,
        isMoving: this.isMoving,
        direction: this.facingDirection,
      }
      updatePosition(movable, now() - this.whenMovingHasChanged)
      this.x = movable.x
      this.y = movable.y
    }
  }

  public update(data: any): void {
    this.whenMovingHasChanged = Date.now()
    this.baseX = data.x
    this.baseY = data.y
    this.facingDirection = data.direction
    this.isMoving = data.isMoving
    this.x = data.x
    this.y = data.y
    this.updatePosition()
  }
}
