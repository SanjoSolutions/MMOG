// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "Test2.proto" (syntax proto3)
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
 * @generated from protobuf message Test2
 */
export interface Test2 {
    /**
     * @generated from protobuf field: int32 test2 = 1;
     */
    test2: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Test2$Type extends MessageType<Test2> {
    constructor() {
        super("Test2", [
            { no: 1, name: "test2", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Test2>): Test2 {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.test2 = 0;
        if (value !== undefined)
            reflectionMergePartial<Test2>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Test2): Test2 {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 test2 */ 1:
                    message.test2 = reader.int32();
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
    internalBinaryWrite(message: Test2, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 test2 = 1; */
        if (message.test2 !== 0)
            writer.tag(1, WireType.Varint).int32(message.test2);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Test2
 */
export const Test2 = new Test2$Type();
