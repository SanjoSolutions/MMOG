import { TILE_HEIGHT } from './config.js'

export function adjustYToStep(y: number): number {
  return Math.floor(y / TILE_HEIGHT) * TILE_HEIGHT
}
