import { createClient } from "@supabase/supabase-js"
import { createServer, IncomingMessage } from "http"
import { WebSocket, WebSocketServer } from "ws"
import { scanThroughAll } from "./database/scanThroughAll.js"
import { HALF_HEIGHT, HALF_WIDTH } from "./maximumSupportedResolution.js"
import { handler as move } from "./move/index.js"
import type { Connection } from "./shared/database.js"
import type { ID } from "./shared/ID.js"
import { sendMovementToClient } from "./websocket/sendMovementToClient.js"

const supabase = createClient()

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

  sendToAllOthers(data: string, socket: WebSocket) {
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
    const url = new URL(request.url)
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
  socket.on("error", console.error)

  socket.on("message", function message(rawData) {
    const { type, data } = JSON.parse(rawData)
    console.log("received: %s", rawData, type, data)
    if (type === "move") {
      move({ server, socket, data })
    }
  })

  socket.send("something")
})

// Environment variables required:
// * API_GATEWAY_URL

const TICK_RATE = 30 // ticks per second
const MAXIMUM_NUMBER_OF_ITEMS_THAT_CAN_BE_IN_IN_EXPRESSION = 100

async function main() {
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
