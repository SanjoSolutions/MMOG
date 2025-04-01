type UserId = string
type Character = any

export const characters = new Map<UserId, Character>()

export function retrieveCharacter(userId: UserId): Character | undefined {
  return characters.get(userId)
}
