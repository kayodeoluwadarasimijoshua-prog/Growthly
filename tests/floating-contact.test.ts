import { describe, expect, it } from "vitest";
import {
  clampContactPosition,
  readContactPosition,
} from "@/lib/floating-contact";
describe("floating WhatsApp position", () => {
  it("keeps the contact shortcut within desktop and mobile bounds", () => {
    expect(clampContactPosition({ x: -500, y: 10000 }, 390, 844)).toEqual({
      x: 16,
      y: 772,
    });
    expect(clampContactPosition({ x: 10000, y: -500 }, 1440, 900)).toEqual({
      x: 1368,
      y: 16,
    });
  });
  it("does not overlap the consent banner", () => {
    expect(clampContactPosition({ x: 300, y: 800 }, 390, 844, 600)).toEqual({
      x: 300,
      y: 528,
    });
  });
  it("recovers from invalid coordinates and small viewports", () => {
    expect(clampContactPosition({ x: NaN, y: Infinity }, 390, 844)).toEqual({
      x: 318,
      y: 772,
    });
    expect(clampContactPosition({ x: 0, y: 0 }, 80, 80)).toEqual({
      x: 16,
      y: 16,
    });
  });
  it("accepts only finite numeric stored preferences", () => {
    expect(readContactPosition('{"x":16,"y":300}')).toEqual({ x: 16, y: 300 });
    for (const value of [
      null,
      "broken",
      "null",
      "[]",
      '{"x":"16","y":3}',
      '{"x":1e999,"y":3}',
    ])
      expect(readContactPosition(value)).toBeNull();
  });
});
