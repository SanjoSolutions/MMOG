export function convertPositionToUnsignedIntegers(character) {
    return {
        ...character,
        x: Math.round(character.x),
        y: Math.round(character.y),
    };
}
//# sourceMappingURL=convertPositionToUnsignedIntegers.js.map