import { expect, it } from "@jest/globals";
import { PNG } from "pngjs";

import { cropScreenshot } from "./cropScreenshot";

it("crops the displayed pixels using the element's screen coordinates", () => {
  const screen = new PNG({ width: 4, height: 4 });

  for (let pixel = 0; pixel < 16; pixel += 1) {
    screen.data.fill(pixel, pixel * 4, pixel * 4 + 4);
  }
  const crop = cropScreenshot(
    screen,
    { x: 0.5, y: 0.5, width: 1, height: 1 },
    2,
  );

  expect([crop.width, crop.height]).toEqual([2, 2]);
  expect([...crop.data]).toEqual([
    5, 5, 5, 5, 6, 6, 6, 6, 9, 9, 9, 9, 10, 10, 10, 10,
  ]);
});

it("rejects a partially offscreen element instead of comparing a truncated crop", () => {
  expect(() =>
    cropScreenshot(new PNG({ width: 4, height: 4 }), {
      x: 3,
      y: 0,
      width: 2,
      height: 2,
    }),
  ).toThrow("outside the display");
});
