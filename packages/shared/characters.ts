import type { Character } from "../game-engine/Character.js"
import type { GUID } from "../game-engine/GUID.js"

type UserId = string

export class Characters {
  userIdToCharacter = new Map<UserId, Character>()
  guidToCharacter = new Map<GUID, Character>()

  retrieveCharacterByUserId(userId: UserId): Character | undefined {
    return this.userIdToCharacter.get(userId)
  }

  retrieveCharacterByGUID(guid: GUID): Character | undefined {
    return this.guidToCharacter.get(guid)
  }

  setCharacterWithUserId(userId: UserId, character: Character) {
    this.userIdToCharacter.set(userId, character)
  }

  setCharacter(character: Character) {
    if (character.userId) {
      this.userIdToCharacter.set(character.userId, character)
    }

    if (character.id) {
      this.guidToCharacter.set(character.id, character)
    }
  }

  removeCharacter(character: Character) {
    if (character.userId) {
      this.userIdToCharacter.delete(character.userId)
    }

    if (character.id) {
      this.guidToCharacter.delete(character.id)
    }
  }

  removeCharacterByGUID(id: GUID) {
    const character = this.guidToCharacter.get(id)
    if (character) {
      this.removeCharacter(character)
    }
  }
}
