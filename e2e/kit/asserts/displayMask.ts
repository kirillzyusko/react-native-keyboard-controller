type Bitmap = { data: Buffer; width: number; height: number };

export function applyDisplayMask(actual: Bitmap, expected: Bitmap): number {
  const { width, height } = actual;

  if (width !== expected.width || height !== expected.height) {
    throw new Error("Screenshot dimensions do not match the baseline");
  }

  let visiblePixels = width * height;

  // simctl marks the rounded display corners and camera cutout with alpha.
  // These pixels are outside the display; older SDKs captured them differently.
  for (let offset = 0; offset < actual.data.length; offset += 4) {
    if (actual.data[offset + 3] < 255) {
      actual.data.copy(expected.data, offset, offset, offset + 4);
      visiblePixels -= 1;
    }
  }

  if (visiblePixels < width * height * 0.95) {
    throw new Error("Unexpected transparency inside the simulator display");
  }

  return visiblePixels;
}
