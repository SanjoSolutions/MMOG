import { Subject } from "rxjs"
import type { InteractableObject } from "../InteractableObject.js"

export interface IEntity {
  id: string | null
  row: number
  column: number
}

export class Entity implements InteractableObject {
  id: string | null = null
  row: number
  column: number
  onEnter = new Subject()
  onOver = new Subject()
  onInteract: ((interacter: any) => Promise<void>) | null = null

  constructor(row: number, column: number) {
    this.row = row
    this.column = column
  }

  canInteractWith(object: any) {
    return Boolean(this.onInteract)
  }

  async interact(interacter: any) {
    if (this.onInteract) {
      await this.onInteract(interacter)
    }
  }
}
