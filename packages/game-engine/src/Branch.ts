import {
  Sprite,
  Texture,
  type IBaseTextureOptions,
  type SpriteSource,
} from "pixi.js"
import type { Game } from "./Game.js"
import { Interactable } from "./Interactable.js"
import { isPlayerCharacter } from "./isPlayerCharacter.js"
import type { Object } from "./Object.js"
import type { IGameServerAPI } from "./IGameServerAPI.js"

export class Branch extends Interactable {
  #game: Game<IGameServerAPI> | null = null

  /**
   * Helper function that creates a new branch sprite based on the source you provide.
   * The source can be - frame id, image url, video url, canvas element, video element, base texture
   * @param {string|PIXI.Texture|HTMLImageElement|HTMLVideoElement|ImageBitmap|PIXI.ICanvas} source
   *     - Source to create texture from
   * @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
   * @returns The newly created branch sprite
   */
  static from(source: SpriteSource, options?: IBaseTextureOptions): Branch {
    const texture =
      source instanceof Texture ? source : Texture.from(source, options)

    return new this(texture)
  }

  set game(value: Game<IGameServerAPI> | null) {
    this.#game = value
  }

  canInteractWith(entity: Object): boolean {
    return isPlayerCharacter(entity)
  }

  interact(interacter: Sprite): void {
    if (this.#game) {
      this.#game.objectInHand = this
    }
  }
}
