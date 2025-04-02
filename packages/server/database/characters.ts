type UserId = string
type Character = any

export const characters = new Map<UserId, Character>()

export function retrieveCharacter(userId: UserId): Character | undefined {
  return characters.get(userId)
}

export function setCharacter(userId: UserId, character: Character) {
  return characters.set(userId, character)
}
