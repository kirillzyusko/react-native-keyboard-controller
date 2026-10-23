import type { PNG } from "pngjs";

export function isElementScreenshotUsable(image: PNG): boolean {
  let transparentPixels = 0;

  for (let offset = 3; offset < image.data.length; offset += 4) {
    if (image.data[offset] < 255) {
      transparentPixels += 1;
    }
  }

  // Allow rounded container corners, but reject Fabric's translucent placeholder.
  return transparentPixels <= image.width * image.height * 0.05;
}
