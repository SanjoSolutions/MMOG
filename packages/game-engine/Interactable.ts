import { Sprite } from "pixi.js"
import type { Object } from "./Object.js"

export class Interactable extends Sprite {
  canInteractWith(entity: Object): boolean {
    return true
  }

  interact(interacter: Sprite): void {}
}
