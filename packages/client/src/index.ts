import { debounce } from "lodash-es"
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Resource,
  Spritesheet,
  Texture,
} from "pixi.js"
import { hasFlag } from "../../hasFlag.js"
import {
  compressMoveDataWithI,
  MessageType,
  MoveData,
} from "../../shared/communication/communication.js"
import { decompressMoveFromServerData } from "../../shared/communication/messagesFromServer.js"
import { Direction } from "../../shared/Direction.js"
import { ObjectType } from "../../shared/ObjectType.js"
import { updatePosition } from "../../updatePosition.js"

let i = 1

declare global {
  interface Window {
    IS_DEVELOPMENT: boolean
    SERVER_URL: string
  }
}

if (window.IS_DEVELOPMENT) {
  new EventSource("/esbuild").addEventListener("change", () =>
    location.reload(),
  )
}

const app = new Application({
  backgroundColor: 0x2f8136,
  resizeTo: window,
})
document.body.appendChild(app.view as any)

Assets.add(
  "idle",
  "assets/sprite/character/Body/Base/Human_male/Ivory/idle.json",
)
Assets.add(
  "walk",
  "assets/sprite/character/Body/Base/Human_male/Ivory/walk.json",
)
Assets.add("plants", "assets/sprites/plants.json")
const {
  idle: idleSpritesheet,
  walk: walkSpritesheet,
  plants: plantsSpritesheet,
} = await Assets.load<Spritesheet>(["idle", "walk", "plants"])

class Object {
  lastI: number | null = null
  _direction: Direction = Direction.Down
  private _isMoving: boolean = false
  sprite: AnimatedSprite = new AnimatedSprite([idleSpritesheet.textures.down])
  baseX: number | null = null
  baseY: number | null = null
  whenMovingHasChanged: number | null = null

  get direction(): Direction {
    return this._direction
  }

  set direction(direction: Direction) {
    this._direction = direction
    this._updateTextures()
  }

  get isMoving(): boolean {
    return this._isMoving
  }

  set isMoving(isMoving: boolean) {
    this._isMoving = isMoving
    this._updateTextures()
    if (isMoving) {
      this.sprite.play()
    } else {
      this.sprite.stop()
    }
  }

  get x(): number {
    return this.sprite.x
  }

  set x(x: number) {
    this.sprite.x = x
  }

  get y(): number {
    return this.sprite.y
  }

  set y(y: number) {
    this.sprite.y = y
  }

  constructor() {
    this.sprite.anchor.set(0.5, 1)
    this.sprite.animationSpeed = 0.115
  }

  updatePosition(): void {
    if (
      this.whenMovingHasChanged &&
      typeof this.baseX === "number" &&
      typeof this.baseY === "number"
    ) {
      const movable = {
        x: this.baseX,
        y: this.baseY,
        isMoving: this.isMoving,
        direction: this.direction,
      }
      updatePosition(movable, Date.now() - this.whenMovingHasChanged)
      this.x = movable.x
      this.y = movable.y
    }
  }

  private _updateTextures() {
    const textures = this._determineTextures()
    if (this.sprite.textures !== textures) {
      this.sprite.textures = textures
      if (this.isMoving) {
        this.sprite.play()
      }
    }
  }

  protected _determineTextures(): Texture<Resource>[] {
    throw new Error("Please implement in a subclass.")
  }
}

class Character extends Object {
  protected _determineTextures(): Texture<Resource>[] {
    if (this.isMoving) {
      if (hasFlag(this.direction, Direction.Up)) {
        return walkSpritesheet.animations.up
      } else if (hasFlag(this.direction, Direction.Down)) {
        return walkSpritesheet.animations.down
      } else if (hasFlag(this.direction, Direction.Left)) {
        return walkSpritesheet.animations.left
      } else if (hasFlag(this.direction, Direction.Right)) {
        return walkSpritesheet.animations.right
      } else {
        return idle.down
      }
    } else {
      if (hasFlag(this.direction, Direction.Up)) {
        return idle.up
      } else if (hasFlag(this.direction, Direction.Down)) {
        return idle.down
      } else if (hasFlag(this.direction, Direction.Left)) {
        return idle.left
      } else if (hasFlag(this.direction, Direction.Right)) {
        return idle.right
      } else {
        return idle.down
      }
    }
  }
}

class Plant extends Object {
  protected _determineTextures(): Texture<Resource>[] {
    return [plantsSpritesheet.textures.tomato_plant_3]
  }
}

const objects = new Map<string, Object>()
const character = new Character()
const objectsContainer = new Container()
objectsContainer.addChild(character.sprite)
app.stage.addChild(objectsContainer)
updateViewport()

const keyStates = new Map([
  ["KeyA", false],
  ["KeyD", false],
  ["KeyW", false],
  ["KeyS", false],
])

window.addEventListener("keydown", function (event) {
  if (keyStates.has(event.code)) {
    event.preventDefault()
    keyStates.set(event.code, true)
  }
})

window.addEventListener("keyup", function (event) {
  if (keyStates.has(event.code)) {
    keyStates.set(event.code, false)
  }
})

const sendMoveToServer = function sendMoveToServer(data: MoveData) {
  const OPEN = 1
  if (socket.readyState === OPEN) {
    console.log("send", Date.now())
    socket.send(
      JSON.stringify({
        type: MessageType.Move,
        data: compressMoveDataWithI({
          ...data,
          i,
        }),
      }),
    )
    i++
  }
}

const idle = {
  left: [idleSpritesheet.textures.left],
  right: [idleSpritesheet.textures.right],
  up: [idleSpritesheet.textures.up],
  down: [idleSpritesheet.textures.down],
}

interface KeysDown {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
}

function cancelOutKeys({ left, right, up, down }: KeysDown): KeysDown {
  if (left && right) {
    left = false
    right = false
  }
  if (up && down) {
    up = false
    down = false
  }
  return { left, right, up, down }
}

function convertKeysDownToDirection(keysDown: KeysDown): Direction {
  const { left, right, up, down } = cancelOutKeys(keysDown)
  let direction: Direction = Direction.None
  if (left) {
    direction |= Direction.Left
  } else if (right) {
    direction |= Direction.Right
  }
  if (up) {
    direction |= Direction.Up
  } else if (down) {
    direction |= Direction.Down
  }
  return direction
}

function convertKeysDownToIsMoving(keysDown: KeysDown): boolean {
  const { left, right, up, down } = cancelOutKeys(keysDown)
  return left || right || up || down
}

let lastSentMovement: MoveData | null = null

app.ticker.add(() => {
  const left = keyStates.get("KeyA")!
  const right = keyStates.get("KeyD")!
  const up = keyStates.get("KeyW")!
  const down = keyStates.get("KeyS")!

  const isMoving = convertKeysDownToIsMoving({ left, right, up, down })
  const direction = isMoving
    ? convertKeysDownToDirection({ left, right, up, down })
    : character.direction

  if (character.isMoving) {
    const previousX = character.x
    const previousY = character.y
    character.updatePosition()
    if (character.y !== previousY) {
      updateObjectRenderPosition(character)
    }
    if (character.x !== previousX || character.y !== previousY) {
      updateViewport()
    }
  }

  if (
    !lastSentMovement ||
    isMoving !== lastSentMovement.isMoving ||
    direction !== lastSentMovement.direction
  ) {
    lastSentMovement = {
      isMoving: isMoving,
      direction: direction,
    }
    sendMoveToServer(lastSentMovement)
  }

  for (const object of objects.values()) {
    object.updatePosition()
  }
})

function updateViewport() {
  app.stage.x = 0.5 * app.view.width - character.x
  app.stage.y = 0.5 * app.view.height - character.y
}

// const tileMap = new CompositeTilemap()
// app.stage.addChild(tileMap)
//
// const TILE_WIDTH = 32
// const TILE_HEIGHT = 32
//
// for (let y = 0; y < app.view.height; y += TILE_HEIGHT) {
//   for (let x = 0; x < app.view.width; x += TILE_WIDTH) {
//     tileMap.tile(textureName, x, y)
//   }
// }

const socket = new WebSocket(
  "wss://w965op18e6.execute-api.eu-central-1.amazonaws.com/Prod",
)

function updateObjectRenderPosition(object: Object): void {
  objectsContainer.removeChild(object.sprite)
  let index = 0
  while (
    index < objectsContainer.children.length &&
    object.y > objectsContainer.getChildAt(index).y
  ) {
    index++
  }
  if (index === objectsContainer.children.length) {
    objectsContainer.addChild(object.sprite)
  } else {
    objectsContainer.addChildAt(object.sprite, index)
  }
}

socket.onmessage = function (event) {
  const body = JSON.parse(event.data)
  const { type, data } = body
  if (type === MessageType.Move) {
    const moveData = decompressMoveFromServerData(data)
    console.log(type, moveData)
    let object
    if (moveData.isCharacterOfClient) {
      console.log("receive", Date.now())
      object = character
    } else {
      object = retrieveOrCreateObject({
        id: moveData.connectionId,
        type: ObjectType.Character,
      })
    }
    if (object.lastI === null || moveData.i > object.lastI) {
      updateObject(object, moveData)
      object.lastI = moveData.i
    }
  } else if (type === MessageType.Objects) {
    const { objects } = data
    for (const objectData of objects) {
      let object
      if (objectData.isCharacterOfClient) {
        object = character
      } else {
        object = retrieveOrCreateObject({
          id: objectData.id || objectData.connectionId,
          type: objectData.type || ObjectType.Character,
        })
      }
      updateObject(object, objectData)
    }
  } else if (type === MessageType.OtherClientDisconnected) {
    const { connectionId } = data
    const object = objects.get(connectionId)
    if (object) {
      objectsContainer.removeChild(object.sprite)
      objects.delete(connectionId)
    }
  } else {
    console.log(body)
  }
}

function retrieveOrCreateObject({
  id,
  type,
}: {
  id: string
  type: ObjectType
}): Object {
  let object = objects.get(id)
  if (!object) {
    if (type === ObjectType.Character) {
      object = new Character()
    } else if (type === ObjectType.Plant) {
      object = new Plant()
    } else {
      throw new Error("Other type?")
    }
    objectsContainer.addChild(object.sprite)
    objects.set(id, object)
  }
  return object
}

function updateObject(object: Object, objectData: any): void {
  object.whenMovingHasChanged = Date.now()
  object.baseX = objectData.x
  object.baseY = objectData.y
  object.direction = objectData.direction
  object.isMoving = objectData.isMoving
  object.x = objectData.x
  const previousY = object.y
  object.y = objectData.y
  object.updatePosition()
  const isDifferentYCoordinate = object.y !== previousY
  if (isDifferentYCoordinate) {
    updateObjectRenderPosition(object)
  }
}

socket.onopen = function () {
  requestObjects()
}

function requestObjects(): void {
  socket.send(
    JSON.stringify({
      type: MessageType.RequestObjects,
    }),
  )
}

window.addEventListener(
  "resize",
  debounce(function () {
    updateViewport()
  }, 300),
)
