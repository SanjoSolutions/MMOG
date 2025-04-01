export interface CellPosition {
  row: number
  column: number
}

export function createCellPositionKey(position: CellPosition) {
  return `${position.row}_${position.column}`
}
