import type { IGameServerAPI } from "../IGameServerAPI.js"
import type { Direction } from "../Direction.js"
import type { MessageType, PartialMessage } from "@protobuf-ts/runtime"
import type { ServerConnection } from "../ServerConnection.js"
import { Move } from "../protos/Move.js"
import type { Move as Move2 } from "./Move.js"
import { MessageType as EngineMessageType } from "./MessageType.js"

interface Message {
  body:
    | {
        oneofKind: string
        [key: string]: any
      }
    | {
        oneofKind: undefined
      }
}

export class GameServerAPI<T extends Message> implements IGameServerAPI {
  serverConnection: ServerConnection
  Message: {
    create(value?: PartialMessage<T>): T
  }

  constructor(
    serverConnection: ServerConnection,
    Message: MessageType<T> & {
      create(value?: PartialMessage<T>): T
    },
  ) {
    this.serverConnection = serverConnection
    this.Message = Message
  }

  move(move: Move2): void {
    this.serverConnection.outStream.next(
      this.Message.create({
        body: {
          oneofKind: EngineMessageType.Move,
          move: Move.create(move),
        },
      } as any),
    )
  }
}
