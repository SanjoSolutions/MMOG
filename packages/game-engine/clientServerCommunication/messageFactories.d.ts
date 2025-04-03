import type { Message } from "../protos/Message.js";
import type { Error as ErrorProto } from "../protos/Error.js";
import type { Character } from "../protos/Character.js";
import type { MoveFromServer } from "../protos/MoveFromServer.js";
export declare function createError<T = Message>(message: any, error: ErrorProto): T;
export declare function createCharacterMessage<T = Message>(message: any, character: Character): T;
export declare function createMoveFromServerMessage<T = Message>(message: any, moveFromServer: MoveFromServer): T;
export declare function createDisconnectMessage<T = Message>(message: any, character: Character): T;
//# sourceMappingURL=messageFactories.d.ts.map