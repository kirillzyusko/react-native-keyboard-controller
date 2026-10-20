import { PNG } from "pngjs";

/** Newer simctl versions rotate landscape captures; reviewed baselines use the portrait pixel buffer. */
export function normalizeScreenshotOrientation(
  captured: PNG,
  expected: { width: number; height: number },
): PNG {
  if (
    expected.width >= expected.height ||
    captured.width !== expected.height ||
    captured.height !== expected.width
  ) {
    return captured;
  }

  const rotated = new PNG({ width: captured.height, height: captured.width });

  for (let y = 0; y < captured.height; y += 1) {
    for (let x = 0; x < captured.width; x += 1) {
      const source = (y * captured.width + x) * 4;
      const destination = (x * rotated.width + captured.height - y - 1) * 4;

      captured.data.copy(rotated.data, destination, source, source + 4);
    }
  }

  return rotated;
}
