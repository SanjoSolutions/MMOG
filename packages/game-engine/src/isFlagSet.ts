export function isFlagSet(flags: number, flag: number): boolean {
  return (flags & flag) === flag
}
