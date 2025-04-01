import type { AnimatedSprite, Container, Resource, Texture } from "pixi.js"
import { Object } from "./Object.js"
import { Direction } from "./Direction.js"
import { hasFlag } from "./hasFlag.js"
import type { UniversalSpritesheet } from "./UniversalSpritesheet.js"
import type { GUID } from "./GUID.js"

export abstract class Character extends Object {
  GUID?: GUID
  isPlayed?: boolean
  public destinationX: number | null = null
  public destinationY: number | null = null

  constructor(container: Container) {
    super(container)
  }

  protected _play() {
    this.sprite.children.map((child) => (child as AnimatedSprite).play())
  }

  protected _stop() {
    this.sprite.children.map((child) => (child as AnimatedSprite).stop())
  }

  protected _updateTexture(
    index: number,
    determineTexture: () => Texture<Resource>[],
  ): void {
    const textures = determineTexture()
    const animatedSprite = this.sprite.children[index] as AnimatedSprite
    if (animatedSprite.textures !== textures) {
      animatedSprite.textures = textures
      if (this.isMoving) {
        animatedSprite.play()
      }
    }
    if (!this.isMoving) {
      animatedSprite.gotoAndStop(0)
    }
  }

  protected _determineTexture(
    spritesheet: UniversalSpritesheet,
  ): Texture<Resource>[] {
    if (hasFlag(this.facingDirection, Direction.Up)) {
      return spritesheet.animations.up
    } else if (hasFlag(this.facingDirection, Direction.Down)) {
      return spritesheet.animations.down
    } else if (hasFlag(this.facingDirection, Direction.Left)) {
      return spritesheet.animations.left
    } else if (hasFlag(this.facingDirection, Direction.Right)) {
      return spritesheet.animations.right
    } else {
      return spritesheet.animations.down
    }
  }
}
