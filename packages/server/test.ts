import { Message, MessageType, Test } from "./shared/proto/Message"

const binary = Message.toBinary({
  type: MessageType.MOVE_DATA,
  data: Test.toBinary({
    test: 1,
  }),
})

debugger

const message1 = Message.fromBinary(binary)
const message = {
  ...message1,
  data: Test.fromBinary(message1.data),
}

debugger
