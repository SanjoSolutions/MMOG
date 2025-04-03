import type { Direction } from "../Direction.js"
import type { GUID } from "../GUID.js"
import type { Message } from "./Message.js"
import type { MessageType } from "./MessageType.js"

export interface Move extends Message {
  type: MessageType.Move
  GUID: GUID
  facingDirection: Direction
  movingDirection: Direction
}
