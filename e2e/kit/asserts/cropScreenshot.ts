import { PNG } from "pngjs";

type Frame = { x: number; y: number; width: number; height: number };

export function cropScreenshot(screen: PNG, frame: Frame, scale = 1): PNG {
  const x = Math.round(frame.x * scale);
  const y = Math.round(frame.y * scale);
  const width = Math.round(frame.width * scale);
  const height = Math.round(frame.height * scale);

  if (
    x < 0 ||
    y < 0 ||
    width <= 0 ||
    height <= 0 ||
    x + width > screen.width ||
    y + height > screen.height
  ) {
    throw new Error("Element screenshot bounds are outside the display");
  }

  const result = new PNG({ width, height });

  for (let row = 0; row < height; row += 1) {
    const start = ((y + row) * screen.width + x) * 4;

    screen.data.copy(result.data, row * width * 4, start, start + width * 4);
  }

  return result;
}
