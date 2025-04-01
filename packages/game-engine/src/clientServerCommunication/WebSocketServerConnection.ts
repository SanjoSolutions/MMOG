import { Subject } from "rxjs"
import { Message as MessageBase } from "../protos/Message.js"
import type { MessageType } from "@protobuf-ts/runtime"
import type { ServerConnection } from "../ServerConnection.js"

export class WebSocketServerConnection<T> implements ServerConnection {
  protected webSocket: WebSocket | null = null
  inStream: Subject<T> = new Subject<T>()
  outStream: Subject<T> = new Subject<T>()
  Message: MessageType<any>

  constructor(Message: MessageType<any> = MessageBase) {
    this.Message = Message
  }

  async connect(
    url: string | URL,
    protocols?: string | string[],
  ): Promise<void> {
    return new Promise((resolve) => {
      this.webSocket = new WebSocket(url, protocols)

      this.webSocket.onerror = console.error

      this.webSocket.onopen = () => {
        resolve()
      }

      this.webSocket.onmessage = async (event) => {
        const arrayBuffer = await event.data.arrayBuffer()
        const message = this.Message.fromBinary(new Uint8Array(arrayBuffer))
        this.inStream.next(message)
      }

      this.outStream.subscribe((message) => {
        this.webSocket!.send(this.Message.toBinary(message))
      })
    })
  }
}
