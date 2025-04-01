import { TILE_WIDTH } from './config.js'

export function adjustXToStep(x: number): number {
  return Math.floor(x / TILE_WIDTH) * TILE_WIDTH
}
