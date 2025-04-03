import {
  Assets,
  type Container,
  type Resource,
  type Spritesheet,
  type Texture,
} from "pixi.js"
import { CharacterSprite } from "./CharacterSprite.js"
import type { GameObject } from "./GameObject.js"
import { createAnimatedSprite } from "./createAnimatedSprite.js"
import { createUniversalSpriteSheet } from "./createUniversalSpriteSheet.js"

export async function loadSpriteSheet(path: string) {
  return await Assets.load(path)
}

export async function loadUniversalSpriteSheet(path: string) {
  const texture = await Assets.load(path)
  return await createUniversalSpriteSheet(path, texture)
}

export class CharacterSpriteWithOneSpriteSheet extends CharacterSprite {
  #spriteSheet: any | null = null

  constructor(
    object: GameObject,
    container: Container,
    spriteSheet: Spritesheet,
  ) {
    super(object, container)

    this.#spriteSheet = spriteSheet

    this._determineTextures = this._determineTextures.bind(this)

    this.sprite.addChild(
      createAnimatedSprite(this.#spriteSheet.animations.down),
    )
  }

  protected _updateTextures() {
    this._updateTexture(0, this._determineTextures)
  }

  private _determineTextures(): Texture<Resource>[] {
    return this._determineTexture(this.#spriteSheet)
  }
}
