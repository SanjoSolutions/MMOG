import { CompositeTilemap } from '@pixi/tilemap'
import { TILE_WIDTH, TILE_HEIGHT } from './config.js'
import type { Mountain } from './Mountain.js'
import { determineTileType } from './determineTileType.js'

export function makeMountain(
  tileMap: CompositeTilemap,
  mountain: Mountain
): void {
  for (let y = mountain.from.y; y <= mountain.to.y; y += TILE_HEIGHT) {
    for (let x = mountain.from.x; x <= mountain.to.x; x += TILE_WIDTH) {
      const tileType = determineTileType(mountain, { x, y })
      tileMap.tile(tileType, x, y)
    }
  }
}
