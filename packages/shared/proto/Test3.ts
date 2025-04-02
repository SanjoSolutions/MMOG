// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "Test3.proto" (syntax proto3)
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
 * @generated from protobuf message Test3
 */
export interface Test3 {
    /**
     * @generated from protobuf field: int32 test3 = 1;
     */
    test3: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Test3$Type extends MessageType<Test3> {
    constructor() {
        super("Test3", [
            { no: 1, name: "test3", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Test3>): Test3 {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.test3 = 0;
        if (value !== undefined)
            reflectionMergePartial<Test3>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Test3): Test3 {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 test3 */ 1:
                    message.test3 = reader.int32();
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
    internalBinaryWrite(message: Test3, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 test3 = 1; */
        if (message.test3 !== 0)
            writer.tag(1, WireType.Varint).int32(message.test3);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Test3
 */
export const Test3 = new Test3$Type();
