import { CompositeTilemap } from "@pixi/tilemap"
import type { Dimensions } from "./Dimensions.js"
import { generateRandomInteger } from "./generateRandomInteger.js"
import { makeRiver } from "./makeRiver.js"

export function makeRivers(
  tileMap: CompositeTilemap,
  dimensions: Dimensions,
): void {
  for (let i = 1; i <= 10; i++) {
    makeRiver(tileMap, {
      width: generateRandomInteger(64, 128),
      from: {
        x: generateRandomInteger(0, dimensions.width - 1),
        y: generateRandomInteger(0, dimensions.height - 1),
      },
      to: {
        x: generateRandomInteger(0, dimensions.width - 1),
        y: generateRandomInteger(0, dimensions.height - 1),
      },
    })
  }
}
