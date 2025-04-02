import type { Server } from "../index.js"
import type { MoveFromServerData } from "../shared/communication/messagesFromServer.js"
import type { ID } from "../shared/ID.js"
import { sendMovementToClient } from "./sendMovementToClient.js"

export async function sendMovementToOtherClients(
  server: Server,
  socket: WebSocket,
  object: MoveFromServerData,
  userID: ID,
): Promise<void> {
  server.doForAllOthers((client) => {
    sendMovementToClient(client, object, userID)
  })
}
