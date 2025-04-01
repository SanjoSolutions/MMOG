import { Assets, type Container, type Resource, type Texture } from "pixi.js"
import { createAnimatedSprite } from "./createAnimatedSprite.js"
import { createUniversalSpriteSheet } from "./createUniversalSpriteSheet.js"
import { Character } from "./Character.js"

export class CharacterWithOneSpriteSheet extends Character {
  #spriteSheetPath: string
  #hasSpriteSheetBeenLoaded: boolean = false
  #spriteSheet: any | null = null

  constructor(spriteSheetPath: string, container: Container) {
    super(container)

    this.#spriteSheetPath = spriteSheetPath

    this._determineTextures = this._determineTextures.bind(this)
  }

  async loadSpriteSheet() {
    if (!this.#hasSpriteSheetBeenLoaded) {
      Assets.add(this.#spriteSheetPath, this.#spriteSheetPath)
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
