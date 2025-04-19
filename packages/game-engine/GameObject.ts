import { Direction } from "./Direction.js"
import type { GUID } from "./GUID.js"
import { hasFlag } from "./hasFlag.js"
import { SPEED } from "./speed.js"

export class GameObject {
  id?: GUID
  type: any
  lastI: number | null = null
  facingDirection: Direction = Direction.Down
  movingDirection: Direction = Direction.None
  isMoving: boolean = false
  x: number = 0
  y: number = 0
  baseX: number = 0
  baseY: number = 0
  whenMovingHasChanged: number | null = null
  /**
   * In pixel per millisecond.
   */
  speed = SPEED

  updatePosition(now: number): void {
    if (
      this.whenMovingHasChanged &&
      typeof this.baseX === "number" &&
      typeof this.baseY === "number"
    ) {
      if (this.isMoving) {
        const timeElapsed = now - this.whenMovingHasChanged
        const delta = this.speed * timeElapsed

        let deltaX = 0
        if (hasFlag(this.movingDirection, Direction.Left)) {
          deltaX -= delta
        } else if (hasFlag(this.movingDirection, Direction.Right)) {
          deltaX += delta
        }
        this.x = this.baseX + deltaX

        let deltaY = 0
        if (hasFlag(this.movingDirection, Direction.Up)) {
          deltaY -= delta
        } else if (hasFlag(this.movingDirection, Direction.Down)) {
          deltaY += delta
        }
        this.y = this.baseY + deltaY
      }
    }
  }

  public update(data: any, now: number): void {
    this.whenMovingHasChanged = Date.now()
    this.baseX = data.x
    this.baseY = data.y
    this.facingDirection = data.facingDirection
    this.movingDirection = data.movingDirection
    this.isMoving = data.isMoving
    this.x = data.x
    this.y = data.y
    this.updatePosition(now)
  }
}
