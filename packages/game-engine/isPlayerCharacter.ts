import { Character } from "./Character.js"
import type { GameObject } from "./GameObject.js"

export function isPlayerCharacter(entity: GameObject): boolean {
  return entity instanceof Character
}
