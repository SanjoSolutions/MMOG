export class TextMessage {
  static #message: HTMLDivElement | null = null
  static #onKeyDown: ((event: KeyboardEvent) => void) | null = null
  static #resolve: ((value: any) => void) | null = null

  static async show(
    text: string,
    options: { html: boolean } = { html: false },
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (TextMessage.#message) {
        TextMessage.#hideMessage(false)
      }

      TextMessage.#resolve = resolve
      const message = document.createElement("div")
      message.classList.add("text-message")

      document.body.appendChild(message)

      const messageInner = document.createElement("div")
      messageInner.classList.add("text-message-inner")
      if (options.html) {
        messageInner.innerHTML = text
      } else {
        messageInner.textContent = text
      }
      message.appendChild(messageInner)

      TextMessage.#message = message
      TextMessage.#onKeyDown = function (event) {
        if (event.code === "Enter") {
          event.preventDefault()
          TextMessage.#hideMessage(true)
        }
      }
      window.addEventListener("keydown", TextMessage.#onKeyDown)
    })
  }

  static async showMessageFrom(name: string, message: string) {
    return await TextMessage.show(`<strong>${name}:</strong> ${message}`, {
      html: true,
    })
  }

  static #hideMessage(hasPlayerDoneContinueAction: boolean) {
    TextMessage.#message!.remove()
    TextMessage.#message = null
    window.removeEventListener("keydown", TextMessage.#onKeyDown!)
    TextMessage.#onKeyDown = null
    const resolve = TextMessage.#resolve!
    TextMessage.#resolve = null
    resolve(hasPlayerDoneContinueAction)
  }
}
