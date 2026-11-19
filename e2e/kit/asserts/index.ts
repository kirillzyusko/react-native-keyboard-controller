import fs from "fs";

import colors from "colors/safe";
import { device } from "detox";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { delay } from "../helpers";
import parseDeviceName from "../utils/parseDeviceName";

const getDirFromFilePath = (path: string) =>
  path.substring(0, path.lastIndexOf("/"));

const getScreensDir = () =>
  `kit/assets/${device.getPlatform()}/${parseDeviceName(device.name)}`;

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

const readFromFileOrCreateNew = (
  path: string,
  buffer: Buffer,
  onWrite: () => void,
): Buffer => {
  let bitmapBuffer;

  try {
    bitmapBuffer = fs.readFileSync(path);
  } catch (e) {
    bitmapBuffer = writeToFile(path, buffer, onWrite);
  }

  return bitmapBuffer;
};

const checkIsScreenShotMatch = (
  expectedBitmapBuffer: Buffer,
  bitmapBuffer: Buffer,
  acceptableDiffPercent: number,
): { matched: boolean; percentDiff: string; diff: PNG } => {
  const img1 = PNG.sync.read(expectedBitmapBuffer);
  const img2 = PNG.sync.read(bitmapBuffer);
  const { height, width } = img1;

  const totalPixels = width * height;
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
): void {
  const SCREENS_DIR = getScreensDir();

  const expectedImagePath = `${SCREENS_DIR}/${screenName}.png`;
  const expectedBitmapBuffer = fs.readFileSync(tempImagePath);

  const onWrite = () =>
    console.debug(
      colors.green(
        `Generated an image for the '${screenName}' screen on the path '${SCREENS_DIR}'`,
      ),
    );

  const bitmapBuffer = readFromFileOrCreateNew(
    expectedImagePath,
    expectedBitmapBuffer,
    onWrite,
  );

  const { diff, matched, percentDiff } = checkIsScreenShotMatch(
    expectedBitmapBuffer,
    bitmapBuffer,
    acceptableDiffPercent,
  );

  console.debug(
    colors.green(
      `Screenshot '${screenName}' has ${percentDiff}% pixel diff! Acceptable is ${acceptableDiffPercent}%.`,
    ),
  );

  if (!matched) {
    const SCREEN_DIFF_IMAGE_PATH = `artifacts/${screenName}-diff.png`;

    writeToFile(SCREEN_DIFF_IMAGE_PATH, PNG.sync.write(diff));

    throw new Error(
      `Expected image at ${tempImagePath} to match to image at ${expectedImagePath}, but it had ${percentDiff}% pixel diff!`,
    );
  }
}

async function captureStableScreenshot(
  screenName: string,
  acceptableDiffPercent: number,
  capture: () => Promise<string>,
): Promise<string> {
  let imagePath = await capture();

  if (fs.existsSync(`${getScreensDir()}/${screenName}.png`)) {
    return imagePath;
  }

  // A new baseline must show a settled frame, not a keyboard/layout transition.
  let previous = fs.readFileSync(imagePath);

  for (let attempt = 0; attempt < 5; attempt++) {
    await delay(1000);
    imagePath = await capture();
    const current = fs.readFileSync(imagePath);

    if (
      checkIsScreenShotMatch(previous, current, acceptableDiffPercent).matched
    ) {
      return imagePath;
    }

    previous = current;
  }

  throw new Error(
    `Screenshot '${screenName}' did not settle for a new baseline`,
  );
}

async function expectElementBitmapsToBeEqual(
  elementId: string,
  bitmapName: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  const imagePath = await captureStableScreenshot(
    bitmapName,
    acceptableDiffPercent,
    () => element(by.id(elementId)).takeScreenshot(bitmapName),
  );

  verifyBitmapsToBeEqual(imagePath, bitmapName, acceptableDiffPercent);
}

async function expectBitmapsToBeEqual(
  screenName: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  // better to wait 1s to be sure all scroll indicators etc are hidden
  // and then take a screenshot and compare it (because it's expensive operation)
  await delay(1000);
  const tempImagePath = await captureStableScreenshot(
    screenName,
    acceptableDiffPercent,
    () => device.takeScreenshot(screenName),
  );

  verifyBitmapsToBeEqual(tempImagePath, screenName, acceptableDiffPercent);
}

export { expectBitmapsToBeEqual, expectElementBitmapsToBeEqual };
