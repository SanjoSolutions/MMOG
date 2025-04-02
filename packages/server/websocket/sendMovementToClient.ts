import { MessageType } from "../../shared/communication/communication.js"
import {
  compressMoveFromServerData,
  type MoveFromServerData,
} from "../../shared/communication/messagesFromServer.js"
import type { ID } from "../../shared/ID.js"

export async function sendMovementToClient(
  socket: WebSocket,
  object: MoveFromServerData,
  userID: ID,
): Promise<void> {
  let data
  if (userID === object.userID) {
    data = { ...object, isCharacterOfClient: true }
  } else {
    data = object
  }

  socket.send(
    JSON.stringify({
      type: MessageType.Move,
      data: compressMoveFromServerData(data),
    }),
  )
}
