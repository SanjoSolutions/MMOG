import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi"
import type { APIGatewayProxyResultV2 } from "aws-lambda/trigger/api-gateway-proxy.js"
import type { WebSocket } from "ws"
import { retrieveCharacterByUserId } from "../../shared/characters.js"
import { updatePosition } from "../../updatePosition.js"
import { createDynamoDBDocumentClient } from "../database/createDynamoDBDocumentClient.js"
import type { Server } from "../index.js"
import { decompressMoveDataWithI } from "../shared/communication/communication.js"
import type { Direction } from "../shared/Direction.js"
import { sendMovementToClient } from "../websocket/sendMovementToClient.js"
import { sendMovementToOtherClients } from "../websocket/sendMovementToOtherClients.js"

Error.stackTraceLimit = Infinity

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CONNECTIONS_TABLE_NAME: string
    }
  }
}

const database = createDynamoDBDocumentClient()

const { OBJECTS_TABLE_NAME } = process.env

export async function handler({
  server,
  data,
  socket,
}: {
  server: Server
  data: string
  socket: WebSocket
}): Promise<APIGatewayProxyResultV2> {
  const userID = event.requestContext.authorizer.userId
  const moveData = decompressMoveDataWithI(data)
  const whenMovingHasChanged = Date.now()

  const apiGwManagementApi = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  })

  const character = retrieveCharacterByUserId(userID)

  if (character) {
    updatePosition(
      character,
      whenMovingHasChanged - character.whenMovingHasChanged,
    )
    const x = character.x
    const y = character.y

    const isMoving = Boolean(moveData.isMoving)
    const direction = Number(moveData.direction) as Direction

    const movement = {
      id: character.id,
      userID,
      connectionId: event.requestContext.connectionId,
      x,
      y,
      isMoving,
      direction,
      whenMovingHasChanged: whenMovingHasChanged,
      i: Number(moveData.i),
    }

    Object.assign(character, {
      x,
      y,
      isMoving,
      direction,
      whenMovingHasChanged,
    })

    await Promise.all([
      sendMovementToClient(socket, movement, userID),
      sendMovementToOtherClients(server, socket, movement, userID),
    ])
  }

  return { statusCode: 200 }
}
