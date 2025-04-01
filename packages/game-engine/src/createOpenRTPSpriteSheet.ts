import { Resource, Spritesheet, Texture } from "pixi.js"

export const width = 48
export const height = 64

export async function createOpenRTPSpriteSheet(
  prefix: string,
  texture: Texture<Resource>,
  basePosition: { x: number; y: number },
) {
  const { x: baseX, y: baseY } = basePosition

  const frames = {
    [`${prefix}_walk_up_0`]: {
      frame: {
        x: baseX + 0 * width,
        y: baseY + 0 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_up_1`]: {
      frame: {
        x: baseX + 1 * width,
        y: baseY + 0 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_up_2`]: {
      frame: {
        x: baseX + 2 * width,
        y: baseY + 0 * height,
        w: width,
        h: height,
      },
    },

    [`${prefix}_walk_left_0`]: {
      frame: {
        x: baseX + 0 * width,
        y: baseY + 3 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_left_1`]: {
      frame: {
        x: baseX + 1 * width,
        y: baseY + 3 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_left_2`]: {
      frame: {
        x: baseX + 2 * width,
        y: baseY + 3 * height,
        w: width,
        h: height,
      },
    },

    [`${prefix}_walk_down_0`]: {
      frame: {
        x: baseX + 0 * width,
        y: baseY + 2 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_down_1`]: {
      frame: {
        x: baseX + 1 * width,
        y: baseY + 2 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_down_2`]: {
      frame: {
        x: baseX + 2 * width,
        y: baseY + 2 * height,
        w: width,
        h: height,
      },
    },

    [`${prefix}_walk_right_0`]: {
      frame: {
        x: baseX + 0 * width,
        y: baseY + 1 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_right_1`]: {
      frame: {
        x: baseX + 1 * width,
        y: baseY + 1 * height,
        w: width,
        h: height,
      },
    },
    [`${prefix}_walk_right_2`]: {
      frame: {
        x: baseX + 2 * width,
        y: baseY + 1 * height,
        w: width,
        h: height,
      },
    },
  }
  const animations = {
    up: [
      `${prefix}_walk_up_1`,
      `${prefix}_walk_up_0`,
      `${prefix}_walk_up_1`,
      `${prefix}_walk_up_2`,
    ],
    left: [
      `${prefix}_walk_left_1`,
      `${prefix}_walk_left_0`,
      `${prefix}_walk_left_1`,
      `${prefix}_walk_left_2`,
    ],
    down: [
      `${prefix}_walk_down_1`,
      `${prefix}_walk_down_0`,
      `${prefix}_walk_down_1`,
      `${prefix}_walk_down_2`,
    ],
    right: [
      `${prefix}_walk_right_1`,
      `${prefix}_walk_right_0`,
      `${prefix}_walk_right_1`,
      `${prefix}_walk_right_2`,
    ],
  }

  const data = {
    meta: { scale: "1" },
    frames,
    animations,
  }
  const spriteSheet = new Spritesheet(texture, data)
  await spriteSheet.parse()
  return spriteSheet
}
