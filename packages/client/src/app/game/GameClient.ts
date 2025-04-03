import { Observable, type Subscriber } from "rxjs"
import { create as createTimeSync, type TimeSync } from "timesync"
import { Character } from "../../../../game-engine/Character.js"
import { Characters } from "../../../../shared/characters.js"
import {
  deserializeMessage,
  serializeMessage,
} from "../../../../shared/message.js"
import { now } from "../../../../shared/now.js"
import type { Character as CharacterProto } from "../../../../shared/proto/Character.js"
import type { Despawn } from "../../../../shared/proto/Despawn.js"
import { MessageType as MessageType2 } from "../../../../shared/proto/Message.js"
import { Move } from "../../../../shared/proto/Move.js"
import type { Spawn } from "../../../../shared/proto/Spawn.js"
import { wait } from "./wait.js"

export class GameClient {
  socket: WebSocket | null = null
  characters = new Characters()
  _spawnSubscriber: Subscriber<Spawn> | null = null
  onSpawn = new Observable<Spawn>((subscriber: Subscriber<Spawn>) => {
    this._spawnSubscriber = subscriber
  })
  _moveSubscriber: Subscriber<Move> | null = null
  onMove = new Observable<Move>((subscriber: Subscriber<Move>) => {
    this._moveSubscriber = subscriber
  })
  _despawnSubscriber: Subscriber<Despawn> | null = null
  onDespawn = new Observable<Despawn>((subscriber: Subscriber<Despawn>) => {
    this._despawnSubscriber = subscriber
  })
  _timeSync: TimeSync | null = null
  _lastSentMovement: CharacterProto | null = null

  async connect(jwt: string): Promise<void> {
    if (!this.socket) {
      return new Promise<void>((resolve) => {
        this.socket = new WebSocket(
          `${process.env.NEXT_PUBLIC_WEBSOCKET_API_URL!}?jwt=${jwt}`,
        )

        const onOpen = () => {
          this.socket!.removeEventListener("open", onOpen)
          this._initializeTimeSync()
          resolve()
        }

        const onDisconnect = () => {
          this.socket = null
          this._timeSync?.destroy()
          this._timeSync = null
        }

        this.socket.addEventListener("open", onOpen)
        this.socket.addEventListener("close", onDisconnect)
        this.socket.addEventListener("error", onDisconnect)
        this.socket.addEventListener("message", async (event) => {
          if (window.SIMULATE_HIGH_LATENCY) {
            await wait(500)
          }
          const { type, data } = deserializeMessage(
            new Uint8Array(await event.data.arrayBuffer()),
          )
          switch (type) {
            case MessageType2.Spawn:
              this._handleSpawn(data)
              break
            case MessageType2.Move:
              this._handleMove(data)
              break
            case MessageType2.Despawn:
              this._handleDespawn(data)
              break
          }

          // const body = JSON.parse(event.data)
          // const { type, data } = body
          // if (type === MessageType.Move) {
          //   const moveData = decompressMoveFromServerData(data)
          //   let object
          //   if (moveData.isCharacterOfClient) {
          //     object = character
          //   } else {
          //     object = retrieveOrCreateObject({
          //       id: moveData.id,
          //       type: ObjectType.Character,
          //     })
          //   }
          //   if (object.lastI === null || moveData.i > object.lastI) {
          //     object.update(moveData)
          //     object.lastI = moveData.i
          //   }
          // } else if (type === MessageType.Objects) {
          //   const { objects } = data
          //   for (const objectData of objects) {
          //     let object
          //     if (objectData.isCharacterOfClient) {
          //       object = character
          //     } else {
          //       object = retrieveOrCreateObject({
          //         id: objectData.id,
          //         type: objectData.type,
          //       })
          //     }
          //     object.update(objectData)
          //   }
          // } else if (type === MessageType.OtherClientDisconnected) {
          //   const { connectionId } = data
          //   const object = objects.get(connectionId)
          //   if (object) {
          //     objectsContainer.removeChild(object.sprite)
          //     objects.delete(connectionId)
          //   }
          // } else if (type === MessageType.PlantHasGrown) {
          //   const { id, stage } = data
          //   const object = retrieveOrCreateObject({
          //     id,
          //     type: ObjectType.Plant,
          //   }) as Plant
          //   object.stage = stage
          // }
        })
      })
    }
  }

  async _handleSpawn(data: Spawn) {
    const character = new Character()
    if (data.character) {
      Object.assign(character, data.character, {
        baseX: data.character.x,
        baseY: data.character.y,
      })
    }
    this.characters.setCharacter(character)
    this._spawnSubscriber?.next(data)
  }

  async _handleMove(data: Move) {
    if (data.character) {
      const character = this.characters.retrieveCharacterByGUID(
        data.character.id,
      )
      if (character) {
        Object.assign(character, data.character)
        character.baseX = character.x
        character.baseY = character.y
        character.whenMovingHasChanged = data.whenMovingHasChanged
      }
    }
    this._moveSubscriber?.next(data)
  }

  async _handleDespawn(data: Despawn) {
    this._despawnSubscriber?.next(data)
    const character = this.characters.retrieveCharacterByGUID(data.id)
    if (character) {
      this.characters.removeCharacterByGUID(data.id)
    }
  }

  async disconnect() {
    return new Promise<void>((resolve) => {
      if (this.socket) {
        this.socket!.addEventListener("close", () => resolve())
        this.socket.close()
      } else {
        resolve()
      }
    })
  }

  now() {
    return this._timeSync ? this._timeSync.now() : now()
  }

  async move(data: Move) {
    const OPEN = 1
    if (this.socket && this.socket.readyState === OPEN) {
      this._lastSentMovement = {
        ...data.character,
      }
      if (window.SIMULATE_HIGH_LATENCY) {
        await wait(500)
      }
      this.socket.send(
        serializeMessage({
          type: MessageType2.Move,
          data,
        }),
      )
    }
  }

  _initializeTimeSync() {
    if (this.socket) {
      this.socket.addEventListener("message", async (event) => {
        if (window.SIMULATE_HIGH_LATENCY) {
          await wait(500)
        }
        const { type, data } = deserializeMessage(
          new Uint8Array(await event.data.arrayBuffer()),
        )
        if (type === MessageType2.TimeSync) {
          const { id, time } = data
          this._timeSync?.receive({
            id,
            result: time,
          })
        }
      })

      this._timeSync = Object.assign(
        createTimeSync({
          server: this.socket!,
          now,
        }),
        {
          async send(to: WebSocket, data: any, timeout) {
            // TODO: Implement timeout?
            const data2 = serializeMessage({
              type: MessageType2.TimeSync,
              data: {
                id: data.id,
                time: data.result || 0,
              },
            })
            to.send(data2)
          },
        },
      )
    }
  }
}
