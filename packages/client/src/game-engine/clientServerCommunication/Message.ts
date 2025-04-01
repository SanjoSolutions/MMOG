import {
  IndexesToPropertyNames,
  decode,
  encode,
  index,
} from "../binarySerialization/index.js"
import type { Character } from "../protos/Character.js"
import type { Error } from "../protos/Error.js"
import type { MessageType } from "./MessageType.js"

export class Message {
  @index(0)
  type: MessageType
}

// export type Message =
//   | {
//       type: MessageType.Error
//       body: Error
//     }
//   | {
//       type: MessageType.Character
//       body: Character
//     }

const propertyNamesToIndexes = {
  type: 0,
  body: 1,
}

const indexesToPropertyNames: IndexesToPropertyNames = {}
for (const [propertyName, index] of Object.entries(propertyNamesToIndexes)) {
  indexesToPropertyNames[index] = propertyName
}

export function encodeMessage<T = Message>(message: T): Uint8Array {
  return encode(message, propertyNamesToIndexes)
}

export function decodeMessage<T = Message>(message: Uint8Array): T {
  return decode(message, propertyNamesToIndexes)
}
