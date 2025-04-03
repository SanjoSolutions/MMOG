import { AnimatedSprite, Resource, Texture } from "pixi.js"

export function createAnimatedSprite(
  textures: Texture<Resource>[],
): AnimatedSprite {
  const animatedSprite = new AnimatedSprite(textures)
  animatedSprite.animationSpeed = 0.115
  return animatedSprite
}
