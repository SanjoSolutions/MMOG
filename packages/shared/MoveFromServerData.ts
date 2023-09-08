/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 4.24.3
 * source: packages/shared/MoveFromServerData.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf"
export class MoveFromServerData extends pb_1.Message {
  #one_of_decls: number[][] = []
  constructor(
    data?:
      | any[]
      | {
          isMoving?: boolean
          direction?: number
          x?: number
          y?: number
          i?: number
          connectionId?: string
        },
  ) {
    super()
    pb_1.Message.initialize(
      this,
      Array.isArray(data) ? data : [],
      0,
      -1,
      [],
      this.#one_of_decls,
    )
    if (!Array.isArray(data) && typeof data == "object") {
      if ("isMoving" in data && data.isMoving != undefined) {
        this.isMoving = data.isMoving
      }
      if ("direction" in data && data.direction != undefined) {
        this.direction = data.direction
      }
      if ("x" in data && data.x != undefined) {
        this.x = data.x
      }
      if ("y" in data && data.y != undefined) {
        this.y = data.y
      }
      if ("i" in data && data.i != undefined) {
        this.i = data.i
      }
      if ("connectionId" in data && data.connectionId != undefined) {
        this.connectionId = data.connectionId
      }
    }
  }
  get isMoving() {
    return pb_1.Message.getFieldWithDefault(this, 1, false) as boolean
  }
  set isMoving(value: boolean) {
    pb_1.Message.setField(this, 1, value)
  }
  get direction() {
    return pb_1.Message.getFieldWithDefault(this, 2, 0) as number
  }
  set direction(value: number) {
    pb_1.Message.setField(this, 2, value)
  }
  get x() {
    return pb_1.Message.getFieldWithDefault(this, 3, 0) as number
  }
  set x(value: number) {
    pb_1.Message.setField(this, 3, value)
  }
  get y() {
    return pb_1.Message.getFieldWithDefault(this, 4, 0) as number
  }
  set y(value: number) {
    pb_1.Message.setField(this, 4, value)
  }
  get i() {
    return pb_1.Message.getFieldWithDefault(this, 5, 0) as number
  }
  set i(value: number) {
    pb_1.Message.setField(this, 5, value)
  }
  get connectionId() {
    return pb_1.Message.getFieldWithDefault(this, 6, "") as string
  }
  set connectionId(value: string) {
    pb_1.Message.setField(this, 6, value)
  }
  static fromObject(data: {
    isMoving?: boolean
    direction?: number
    x?: number
    y?: number
    i?: number
    connectionId?: string
  }): MoveFromServerData {
    const message = new MoveFromServerData({})
    if (data.isMoving != null) {
      message.isMoving = data.isMoving
    }
    if (data.direction != null) {
      message.direction = data.direction
    }
    if (data.x != null) {
      message.x = data.x
    }
    if (data.y != null) {
      message.y = data.y
    }
    if (data.i != null) {
      message.i = data.i
    }
    if (data.connectionId != null) {
      message.connectionId = data.connectionId
    }
    return message
  }
  toObject() {
    const data: {
      isMoving?: boolean
      direction?: number
      x?: number
      y?: number
      i?: number
      connectionId?: string
    } = {}
    if (this.isMoving != null) {
      data.isMoving = this.isMoving
    }
    if (this.direction != null) {
      data.direction = this.direction
    }
    if (this.x != null) {
      data.x = this.x
    }
    if (this.y != null) {
      data.y = this.y
    }
    if (this.i != null) {
      data.i = this.i
    }
    if (this.connectionId != null) {
      data.connectionId = this.connectionId
    }
    return data
  }
  serialize(): Uint8Array
  serialize(w: pb_1.BinaryWriter): void
  serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
    const writer = w || new pb_1.BinaryWriter()
    if (this.isMoving != false) writer.writeBool(1, this.isMoving)
    if (this.direction != 0) writer.writeUint32(2, this.direction)
    if (this.x != 0) writer.writeDouble(3, this.x)
    if (this.y != 0) writer.writeDouble(4, this.y)
    if (this.i != 0) writer.writeUint64(5, this.i)
    if (this.connectionId.length) writer.writeString(6, this.connectionId)
    if (!w) return writer.getResultBuffer()
  }
  static deserialize(
    bytes: Uint8Array | pb_1.BinaryReader,
  ): MoveFromServerData {
    const reader =
        bytes instanceof pb_1.BinaryReader
          ? bytes
          : new pb_1.BinaryReader(bytes),
      message = new MoveFromServerData()
    while (reader.nextField()) {
      if (reader.isEndGroup()) break
      switch (reader.getFieldNumber()) {
        case 1:
          message.isMoving = reader.readBool()
          break
        case 2:
          message.direction = reader.readUint32()
          break
        case 3:
          message.x = reader.readDouble()
          break
        case 4:
          message.y = reader.readDouble()
          break
        case 5:
          message.i = reader.readUint64()
          break
        case 6:
          message.connectionId = reader.readString()
          break
        default:
          reader.skipField()
      }
    }
    return message
  }
  serializeBinary(): Uint8Array {
    return this.serialize()
  }
  static deserializeBinary(bytes: Uint8Array): MoveFromServerData {
    return MoveFromServerData.deserialize(bytes)
  }
}
