import fs from "fs";

import colors from "colors/safe";
import { device } from "detox";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { delay } from "../helpers";
import parseDeviceName from "../utils/parseDeviceName";

import { applyDisplayMask } from "./displayMask";
import { normalizeScreenshotOrientation } from "./normalizeScreenshotOrientation";

const getDirFromFilePath = (path: string) =>
  path.substring(0, path.lastIndexOf("/"));

const writeToFile = (path: string, buffer: Buffer, onWrite?: () => void) => {
  const dir = getDirFromFilePath(path);

  try {
    fs.accessSync(dir);
  } catch (error) {
    fs.mkdirSync(dir);
  } finally {
    fs.writeFileSync(path, buffer);
    onWrite?.();
  }

  return buffer;
};

const checkIsScreenShotMatch = (
  expectedBitmapBuffer: Buffer,
  bitmapBuffer: Buffer,
  acceptableDiffPercent: number,
  maskDisplayCutouts: boolean,
): { matched: boolean; percentDiff: string; diff: PNG } => {
  const img2 = PNG.sync.read(bitmapBuffer);
  const captured = PNG.sync.read(expectedBitmapBuffer);
  const img1 = maskDisplayCutouts
    ? normalizeScreenshotOrientation(captured, img2)
    : captured;
  const { height, width } = img1;

  const totalPixels = maskDisplayCutouts
    ? applyDisplayMask(img1, img2)
    : width * height;
  const allowableError = (totalPixels / 100) * acceptableDiffPercent;
  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  );
  const percentDiff = ((diffPixels / totalPixels) * 100).toFixed(2);

  const matched = diffPixels <= allowableError;

  return { matched, percentDiff, diff };
};

function verifyBitmapsToBeEqual(
  tempImagePath: string,
  screenName: string,
  acceptableDiffPercent = 0.1,
  maskDisplayCutouts = false,
): void {
  const platform = device.getPlatform();
  const deviceName = parseDeviceName(device.name);
  const SCREENS_DIR = `kit/assets/${platform}/${deviceName}`;

  const expectedBitmapBuffer = fs.readFileSync(tempImagePath);
  const expectedImagePath = `${SCREENS_DIR}/${screenName}.png`;
  // Missing references must fail; tests never generate or replace assets.
  const bitmapBuffer = fs.readFileSync(expectedImagePath);
  const { diff, matched, percentDiff } = checkIsScreenShotMatch(
    expectedBitmapBuffer,
    bitmapBuffer,
    acceptableDiffPercent,
    maskDisplayCutouts,
  );

  console.debug(
    colors.green(
      `Screenshot '${screenName}' has ${percentDiff}% pixel diff! Acceptable is ${acceptableDiffPercent}%.`,
    ),
  );

  if (!matched) {
    const SCREEN_DIFF_IMAGE_PATH = `artifacts/${screenName}-diff.png`;

    // Trying every PNG filter is expensive inside Jest's VM on large screenshots.
    writeToFile(
      SCREEN_DIFF_IMAGE_PATH,
      PNG.sync.write(diff, { filterType: 0 }),
    );

    throw new Error(
      `Expected image at ${tempImagePath} to match to image at ${expectedImagePath}, but it had ${percentDiff}% pixel diff!`,
    );
  }
}

async function expectElementBitmapsToBeEqual(
  elementId: string,
  bitmapName: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  const imagePath = await element(by.id(elementId)).takeScreenshot(bitmapName);

  verifyBitmapsToBeEqual(imagePath, bitmapName, acceptableDiffPercent);
}

async function expectBitmapsToBeEqual(
  screenName: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  // better to wait 1s to be sure all scroll indicators etc are hidden
  // and then take a screenshot and compare it (because it's expensive operation)
  await delay(1000);
  const tempImagePath = await device.takeScreenshot(screenName);

  verifyBitmapsToBeEqual(
    tempImagePath,
    screenName,
    acceptableDiffPercent,
    device.getPlatform() === "ios",
  );
}

export { expectBitmapsToBeEqual, expectElementBitmapsToBeEqual };
