import type { Object } from "./Object.js"
import { Character } from "./Character.js"

export function isPlayerCharacter(entity: Object): boolean {
  return entity instanceof Character
}
