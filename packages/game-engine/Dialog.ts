export class Option {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export class Dialog {
  static selectedOptionIndex: number | null = null
  static options: Option[]
  static #container: HTMLDivElement | null = null
  static #$options: HTMLLIElement[] = []

  static async showOptions(options: Option[]): Promise<Option> {
    return new Promise((resolve, error) => {
      if (options.length >= 1) {
        Dialog.options = options
        const $options = document.createElement("div")
        Dialog.#container = $options
        $options.className = "dialog-options"
        const $list = document.createElement("ol")
        $list.className = "dialog-options-list"
        $options.appendChild($list)
        Dialog.#$options = []
        for (const option of options) {
          const $option = document.createElement("li")
          $option.className = "dialog-option"
          $option.textContent = option.name
          $list.appendChild($option)
          Dialog.#$options.push($option)
        }
        document.body.appendChild($options)

        Dialog.selectedOptionIndex = 0
        Dialog.#$options[0].classList.add("dialog-option--selected")

        const eventHandler = function (event: KeyboardEvent) {
          if (event.code === "ArrowUp") {
            Dialog.#selectOption(Math.max(Dialog.selectedOptionIndex! - 1, 0))
          } else if (event.code === "ArrowDown") {
            Dialog.#selectOption(
              Math.min(
                Dialog.selectedOptionIndex! + 1,
                Dialog.options.length - 1,
              ),
            )
          } else if (event.code === "Enter") {
            const option = Dialog.options[Dialog.selectedOptionIndex!]
            Dialog.#container!.remove()
            Dialog.options = []
            Dialog.#container = null
            Dialog.#$options = []
            window.removeEventListener("keydown", eventHandler)
            resolve(option)
          }
        }

        window.addEventListener("keydown", eventHandler)
      } else {
        error(new Error("At least one option is required."))
      }
    })
  }

  static #selectOption(optionIndex: number) {
    Dialog.selectedOptionIndex = optionIndex
    Dialog.#$options.forEach(($option) =>
      $option.classList.remove("dialog-option--selected"),
    )
    Dialog.#$options[optionIndex].classList.add("dialog-option--selected")
  }

  static async askForNumber(
    options: AskForNumberOptions,
  ): AskForNumberReturnType {
    return new Promise((resolve) => {
      const $container = document.createElement("div")
      $container.className = "dialog-ask-for-number"

      const $inner = document.createElement("div")
      $inner.className = "dialog-ask-for-number-inner"
      $container.appendChild($inner)

      const $form = document.createElement("form")
      $inner.appendChild($form)

      const $number = document.createElement("input")
      $number.type = "number"
      if (options.hasOwnProperty("minimum")) {
        $number.min = String(options.minimum)
      }
      if (options.hasOwnProperty("maximum")) {
        $number.max = String(options.maximum)
      }
      $form.appendChild($number)

      document.body.appendChild($container)

      $form.addEventListener("submit", function (event) {
        event.preventDefault()
        $container.remove()
        resolve(parseInt($number.value, 10))
      })

      $number.focus()
    })
  }
}

export interface AskForNumberOptions {
  minimum?: number
  maximum?: number
}

export type AskForNumberReturnType = Promise<number | null>
