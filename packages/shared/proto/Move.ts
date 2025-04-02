// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "Move.proto" (syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message Move
 */
export interface Move {
    /**
     * @generated from protobuf field: bool isMoving = 1;
     */
    isMoving: boolean;
    /**
     * @generated from protobuf field: uint32 direction = 2;
     */
    direction: number;
    /**
     * @generated from protobuf field: double x = 3;
     */
    x: number;
    /**
     * @generated from protobuf field: double y = 4;
     */
    y: number;
    /**
     * @generated from protobuf field: double whenMovingHasChanged = 5;
     */
    whenMovingHasChanged: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Move$Type extends MessageType<Move> {
    constructor() {
        super("Move", [
            { no: 1, name: "isMoving", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "direction", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 3, name: "x", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 4, name: "y", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 5, name: "whenMovingHasChanged", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    create(value?: PartialMessage<Move>): Move {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.isMoving = false;
        message.direction = 0;
        message.x = 0;
        message.y = 0;
        message.whenMovingHasChanged = 0;
        if (value !== undefined)
            reflectionMergePartial<Move>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Move): Move {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool isMoving */ 1:
                    message.isMoving = reader.bool();
                    break;
                case /* uint32 direction */ 2:
                    message.direction = reader.uint32();
                    break;
                case /* double x */ 3:
                    message.x = reader.double();
                    break;
                case /* double y */ 4:
                    message.y = reader.double();
                    break;
                case /* double whenMovingHasChanged */ 5:
                    message.whenMovingHasChanged = reader.double();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Move, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool isMoving = 1; */
        if (message.isMoving !== false)
            writer.tag(1, WireType.Varint).bool(message.isMoving);
        /* uint32 direction = 2; */
        if (message.direction !== 0)
            writer.tag(2, WireType.Varint).uint32(message.direction);
        /* double x = 3; */
        if (message.x !== 0)
            writer.tag(3, WireType.Bit64).double(message.x);
        /* double y = 4; */
        if (message.y !== 0)
            writer.tag(4, WireType.Bit64).double(message.y);
        /* double whenMovingHasChanged = 5; */
        if (message.whenMovingHasChanged !== 0)
            writer.tag(5, WireType.Bit64).double(message.whenMovingHasChanged);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Move
 */
export const Move = new Move$Type();
