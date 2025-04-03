import type { Character } from "./protos/Character.js"

export function convertPositionToUnsignedIntegers(
  character: Character,
): Character {
  return {
    ...character,
    x: Math.round(character.x),
    y: Math.round(character.y),
  }
}
