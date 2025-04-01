export function generateRandomInteger(from: number, to: number): number {
  return Math.floor(from + Math.random() * (to - from))
}
