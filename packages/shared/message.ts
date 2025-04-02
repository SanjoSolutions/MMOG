import { Message as MessageProto, MessageType } from "./proto/Message"
import { Move } from "./proto/Move.js"
import { Spawn } from "./proto/Spawn"
import { Test } from "./proto/Test"
import { Test2 } from "./proto/Test2"
import { TimeSync } from "./proto/TimeSync"

export interface TestMessage {
  type: MessageType.Test
  data: Test
}

export interface Test2Message {
  type: MessageType.Test2
  data: Test2
}

export interface TimeSyncMessage {
  type: MessageType.TimeSync
  data: TimeSync
}

export interface MoveMessage {
  type: MessageType.Move
  data: Move
}

export interface SpawnMessage {
  type: MessageType.Spawn
  data: Spawn
}

export type ClientMessage =
  | TestMessage
  | Test2Message
  | TimeSyncMessage
  | MoveMessage
export type ServerMessage =
  | TestMessage
  | Test2Message
  | TimeSyncMessage
  | SpawnMessage
export type Message = ClientMessage | ServerMessage

const typeToClass = new Map<MessageType, any>([
  [MessageType.Test, Test],
  [MessageType.Test2, Test2],
  [MessageType.TimeSync, TimeSync],
  [MessageType.Move, Move],
  [MessageType.Spawn, Spawn],
])

export function serializeMessage(message: Message) {
  const klass = typeToClass.get(message.type)
  if (klass) {
    return MessageProto.toBinary({
      type: message.type,
      data: klass.toBinary(message.data),
    })
  } else {
    throw new Error(`Invalid message type: ${message.type}`)
  }
}

export function deserializeMessage(serializedMessage: Uint8Array): Message {
  const { type, data: serializedData } =
    MessageProto.fromBinary(serializedMessage)
  if (type !== MessageType.None) {
    const klass = typeToClass.get(type)
    if (klass) {
      const data = klass.fromBinary(serializedData)
      return {
        type,
        data,
      }
    }
  }

  throw new Error(`Invalid message type: ${type}`)
}
