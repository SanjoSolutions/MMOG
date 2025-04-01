import { Assets, type Container, type Resource, type Texture } from "pixi.js"
import { createAnimatedSprite } from "./createAnimatedSprite.js"
import { createOpenRTPSpriteSheet } from "./createOpenRTPSpriteSheet.js"
import { Character } from "./Character.js"

export class CharacterWithOpenRTPSpriteSheet extends Character {
  #spriteSheetPath: string
  #hasSpriteSheetBeenLoaded: boolean = false
  #spriteSheet: any | null = null
  #basePosition: { x: number; y: number }

  constructor(
    spriteSheetPath: string,
    container: Container,
    basePosition: { x: number; y: number },
  ) {
    super(container)

    this.#spriteSheetPath = spriteSheetPath
    this.#basePosition = basePosition
  }

  async loadSpriteSheet() {
    if (!this.#hasSpriteSheetBeenLoaded) {
      Assets.add(this.#spriteSheetPath, this.#spriteSheetPath)
      const spriteSheet = await Assets.load(this.#spriteSheetPath)

      this.#spriteSheet = await createOpenRTPSpriteSheet(
        this.#spriteSheetPath,
        spriteSheet,
        this.#basePosition,
      )

      this.#hasSpriteSheetBeenLoaded = true

      this._determineTextures = this._determineTextures.bind(this)

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
