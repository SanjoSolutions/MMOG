export interface InteractableObject {
  canInteractWith(object: Object): boolean
  interact(interacter: any): void
}

export function isInteractableObject(
  object: any,
): object is InteractableObject {
  return (
    typeof object.canInteractWith === "function" &&
    typeof object.interact === "function"
  )
}
