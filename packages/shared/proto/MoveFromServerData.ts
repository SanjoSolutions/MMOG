// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "MoveFromServerData.proto" (syntax proto3)
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
 * @generated from protobuf message MoveFromServerData
 */
export interface MoveFromServerData {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: string userID = 2;
     */
    userID: string;
    /**
     * @generated from protobuf field: bool isMoving = 3;
     */
    isMoving: boolean;
    /**
     * @generated from protobuf field: uint32 direction = 4;
     */
    direction: number;
    /**
     * @generated from protobuf field: double x = 5;
     */
    x: number;
    /**
     * @generated from protobuf field: double y = 6;
     */
    y: number;
    /**
     * @generated from protobuf field: uint64 i = 7;
     */
    i: bigint;
    /**
     * @generated from protobuf field: bool isCharacterOfClient = 8;
     */
    isCharacterOfClient: boolean;
    /**
     * @generated from protobuf field: uint64 whenMovingHasChanged = 9;
     */
    whenMovingHasChanged: bigint;
}
// @generated message type with reflection information, may provide speed optimized methods
class MoveFromServerData$Type extends MessageType<MoveFromServerData> {
    constructor() {
        super("MoveFromServerData", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "userID", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "isMoving", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "direction", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 5, name: "x", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 6, name: "y", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 7, name: "i", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 8, name: "isCharacterOfClient", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 9, name: "whenMovingHasChanged", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ }
        ]);
    }
    create(value?: PartialMessage<MoveFromServerData>): MoveFromServerData {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = "";
        message.userID = "";
        message.isMoving = false;
        message.direction = 0;
        message.x = 0;
        message.y = 0;
        message.i = 0n;
        message.isCharacterOfClient = false;
        message.whenMovingHasChanged = 0n;
        if (value !== undefined)
            reflectionMergePartial<MoveFromServerData>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MoveFromServerData): MoveFromServerData {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* string userID */ 2:
                    message.userID = reader.string();
                    break;
                case /* bool isMoving */ 3:
                    message.isMoving = reader.bool();
                    break;
                case /* uint32 direction */ 4:
                    message.direction = reader.uint32();
                    break;
                case /* double x */ 5:
                    message.x = reader.double();
                    break;
                case /* double y */ 6:
                    message.y = reader.double();
                    break;
                case /* uint64 i */ 7:
                    message.i = reader.uint64().toBigInt();
                    break;
                case /* bool isCharacterOfClient */ 8:
                    message.isCharacterOfClient = reader.bool();
                    break;
                case /* uint64 whenMovingHasChanged */ 9:
                    message.whenMovingHasChanged = reader.uint64().toBigInt();
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
    internalBinaryWrite(message: MoveFromServerData, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* string userID = 2; */
        if (message.userID !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.userID);
        /* bool isMoving = 3; */
        if (message.isMoving !== false)
            writer.tag(3, WireType.Varint).bool(message.isMoving);
        /* uint32 direction = 4; */
        if (message.direction !== 0)
            writer.tag(4, WireType.Varint).uint32(message.direction);
        /* double x = 5; */
        if (message.x !== 0)
            writer.tag(5, WireType.Bit64).double(message.x);
        /* double y = 6; */
        if (message.y !== 0)
            writer.tag(6, WireType.Bit64).double(message.y);
        /* uint64 i = 7; */
        if (message.i !== 0n)
            writer.tag(7, WireType.Varint).uint64(message.i);
        /* bool isCharacterOfClient = 8; */
        if (message.isCharacterOfClient !== false)
            writer.tag(8, WireType.Varint).bool(message.isCharacterOfClient);
        /* uint64 whenMovingHasChanged = 9; */
        if (message.whenMovingHasChanged !== 0n)
            writer.tag(9, WireType.Varint).uint64(message.whenMovingHasChanged);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message MoveFromServerData
 */
export const MoveFromServerData = new MoveFromServerData$Type();
