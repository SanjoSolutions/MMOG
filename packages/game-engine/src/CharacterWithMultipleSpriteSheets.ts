import {
  Assets,
  type Container,
  type Resource,
  type Spritesheet,
  type Texture,
} from "pixi.js"
import { createAnimatedSprite } from "./createAnimatedSprite.js"
import { createUniversalSpriteSheet } from "./createUniversalSpriteSheet.js"
import { Character } from "./Character.js"

export class CharacterWithMultipleSpriteSheets extends Character {
  static #haveSpriteSheetsBeenLoaded: boolean = false
  static #bodySpriteSheet: any | null = null
  static #headSpriteSheet: any | null = null
  static #hairSpriteSheet: any | null = null

  static async loadSpriteSheets() {
    if (!CharacterWithMultipleSpriteSheets.#haveSpriteSheetsBeenLoaded) {
      Assets.add(
        "body",
        "assets/spritesheets/body/bodies/male/universal/light.png",
      )
      Assets.add(
        "head",
        "assets/spritesheets/head/heads/human_male/universal/light.png",
      )
      Assets.add("hair", "assets/spritesheets/hair/afro/male/black.png")
      const {
        body,
        head,
        hair,
      }: {
        body: Texture<Resource>
        head: Texture<Resource>
        hair: Texture<Resource>
        plants: Spritesheet
      } = (await Assets.load(["body", "head", "hair"])) as any

      CharacterWithMultipleSpriteSheets.#bodySpriteSheet =
        await createUniversalSpriteSheet("body", body)
      CharacterWithMultipleSpriteSheets.#headSpriteSheet =
        await createUniversalSpriteSheet("head", head)
      CharacterWithMultipleSpriteSheets.#hairSpriteSheet =
        await createUniversalSpriteSheet("hair", hair)

      CharacterWithMultipleSpriteSheets.#haveSpriteSheetsBeenLoaded = true
    }
  }

  constructor(container: Container) {
    super(container)

    this._determineBodyTextures = this._determineBodyTextures.bind(this)
    this._determineHeadTextures = this._determineHeadTextures.bind(this)
    this._determineHairTextures = this._determineHairTextures.bind(this)

    this.sprite.addChild(
      createAnimatedSprite(
        CharacterWithMultipleSpriteSheets.#bodySpriteSheet.animations.down,
      ),
    )
    this.sprite.addChild(
      createAnimatedSprite(
        CharacterWithMultipleSpriteSheets.#headSpriteSheet.animations.down,
      ),
    )
    this.sprite.addChild(
      createAnimatedSprite(
        CharacterWithMultipleSpriteSheets.#hairSpriteSheet.animations.down,
      ),
    )
  }

  protected _updateTextures() {
    this._updateTexture(0, this._determineBodyTextures)
    this._updateTexture(1, this._determineHeadTextures)
    this._updateTexture(2, this._determineHairTextures)
  }

  private _determineBodyTextures(): Texture<Resource>[] {
    return this._determineTexture(
      CharacterWithMultipleSpriteSheets.#bodySpriteSheet,
    )
  }

  private _determineHeadTextures(): Texture<Resource>[] {
    return this._determineTexture(
      CharacterWithMultipleSpriteSheets.#headSpriteSheet,
    )
  }

  private _determineHairTextures(): Texture<Resource>[] {
    return this._determineTexture(
      CharacterWithMultipleSpriteSheets.#hairSpriteSheet,
    )
  }
}
