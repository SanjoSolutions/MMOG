import { TILE_WIDTH, TILE_HEIGHT } from './config.js'
import type { Point2D } from './Point2D.js'
import type { Mountain } from './Mountain.js'

export function determineTileType(
  mountain: Mountain,
  tileCoordinates: Point2D
): string {
  const { x, y } = tileCoordinates
  return Math.abs(x - mountain.from.x) < 1 * TILE_WIDTH ||
    Math.abs(mountain.to.x - x) < 1 * TILE_WIDTH ||
    Math.abs(mountain.to.y - y) < 1 * TILE_HEIGHT
    ? 'rock.png'
    : 'rock_top.png'
}
