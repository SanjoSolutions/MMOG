import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"
import { createServer, IncomingMessage } from "http"
import { WebSocket, WebSocketServer } from "ws"
import {
  guidToCharacter,
  removeCharacter,
  retrieveCharacterByUserId,
  setCharacter,
} from "../shared/characters.js"
import type { Connection } from "../shared/database.js"
import { Direction } from "../shared/Direction.js"
import type { ID } from "../shared/ID.js"
import { deserializeMessage, serializeMessage } from "../shared/message.js"
import { now } from "../shared/now.js"
import { MessageType } from "../shared/proto/Message.js"
import type { Move } from "../shared/proto/Move.js"
import type { Test } from "../shared/proto/Test.js"
import type { Test2 } from "../shared/proto/Test2.js"
import type { TimeSync } from "../shared/proto/TimeSync.js"
import { scanThroughAll } from "./database/scanThroughAll.js"
import { HALF_HEIGHT, HALF_WIDTH } from "./maximumSupportedResolution.js"
import { sendMovementToClient } from "./websocket/sendMovementToClient.js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
)

const httpServer = createServer()
const server = Object.assign(new WebSocketServer({ noServer: true }), {
  sendToAll(data: string) {
    this.doForAll((client) => {
      client.send(data)
    })
  },

  doForAll(callback: (client: WebSocket) => void) {
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        callback(client)
      }
    })
  },

  sendToAllOthers(data: Uint8Array<ArrayBufferLike>, socket: WebSocket) {
    this.doForAllOthers((client) => {
      client.send(data)
    }, socket)
  },

  doForAllOthers(callback: (client: WebSocket) => void, socket: WebSocket) {
    server.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        callback(client)
      }
    })
  },
})

export type Server = typeof server

function onSocketError(error) {
  console.error(error)
}

httpServer.on("upgrade", async (request, socket, head) => {
  socket.on("error", onSocketError)

  const user = await authenticate(request)
  if (user) {
    socket.removeListener("error", onSocketError)
    server.handleUpgrade(request, socket, head, function done(ws) {
      server.emit("connection", Object.assign(ws, { userId: user.id }))
    })
  } else {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n")
    socket.destroy()
  }
})

async function authenticate(request: IncomingMessage) {
  if (request.url) {
    const url = new URL(request.url, "http://localhost")
    const jwt = url.searchParams.get("jwt")
    if (jwt) {
      const { error, data } = await supabase.auth.getUser(jwt)
      if (!error && data.user) {
        return data.user
      }
    }
  }
}

export interface WebSocketWithUserId extends WebSocket {
  userId: string
}

server.on("connection", function connection(socket: WebSocketWithUserId) {
  let hasSentCharacterToOtherClients = false

  socket.on("error", console.error)

  socket.on("close", () => {
    const character = retrieveCharacterByUserId(socket.userId)
    if (character) {
      if (hasSentCharacterToOtherClients) {
        server.sendToAllOthers(
          serializeMessage({
            type: MessageType.Despawn,
            data: { id: character.id },
          }),
          socket,
        )
      }

      removeCharacter(character)
    }
  })

  const character = {
    userId: socket.userId,
    id: randomUUID(),
    isMoving: false,
    x: 0,
    y: 0,
    facingDirection: Direction.Down,
  }

  setCharacter(character)

  socket.send(
    serializeMessage({
      type: MessageType.Spawn,
      data: {
        character,
        canMove: true,
      },
    }),
  )

  const playerCharacter = character
  for (const character of guidToCharacter.values()) {
    if (character.id !== playerCharacter.id) {
      socket.send(
        serializeMessage({
          type: MessageType.Spawn,
          data: {
            character,
            canMove: false,
          },
        }),
      )
    }
  }

  server.sendToAllOthers(
    serializeMessage({
      type: MessageType.Spawn,
      data: {
        character,
        canMove: false,
      },
    }),
    socket,
  )
  hasSentCharacterToOtherClients = true

  socket.on("message", function message(rawData, isBinary) {
    if (isBinary) {
      const { type, data } = deserializeMessage(rawData as Buffer)
      switch (type) {
        case MessageType.Test:
          handleTest(socket, data)
          break
        case MessageType.Test2:
          handleTest2(socket, data)
          break
        case MessageType.TimeSync:
          handleTimeSync(socket, data)
          break
        case MessageType.Move:
          handleMove(socket, data)
          break
      }
    }
  })
})

function handleTest(socket: WebSocketWithUserId, message: Test) {}

function handleTest2(socket: WebSocketWithUserId, message: Test2) {}

function handleTimeSync(socket: WebSocketWithUserId, message: TimeSync) {
  socket.send(
    serializeMessage({
      type: MessageType.TimeSync,
      data: {
        id: message.id,
        time: now(),
      },
    }),
  )
}

function handleMove(socket: WebSocketWithUserId, message: Move) {
  const character = retrieveCharacterByUserId(socket.userId)
  if (character && character.id === message.character.id) {
    Object.assign(character, message.character)
    character.whenMovingHasChanged = message.whenMovingHasChanged

    server.sendToAllOthers(
      serializeMessage({
        type: MessageType.Move,
        data: {
          character,
          whenMovingHasChanged: message.whenMovingHasChanged,
        },
      }),
      socket,
    )
  }
}

// Environment variables required:
// * API_GATEWAY_URL

const TICK_RATE = 30 // ticks per second
const MAXIMUM_NUMBER_OF_ITEMS_THAT_CAN_BE_IN_IN_EXPRESSION = 100

async function main() {
  const port = process.env.PORT || 8080
  httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}.`)
  })
  // while (true) {
  //   let lastRun = Date.now();
  //   await scanThroughAll(
  //     createScanCommandInputForAllConnections,
  //     async (output) => {
  //       const items = output.Items;
  //       if (items) {
  //         await Promise.all(
  //           items.map((connection) =>
  //             sendObjectsToTheClient(
  //               connection as Pick<
  //                 Connection,
  //                 | "id"
  //                 | "connectionId"
  //                 | "objectsThatHaveBeenSentToTheClient"
  //                 | "x"
  //                 | "y"
  //               >,
  //             )
  //           ),
  //         );
  //       }
  //     },
  //   );
  //   const durationToWait = Math.max(
  //     1000 / TICK_RATE - (Date.now() - lastRun),
  //     0,
  //   );
  //   if (durationToWait > 0) {
  //     await wait(durationToWait);
  //   }
  // }
}

main()

async function wait(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

async function sendObjectsToTheClient(
  connection: Pick<
    Connection,
    "id" | "connectionId" | "objectsThatHaveBeenSentToTheClient" | "x" | "y"
  >,
) {
  const first100ObjectsThatHaveBeenSentToTheClient =
    connection.objectsThatHaveBeenSentToTheClient
      ? connection.objectsThatHaveBeenSentToTheClient.slice(
          0,
          MAXIMUM_NUMBER_OF_ITEMS_THAT_CAN_BE_IN_IN_EXPRESSION,
        )
      : []
  const remainingObjectsThatHaveBeenSentToTheClient = new Set(
    connection.objectsThatHaveBeenSentToTheClient
      ? connection.objectsThatHaveBeenSentToTheClient.slice(
          MAXIMUM_NUMBER_OF_ITEMS_THAT_CAN_BE_IN_IN_EXPRESSION,
        )
      : [],
  )
  await scanThroughAll(
    () =>
      createScanCommandInputForConnectionsToSendToClient(
        connection,
        first100ObjectsThatHaveBeenSentToTheClient,
      ),
    async (output) => {
      const objects = output.Items as Pick<
        Connection,
        | "id"
        | "connectionId"
        | "x"
        | "y"
        | "direction"
        | "isMoving"
        | "whenMovingHasChanged"
        | "i"
      >[]
      if (objects) {
        const objectsToSendToTheClient = objects.filter((object) => {
          return !remainingObjectsThatHaveBeenSentToTheClient.has(object.id)
        })
        await sendObjectsToTheClient2(
          objectsToSendToTheClient,
          connection.connectionId,
        )
      }
    },
  )
}

async function sendObjectsToTheClient2(
  objectsToSendToTheClient: Pick<
    Connection,
    | "id"
    | "connectionId"
    | "x"
    | "y"
    | "direction"
    | "isMoving"
    | "whenMovingHasChanged"
    | "i"
  >[],
  connectionId: string,
): Promise<void> {
  const apiGwManagementApi = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: process.env.API_GATEWAY_URL,
  })
  await Promise.all(
    objectsToSendToTheClient.map((object) =>
      sendMovementToClient(apiGwManagementApi, object, connectionId),
    ),
  )
}

function createScanCommandInputForAllConnections(): ScanCommandInput {
  return {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    ProjectionExpression:
      "id, connectionId, objectsThatHaveBeenSentToTheClient, x, y",
  }
}

function createScanCommandInputForConnectionsToSendToClient(
  connection: Pick<Connection, "id" | "x" | "y">,
  objectsThatHaveBeenSentToTheClient: ID[],
): ScanCommandInput {
  return {
    TableName: process.env.CONNECTIONS_TABLE_NAME,
    ProjectionExpression:
      "id, connectionId, x, y, direction, isMoving, whenMovingHasChanged, i",
    FilterExpression:
      "id <> :id AND x BETWEEN :x1 AND :x2 AND y BETWEEN :y1 AND :y2 AND NOT id IN (:ids)",
    ExpressionAttributeValues: {
      ":id": connection.id,
      ":x1": connection.x - HALF_WIDTH,
      ":x2": connection.x + HALF_WIDTH,
      ":y1": connection.y - HALF_HEIGHT,
      ":y2": connection.y + HALF_HEIGHT,
      ":ids": objectsThatHaveBeenSentToTheClient,
    },
  }
}
