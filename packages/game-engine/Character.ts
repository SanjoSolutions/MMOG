import { GameObject } from "./GameObject.js"

export class Character extends GameObject {
  isPlayed?: boolean
  public destinationX: number | null = null
  public destinationY: number | null = null
}
