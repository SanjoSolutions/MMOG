import {
  type ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi'
import { MessageType } from '@sanjo/mmog-shared/communication/communication.js'
import {
  compressMoveFromServerData,
  MoveFromServerData,
} from '@sanjo/mmog-shared/communication/messagesFromServer.js'
import type { ID } from '@sanjo/mmog-shared/ID.js'
import { postToConnection } from './postToConnection.js'

export async function sendMovementToClient(
  apiGwManagementApi: ApiGatewayManagementApiClient,
  object: MoveFromServerData,
  connectionId: string,
  userID: ID
): Promise<void> {
  let data
  if (userID === object.userID) {
    data = { ...object, isCharacterOfClient: true }
  } else {
    data = object
  }
  await postToConnection(
    apiGwManagementApi,
    new PostToConnectionCommand({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        type: MessageType.Move,
        data: compressMoveFromServerData(data),
      }),
    })
  )
}
