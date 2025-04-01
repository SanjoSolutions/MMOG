import { Sprite } from "pixi.js"
import { Branch } from "./Branch.js"
import type { Game } from "./Game.js"
import { last } from "./array.js"

export interface SerializedSprite {
  id?: number
  class: string
  x: number
  y: number
  texture: string
  anchor: {
    x: number
    y: number
  }
}

export type SpriteWithId = Sprite & {
  id?: number
}

export function serializeSprite(sprite: SpriteWithId): SerializedSprite {
  const serializedSprite: SerializedSprite = {
    class: sprite.constructor.name,
    x: sprite.x,
    y: sprite.y,
    texture: last(sprite.texture.textureCacheIds),
    anchor: {
      x: sprite.anchor.x,
      y: sprite.anchor.y,
    },
  }
  if (sprite.id) {
    serializedSprite.id = sprite.id
  }
  return serializedSprite
}

export function deserializeSprite(
  game: Game,
  object: SerializedSprite,
): SpriteWithId {
  const classes = new Map([Branch].map((klass) => [klass.name, klass]))
  const klass = classes.get(object.class) ?? Sprite
  const sprite = klass.from(object.texture) as SpriteWithId
  ;(sprite as any).game = game
  sprite.id = object.id
  sprite.anchor.set(object.anchor.x, object.anchor.y)
  sprite.x = object.x
  sprite.y = object.y
  return sprite
}
