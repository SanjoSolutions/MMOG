import type { CompositeTilemap } from "@pixi/tilemap"
import type { Polygon } from "./Polygon.js"
import type { River } from "./River.js"
import type { Tile } from "./Tile.js"
import { TILE_HEIGHT, TILE_WIDTH } from "./config.js"
import { intersect, polygonArea } from "./polygonIntersection.js"

const TILE_AREA = TILE_WIDTH * TILE_HEIGHT

export function makeRiver(tileMap: CompositeTilemap, river: River): void {
  const riverPolygon = makeRiverPolygon(river)
  for (let y = 0; y < 16 * TILE_HEIGHT; y += TILE_HEIGHT) {
    for (let x = 0; x < 16 * TILE_WIDTH; x += TILE_WIDTH) {
      const tile = { x, y }
      if (doesIntersect50PercentOrMore(tile, riverPolygon)) {
        tileMap.tile("water_11.png", x, y)
      }
    }
  }
}

function makeRiverPolygon(river: River): Polygon {
  const angle = Math.atan2(river.to.y - river.from.y, river.to.x - river.from.x)
  const riverPolygon = [
    {
      x:
        river.from.x +
        0.5 * river.width * Math.cos(angle + convertDegreeToRadian(90)),
      y:
        river.from.y +
        0.5 * river.width * Math.sin(angle + convertDegreeToRadian(90)),
    },
    {
      x:
        river.from.x +
        0.5 * river.width * Math.cos(angle - convertDegreeToRadian(90)),
      y:
        river.from.y +
        0.5 * river.width * Math.sin(angle - convertDegreeToRadian(90)),
    },
    {
      x:
        river.to.x +
        0.5 * river.width * Math.cos(angle - convertDegreeToRadian(90)),
      y:
        river.to.y +
        0.5 * river.width * Math.sin(angle - convertDegreeToRadian(90)),
    },
    {
      x:
        river.to.x +
        0.5 * river.width * Math.cos(angle + convertDegreeToRadian(90)),
      y:
        river.to.y +
        0.5 * river.width * Math.sin(angle + convertDegreeToRadian(90)),
    },
  ]
  return riverPolygon
}

function doesIntersect50PercentOrMore(
  tile: Tile,
  riverPolygon: Polygon,
): boolean {
  const tilePolygon = [
    {
      x: tile.x,
      y: tile.y,
    },
    {
      x: tile.x + TILE_WIDTH,
      y: tile.y,
    },
    {
      x: tile.x + TILE_WIDTH,
      y: tile.y + TILE_HEIGHT,
    },
    {
      x: tile.x,
      y: tile.y + TILE_HEIGHT,
    },
  ]
  const intersectionPolygons = intersect(tilePolygon, riverPolygon)
  return intersectionPolygons
    ? sum(intersectionPolygons.map(polygonArea)) >= 0.5 * TILE_AREA
    : false
}

function sum(values: number[]): number {
  return values.reduce(add, 0)
}

function add(a: number, b: number): number {
  return a + b
}

function convertDegreeToRadian(value: number): number {
  return ((Math.PI * 2) / 360) * value
}
