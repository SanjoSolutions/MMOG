"use client"

import { createClient, retrieveUser } from "@/utils/supabase/client.js"
import "@aws-amplify/ui-react/styles.css"
import { Application as PixiApplication } from "@pixi/react"
import { debounce } from "lodash-es"
import {
  AnimatedSprite,
  Assets,
  Container,
  Spritesheet,
  type Application,
} from "pixi.js"
import { useCallback, useEffect, useMemo } from "react"
import { Character } from "../../../../game-engine/Character.js"
import {
  CharacterSpriteWithOneSpriteSheet,
  loadSpriteSheet,
  loadUniversalSpriteSheet,
} from "../../../../game-engine/CharacterSpriteWithOneSpriteSheet.js"
import type { GUID } from "../../../../game-engine/GUID.js"
import { GameObject } from "../../../../game-engine/GameObject.js"
import { createAnimatedSprite } from "../../../../game-engine/createAnimatedSprite.js"
import { Direction } from "../../../../shared/Direction.js"
import { ObjectType } from "../../../../shared/ObjectType.js"
import { PlantType } from "../../../../shared/PlantType.js"
import { CharacterType } from "../../../../shared/proto/CharacterType.js"
import type { Despawn } from "../../../../shared/proto/Despawn.js"
import { Move } from "../../../../shared/proto/Move.js"
import type { Spawn } from "../../../../shared/proto/Spawn.js"
import { GameClient } from "./GameClient.js"

const gameClient = new GameClient()
const guidToSprite = new Map<GUID, CharacterSpriteWithOneSpriteSheet>()

export function App() {
  const keyStates = useMemo(
    () =>
      new Map([
        ["KeyA", false],
        ["KeyD", false],
        ["KeyW", false],
        ["KeyS", false],
      ]),
    [],
  )

  useEffect(
    function () {
      function onKeyDown(event: KeyboardEvent) {
        if (keyStates.has(event.code)) {
          event.preventDefault()
          keyStates.set(event.code, true)
        }
      }

      function onKeyUp(event: KeyboardEvent) {
        if (keyStates.has(event.code)) {
          keyStates.set(event.code, false)
        }
      }

      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("keyup", onKeyUp)

      return () => {
        window.removeEventListener("keydown", onKeyDown)
        window.removeEventListener("keyup", onKeyUp)
      }
    },
    [keyStates],
  )

  const f = useCallback(
    async function f(app: Application): Promise<void> {
      if (process.env.NEXT_PUBLIC_IS_DEVELOPMENT) {
        globalThis.__PIXI_APP__ = app
      }

      const supabase = createClient()
      const user = await retrieveUser(supabase)

      const characterWidth = 64
      const characterHeight = 64

      app.queueResize()

      const { sound } = await import("@pixi/sound")
      sound.add("music", "/assets/music/TownTheme.mp3")
      sound.play("music", { loop: true })

      Assets.add({ alias: "plants", src: "/assets/sprites/plants.json" })
      const {
        plants: plantsSpritesheet,
      }: {
        plants: Spritesheet
      } = (await Assets.load(["plants"])) as any

      if (user) {
        await initializeConnection()
      }

      const plantTextures = new Map([
        [PlantType.Tomato, plantsSpritesheet.animations.tomato_plant],
        [PlantType.Potato, plantsSpritesheet.animations.potato_plant],
        [PlantType.Carrot, plantsSpritesheet.animations.carrot_plant],
        [PlantType.Artichoke, plantsSpritesheet.animations.artichoke_plant],
        [PlantType.RedPepper, plantsSpritesheet.animations.redPepper_plant],
        [PlantType.Zucchini, plantsSpritesheet.animations.zucchini_plant],
        [PlantType.Corn, plantsSpritesheet.animations.corn_plant],
      ])

      class Plant extends GameObject {
        plantType: PlantType = PlantType.Tomato
        private _stage: number = 0

        constructor(container: Container) {
          super(container)
          this.sprite.addChild(
            createAnimatedSprite(plantTextures.get(PlantType.Tomato)!),
          )
        }

        get stage(): number {
          return this._stage
        }

        set stage(stage: number) {
          this._stage = stage
          this._updateTextures()
        }

        protected _updateTextures() {
          const textures = plantTextures.get(this.plantType)
          const animatedSprite = this.sprite.children[0] as AnimatedSprite
          if (textures && textures !== animatedSprite.textures) {
            animatedSprite.textures = textures
          }
          animatedSprite.gotoAndStop(this.stage)
        }

        protected _play() {}

        protected _stop() {}

        public update(data: any, now: number): void {
          super.update(data, now)
          this.plantType = data.plantType
          this.stage = data.stage
        }
      }

      const objects = new Map<string, GameObject>()
      const objectsContainer = new Container()
      let characterSprite: CharacterSpriteWithOneSpriteSheet | null = null
      app.stage.addChild(objectsContainer)

      interface PointerState {
        isDown: boolean
        position: { x: number; y: number } | null
      }

      const pointerState: PointerState = {
        isDown: false,
        position: null,
      }

      ;(app.canvas as HTMLCanvasElement).addEventListener(
        "pointerdown",
        function (event) {
          if (event.button === 0) {
            event.preventDefault()
            const x = event.offsetX
            const y = event.offsetY
            pointerState.isDown = true
            pointerState.position = { x, y }
          }
        },
      )
      ;(app.canvas as HTMLCanvasElement).addEventListener(
        "pointermove",
        function (event) {
          if (pointerState.isDown) {
            event.preventDefault()
            const x = event.offsetX
            const y = event.offsetY
            pointerState.position = { x, y }
          }
        },
      )
      ;(app.canvas as HTMLCanvasElement).addEventListener(
        "pointerup",
        function (event) {
          if (event.button === 0) {
            pointerState.isDown = false
            pointerState.position = null
          }
        },
      )

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

      function convertKeysDownToDirection(
        keysDownAndPointerState: KeysDown & { pointerState: PointerState },
      ): Direction {
        const { left, right, up, down } = cancelOutKeys(keysDownAndPointerState)
        if (left || right || up || down) {
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
        } else {
          const { pointerState } = keysDownAndPointerState
          let direction = Direction.None
          if (pointerState.isDown && pointerState.position) {
            const { x, y } = pointerState.position

            if (x < app.screen.width / 2 - 0.5 * clearArea.width) {
              direction |= Direction.Left
            } else if (x > app.screen.width / 2 + 0.5 * clearArea.width) {
              direction |= Direction.Right
            }
            if (y < app.screen.height / 2 - 0.5 * clearArea.height) {
              direction |= Direction.Up
            } else if (y > app.screen.height / 2 + 0.5 * clearArea.height) {
              direction |= Direction.Down
            }

            return direction
          }

          return Direction.None
        }
      }

      function convertKeysDownToIsMoving(
        keysDownAndPointerState: KeysDown & { pointerState: PointerState },
      ): boolean {
        const { left, right, up, down } = cancelOutKeys(keysDownAndPointerState)
        return Boolean(
          left ||
            right ||
            up ||
            down ||
            (pointerState.isDown &&
              pointerState.position &&
              (pointerState.position.x <
                window.innerWidth / 2 - 0.5 * clearArea.width ||
                pointerState.position.x >
                  window.innerWidth / 2 + 0.5 * clearArea.width) &&
              (pointerState.position.y <
                window.innerHeight / 2 - 0.5 * clearArea.height ||
                pointerState.position.y >
                  window.innerHeight / 2 + 0.5 * clearArea.height)),
        )
      }

      const clearArea = {
        width: 64,
        height: 64,
      }

      const cow = new CharacterSpriteWithOneSpriteSheet(
        {},
        app.stage,
        await loadSpriteSheet("/assets/sprites/cow/cow_walk.json"),
      )
      objectsContainer.addChild(cow.sprite)

      app.ticker.add(() => {
        if (characterSprite) {
          const character = characterSprite.object as Character

          const left = keyStates.get("KeyA")!
          const right = keyStates.get("KeyD")!
          const up = keyStates.get("KeyW")!
          const down = keyStates.get("KeyS")!

          const isMoving = convertKeysDownToIsMoving({
            left,
            right,
            up,
            down,
            pointerState,
          })
          const movingDirection = isMoving
            ? convertKeysDownToDirection({
                left,
                right,
                up,
                down,
                pointerState,
              })
            : character.movingDirection
          const facingDirection = isMoving
            ? movingDirection
            : character.facingDirection

          const hasChanged =
            isMoving !== character.isMoving ||
            movingDirection !== character.movingDirection

          const previousX = character.x
          const previousY = character.y

          const whenMovingHasChanged = gameClient.now()

          if (hasChanged) {
            character.updatePosition(gameClient.now())
            character.baseX = character.x
            character.baseY = character.y
            character.whenMovingHasChanged = whenMovingHasChanged
            character.isMoving = isMoving
            character.movingDirection = movingDirection
            character.facingDirection = facingDirection
          }

          if (character.isMoving) {
            character.updatePosition(gameClient.now())
          }

          characterSprite.sync()

          if (character.y !== previousY) {
            characterSprite.updateRenderPosition()
          }
          if (character.x !== previousX || character.y !== previousY) {
            updateViewport()
          }

          if (
            !gameClient._lastSentMovement ||
            isMoving !== gameClient._lastSentMovement.isMoving ||
            ((left || right || up || down) &&
              movingDirection !== gameClient._lastSentMovement.facingDirection)
          ) {
            gameClient.move({
              character: {
                id: character.id,
                isMoving: character.isMoving,
                x: character.x,
                y: character.y,
                facingDirection: character.facingDirection,
                movingDirection: character.movingDirection,
              },
              whenMovingHasChanged,
            })
          }

          for (const object of objects.values()) {
            object.updatePosition(gameClient.now())
          }
        }

        const playerCharacter = characterSprite?.object
        for (const character of gameClient.characters.guidToCharacter.values()) {
          if (!playerCharacter || character.id !== playerCharacter.id) {
            character.updatePosition(gameClient.now())
            const characterSprite = guidToSprite.get(character.id)
            if (characterSprite) {
              characterSprite.sync()
            }
          }
        }
      })

      function updateViewport() {
        const character = characterSprite?.object as Character
        if (character) {
          app.stage.x = -(character.x - 0.5 * app.screen.width)
          app.stage.y = -(
            character.y -
            0.5 * characterHeight -
            0.5 * app.screen.height
          )
        }
      }

      // const tileMap = new CompositeTilemap()
      // app.stage.addChild(tileMap)
      //
      // const TILE_WIDTH = 32
      // const TILE_HEIGHT = 32
      //
      // for (let y = 0; y < app.canvas.height; y += TILE_HEIGHT) {
      //   for (let x = 0; x < app.canvas.width; x += TILE_WIDTH) {
      //     tileMap.tile(textureName, x, y)
      //   }
      // }

      async function initializeConnection(): Promise<void> {
        const jwt = (await supabase.auth.getSession()).data?.session
          ?.access_token
        if (jwt) {
          await gameClient.connect(jwt)

          window.aOffset = function () {
            return gameClient._timeSync.offset
          }

          gameClient.onSpawn.subscribe(async (data: Spawn) => {
            if (data.character) {
              const character2 = gameClient.characters.retrieveCharacterByGUID(
                data.character.id,
              )
              if (character2) {
                const characterSprite2 = new CharacterSpriteWithOneSpriteSheet(
                  character2,
                  app.stage,
                  character2.type === CharacterType.Cow
                    ? await loadSpriteSheet("/assets/sprites/cow/cow_walk.json")
                    : await loadUniversalSpriteSheet("/npc_woman.png"),
                )
                guidToSprite.set(character2.id, characterSprite2)
                objectsContainer.addChild(characterSprite2.sprite)
                if (data.canMove) {
                  characterSprite = characterSprite2
                  updateViewport()
                }
              }
            }
          })

          gameClient.onMove.subscribe(async (data: Move) => {
            if (data.character) {
              const character = gameClient.characters.retrieveCharacterByGUID(
                data.character.id,
              )
              if (character.y !== data.character.y) {
                character.updateRenderPosition()
              }
            }
          })

          gameClient.onDespawn.subscribe(async (data: Despawn) => {
            const characterSprite = guidToSprite.get(data.id)
            if (characterSprite) {
              objectsContainer.removeChild(characterSprite.sprite)
              guidToSprite.delete(data.id)
            }
          })
        }
      }

      function retrieveOrCreateObject({
        id,
        type,
      }: {
        id: string
        type: ObjectType
      }): GameObject {
        let object = objects.get(id)
        if (!object) {
          if (type === ObjectType.Character) {
            object = new Character(objectsContainer)
          } else if (type === ObjectType.Plant) {
            object = new Plant(objectsContainer)
          } else {
            throw new Error("Other type?")
          }
          objectsContainer.addChild(object.sprite)
          objects.set(id, object)
        }
        return object
      }

      window.addEventListener(
        "resize",
        debounce(function () {
          updateViewport()
        }, 300),
      )
    },
    [keyStates],
  )

  return (
    <>
      <PixiApplication
        backgroundColor="0x2f8136"
        resizeTo={
          typeof document !== "undefined"
            ? (document.querySelector("#root") as HTMLDivElement)
            : undefined
        }
        resolution={
          typeof window !== "undefined" ? window.devicePixelRatio : undefined
        }
        onInit={f}
      ></PixiApplication>
      <div className="links">
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault()
            // TODO: Log out
          }}
        >
          Log out
        </a>
        <a className="credits" href="credits.html" target="_blank">
          Credits
        </a>
      </div>
    </>
  )
}
