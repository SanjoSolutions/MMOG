import {
  compressMoveDataWithI,
  decompressMoveDataWithI,
} from "./communication/communication.js"

const compressedData = compressMoveDataWithI({
  isMoving: true,
  facingDirection: 0b100,
  x: 5,
  y: 3,
  i: 7,
})

console.log(compressedData)

const decompressedData = decompressMoveDataWithI(compressedData)

console.log(decompressedData)
