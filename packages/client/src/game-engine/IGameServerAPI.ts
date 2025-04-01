import type { ServerConnection } from "./ServerConnection.js"
import type { Move } from "./protos/Move.js"

export interface IGameServerAPI {
  serverConnection: ServerConnection

  move(move: Move): void
}
