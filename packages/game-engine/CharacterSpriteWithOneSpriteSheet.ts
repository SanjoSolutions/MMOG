import { Assets, type Container, type Resource, type Texture } from "pixi.js"
import { CharacterSprite } from "./CharacterSprite.js"
import type { GameObject } from "./GameObject.js"
import { createAnimatedSprite } from "./createAnimatedSprite.js"
import { createUniversalSpriteSheet } from "./createUniversalSpriteSheet.js"

export class CharacterSpriteWithOneSpriteSheet extends CharacterSprite {
  #spriteSheetPath: string
  #hasSpriteSheetBeenLoaded: boolean = false
  #spriteSheet: any | null = null

  constructor(
    object: GameObject,
    container: Container,
    spriteSheetPath: string,
  ) {
    super(object, container)

    this.#spriteSheetPath = spriteSheetPath

    this._determineTextures = this._determineTextures.bind(this)
  }

  async loadSpriteSheet() {
    if (!this.#hasSpriteSheetBeenLoaded) {
      Assets.add({ src: this.#spriteSheetPath })
      const spriteSheet = await Assets.load(this.#spriteSheetPath)

      this.#spriteSheet = await createUniversalSpriteSheet(
        this.#spriteSheetPath,
        spriteSheet,
      )

      this.#hasSpriteSheetBeenLoaded = true

      this.sprite.addChild(
        createAnimatedSprite(this.#spriteSheet.animations.down),
      )
    }
  }

  protected _updateTextures() {
    this._updateTexture(0, this._determineTextures)
  }

  private _determineTextures(): Texture<Resource>[] {
    return this._determineTexture(this.#spriteSheet)
  }
}
