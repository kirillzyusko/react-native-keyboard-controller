import { expect, it } from "@jest/globals";
import { PNG } from "pngjs";

import { normalizeScreenshotOrientation } from "./normalizeScreenshotOrientation";

it("rotates a landscape simctl buffer clockwise without changing pixels or alpha", () => {
  const capture = new PNG({ width: 3, height: 2 });

  for (let pixel = 0; pixel < 6; pixel += 1) {
    capture.data.fill(pixel, pixel * 4, pixel * 4 + 4);
  }
  const rotated = normalizeScreenshotOrientation(capture, {
    width: 2,
    height: 3,
  });

  expect([rotated.width, rotated.height]).toEqual([2, 3]);
  expect(
    Array.from({ length: 6 }, (_, pixel) => rotated.data[pixel * 4]),
  ).toEqual([3, 0, 4, 1, 5, 2]);
  expect(rotated.data[3]).toBe(3);
});

it("preserves captures that already use the reviewed orientation", () => {
  const capture = new PNG({ width: 2, height: 3 });

  expect(normalizeScreenshotOrientation(capture, capture)).toBe(capture);
});

it("does not rotate or resize unrelated dimension mismatches", () => {
  const capture = new PNG({ width: 3, height: 2 });

  expect(normalizeScreenshotOrientation(capture, { width: 2, height: 4 })).toBe(
    capture,
  );
});
