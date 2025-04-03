import type { GUID } from "../client/src/game-engine/GUID.js"

type UserId = string
type Character = any

export const userIdToCharacter = new Map<UserId, Character>()
export const guidToCharacter = new Map<GUID, Character>()

export function retrieveCharacterByUserId(
  userId: UserId,
): Character | undefined {
  return userIdToCharacter.get(userId)
}

export function retrieveCharacterByGUID(guid: GUID): Character | undefined {
  return guidToCharacter.get(guid)
}

export function setCharacterWithUserId(userId: UserId, character: Character) {
  userIdToCharacter.set(userId, character)
}

export function setCharacter(character: Character) {
  if (character.userId) {
    userIdToCharacter.set(character.userId, character)
  }

  if (character.id) {
    guidToCharacter.set(character.id, character)
  }
}
