import { MessageType } from "./MessageType.js";
import { convertPositionToUnsignedIntegers } from "../convertPositionToUnsignedIntegers.js";
export function createError(message, error) {
    return message.create({
        body: {
            oneofKind: MessageType.Error,
            error,
        },
    });
}
export function createCharacterMessage(message, character) {
    return message.create({
        body: {
            oneofKind: MessageType.Character,
            character: convertPositionToUnsignedIntegers(character),
        },
    });
}
export function createMoveFromServerMessage(message, moveFromServer) {
    console.log("moveFromServer", moveFromServer);
    return message.create({
        body: {
            oneofKind: MessageType.MoveFromServer,
            moveFromServer: moveFromServer,
        },
    });
}
export function createDisconnectMessage(message, character) {
    return message.create({
        body: {
            oneofKind: MessageType.Disconnect,
            disconnect: {
                GUID: character.GUID,
            },
        },
    });
}
//# sourceMappingURL=messageFactories.js.map