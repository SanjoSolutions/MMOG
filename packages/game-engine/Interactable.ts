import { Sprite } from "pixi.js"
import type { GameObject } from "./GameObject.js"

export class Interactable extends Sprite {
  canInteractWith(entity: GameObject): boolean {
    return true
  }

  interact(interacter: Sprite): void {}
}
