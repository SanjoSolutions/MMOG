import { createTileFixture } from "./testing/createTileFixture.js"
import { TileLayer } from "./TileLayer.js"
describe("TileLayer", () => {
  describe("setTile", () => {
    it("sets a tile", () => {
      const tileLayer = new TileLayer()
      const tile = createTileFixture()
      tileLayer.setTile({ row: 0, column: 0 }, tile)
      expect(tileLayer.retrieveTile({ row: 0, column: 0 })).toBe(tile)
    })
  })

  describe("removeTile", () => {
    it("removes a tile", () => {
      const tileLayer = new TileLayer()
      const tile = createTileFixture()
      tileLayer.setTile({ row: 0, column: 0 }, tile)
      tileLayer.removeTile({ row: 0, column: 0 })
      expect(tileLayer.retrieveTile({ row: 0, column: 0 })).toBe(null)
    })
  })

  describe("retrieveTile", () => {
    it("retrieves a tile", () => {
      const tileLayer = new TileLayer()
      const tile = createTileFixture()
      tileLayer.setTile({ row: 0, column: 0 }, tile)
      expect(tileLayer.retrieveTile({ row: 0, column: 0 })).toBe(tile)
    })
  })

  describe("retrieveArea", () => {
    it("retrieves an area", () => {
      const tileLayer = new TileLayer()
      const tile = createTileFixture()
      tileLayer.setTile({ row: 0, column: 0 }, tile)
      const areaTileLayer = tileLayer.retrieveArea({
        from: { row: 0, column: 0 },
        to: { row: 0, column: 0 },
      })
      expect(areaTileLayer.retrieveTile({ row: 0, column: 0 })).toBe(tile)
    })
  })

  describe("copy", () => {
    it("copies a tile layer", () => {
      const tileLayer = new TileLayer()
      const tile = createTileFixture()
      tileLayer.setTile({ row: 0, column: 0 }, tile)
      const copy = tileLayer.copy()
      expect(copy.retrieveTile({ row: 0, column: 0 })).toBe(tile)
    })
  })

  describe("entries", () => {
    it("is a generator function which returns entry by entry", () => {
      const tileLayer = new TileLayer()
      const tile1 = createTileFixture()
      const tile2 = createTileFixture()
      tileLayer.setTile({ row: 0, column: 0 }, tile1)
      tileLayer.setTile({ row: 1, column: 1 }, tile2)
      const entries = [...tileLayer.entries()]
      expect(entries).toEqual([
        [{ row: 0, column: 0 }, tile1],
        [{ row: 1, column: 1 }, tile2],
      ])
    })
  })
})
