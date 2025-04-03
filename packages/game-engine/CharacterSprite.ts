import type { AnimatedSprite, Resource, Texture } from "pixi.js"
import { Direction } from "./Direction.js"
import { GameObjectSprite } from "./GameObjectSprite.js"
import type { UniversalSpritesheet } from "./UniversalSpritesheet.js"
import { hasFlag } from "./hasFlag.js"

export abstract class CharacterSprite extends GameObjectSprite {
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
      if (this.object.isMoving) {
        animatedSprite.play()
      }
    }
    if (!this.object.isMoving) {
      animatedSprite.gotoAndStop(0)
    }
  }

  protected _determineTexture(
    spritesheet: UniversalSpritesheet,
  ): Texture<Resource>[] {
    if (hasFlag(this.object.facingDirection, Direction.Up)) {
      return spritesheet.animations.up
    } else if (hasFlag(this.object.facingDirection, Direction.Down)) {
      return spritesheet.animations.down
    } else if (hasFlag(this.object.facingDirection, Direction.Left)) {
      return spritesheet.animations.left
    } else if (hasFlag(this.object.facingDirection, Direction.Right)) {
      return spritesheet.animations.right
    } else {
      return spritesheet.animations.down
    }
  }
}
