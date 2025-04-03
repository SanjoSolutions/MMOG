import type { Application } from "pixi.js"
import { Sprite } from "pixi.js"
import type { Game } from "./Game.js"
import {
  deserializeSprite,
  serializeSprite,
  type SpriteWithId,
} from "./serialization.js"

export class Database {
  #database: IDBDatabase | null = null

  async open(): Promise<void> {
    this.#database = await openDatabase()
  }

  async saveState(app: Application): Promise<void> {
    this.checkIfDatabaseHasBeenOpened()
    const transaction = this.#database!.transaction("objects", "readwrite")
    await Promise.all(
      app.stage.children
        .filter((object) => object instanceof Sprite)
        .map((object) => this.saveObject(object as Sprite, transaction)),
    )
  }

  async loadState(game: Game): Promise<boolean> {
    this.checkIfDatabaseHasBeenOpened()
    const transaction = this.#database!.transaction("objects", "readonly")
    const objectStore = transaction.objectStore("objects")
    const objects = await convertRequestToPromise(objectStore.getAll())
    for (const object of objects) {
      game.app.stage.addChild(deserializeSprite(game, object))
    }
    return objects.length >= 1
  }

  async saveObject(
    object: SpriteWithId,
    transaction?: IDBTransaction,
  ): Promise<void> {
    if (!transaction) {
      this.checkIfDatabaseHasBeenOpened()
      transaction = this.#database!.transaction("objects", "readwrite")
    }
    const objectStore = transaction.objectStore("objects")
    const id = await convertRequestToPromise(
      objectStore.put(serializeSprite(object)),
    )
    object.id = id as number
  }

  private checkIfDatabaseHasBeenOpened() {
    if (!this.#database) {
      throw new Error(
        "Please open the database with `await database.open()` before calling this method.",
      )
    }
  }
}

async function convertRequestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.addEventListener("success", function (event) {
      resolve((event.target as any).result)
    })
    request.addEventListener("error", function () {
      reject()
    })
  })
}

async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("generative-game")
    request.onupgradeneeded = function (event) {
      const database = (event.target as any).result
      database.createObjectStore("objects", {
        keyPath: "id",
        autoIncrement: true,
      })
    }
    request.onerror = function (event) {
      console.error(event)
      reject(event)
    }
    request.onsuccess = function (event) {
      const database = (event.target as any).result
      resolve(database)
    }
  })
}
