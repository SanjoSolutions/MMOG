import { Container, Sprite } from "pixi.js"
import { GameObject } from "./GameObject.js"

export abstract class GameObjectSprite {
  object: GameObject
  sprite: Sprite = new Sprite()
  container: Container

  constructor(object: GameObject, container: Container) {
    this.object = object
    this.container = container
    this.sprite.anchor.set(0.5, 1)
  }

  sync() {
    this.sprite.x = this.object.x
    const previousY = this.sprite.y
    this.sprite.y = this.object.y
    this.sprite.zIndex = this.object.y
    this._updateTextures()
    const isDifferentYCoordinate = this.sprite.y !== previousY
    if (isDifferentYCoordinate) {
      this.updateRenderPosition()
    }
    if (this.object.isMoving) {
      this._play()
    } else {
      this._stop()
    }
  }

  updateRenderPosition(): void {
    this.container.removeChild(this.sprite)
    let index = 0
    while (
      index < this.container.children.length &&
      this.sprite.y > this.container.getChildAt(index).y
    ) {
      index++
    }
    if (index === this.container.children.length) {
      this.container.addChild(this.sprite)
    } else {
      this.container.addChildAt(this.sprite, index)
    }
  }

  protected _play() {
    throw new Error("Please implement in a subclass.")
  }

  protected _stop() {
    throw new Error("Please implement in a subclass.")
  }

  protected _updateTextures() {
    throw new Error("Please implement in a subclass.")
  }
}
