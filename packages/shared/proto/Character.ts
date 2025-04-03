// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "Character.proto" (syntax proto3)
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
import { CharacterType } from "./CharacterType";
/**
 * @generated from protobuf message Character
 */
export interface Character {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: optional CharacterType type = 2;
     */
    type?: CharacterType;
    /**
     * @generated from protobuf field: bool isMoving = 3;
     */
    isMoving: boolean;
    /**
     * @generated from protobuf field: double x = 4;
     */
    x: number;
    /**
     * @generated from protobuf field: double y = 5;
     */
    y: number;
    /**
     * @generated from protobuf field: uint32 facingDirection = 6;
     */
    facingDirection: number;
    /**
     * @generated from protobuf field: uint32 movingDirection = 7;
     */
    movingDirection: number;
    /**
     * @generated from protobuf field: optional float speed = 8;
     */
    speed?: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Character$Type extends MessageType<Character> {
    constructor() {
        super("Character", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "type", kind: "enum", opt: true, T: () => ["CharacterType", CharacterType, "CHARACTER_TYPE_"] },
            { no: 3, name: "isMoving", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "x", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 5, name: "y", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 6, name: "facingDirection", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 7, name: "movingDirection", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 8, name: "speed", kind: "scalar", opt: true, T: 2 /*ScalarType.FLOAT*/ }
        ]);
    }
    create(value?: PartialMessage<Character>): Character {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = "";
        message.isMoving = false;
        message.x = 0;
        message.y = 0;
        message.facingDirection = 0;
        message.movingDirection = 0;
        if (value !== undefined)
            reflectionMergePartial<Character>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Character): Character {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* optional CharacterType type */ 2:
                    message.type = reader.int32();
                    break;
                case /* bool isMoving */ 3:
                    message.isMoving = reader.bool();
                    break;
                case /* double x */ 4:
                    message.x = reader.double();
                    break;
                case /* double y */ 5:
                    message.y = reader.double();
                    break;
                case /* uint32 facingDirection */ 6:
                    message.facingDirection = reader.uint32();
                    break;
                case /* uint32 movingDirection */ 7:
                    message.movingDirection = reader.uint32();
                    break;
                case /* optional float speed */ 8:
                    message.speed = reader.float();
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
    internalBinaryWrite(message: Character, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* optional CharacterType type = 2; */
        if (message.type !== undefined)
            writer.tag(2, WireType.Varint).int32(message.type);
        /* bool isMoving = 3; */
        if (message.isMoving !== false)
            writer.tag(3, WireType.Varint).bool(message.isMoving);
        /* double x = 4; */
        if (message.x !== 0)
            writer.tag(4, WireType.Bit64).double(message.x);
        /* double y = 5; */
        if (message.y !== 0)
            writer.tag(5, WireType.Bit64).double(message.y);
        /* uint32 facingDirection = 6; */
        if (message.facingDirection !== 0)
            writer.tag(6, WireType.Varint).uint32(message.facingDirection);
        /* uint32 movingDirection = 7; */
        if (message.movingDirection !== 0)
            writer.tag(7, WireType.Varint).uint32(message.movingDirection);
        /* optional float speed = 8; */
        if (message.speed !== undefined)
            writer.tag(8, WireType.Bit32).float(message.speed);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Character
 */
export const Character = new Character$Type();
