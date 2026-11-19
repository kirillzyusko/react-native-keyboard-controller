import fs from "fs";

import colors from "colors/safe";
import { device } from "detox";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { delay } from "../helpers";
import parseDeviceName from "../utils/parseDeviceName";

const getDirFromFilePath = (path: string) =>
  path.substring(0, path.lastIndexOf("/"));

const writeToFile = (path: string, buffer: Buffer, onWrite?: () => void) => {
  const dir = getDirFromFilePath(path);

  try {
    fs.accessSync(dir);
  } catch (error) {
    // TEMPORARY (baseline regeneration): `kit/assets` does not exist while
    // all baselines are deleted, so create the whole path
    fs.mkdirSync(dir, { recursive: true });
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

const getExpectedImagePath = (screenName: string) => {
  const platform = device.getPlatform();
  const deviceName = parseDeviceName(device.name);

  return `kit/assets/${platform}/${deviceName}/${screenName}.png`;
};

// TEMPORARY (baseline regeneration): a missing baseline is written from the
// current screenshot on the first attempt, so take screenshots until two
// consecutive ones match before it gets stored.
const NEW_BASELINE_ATTEMPTS = 10;
const NEW_BASELINE_INTERVAL = 1000;

async function takeSettledScreenshot(
  takeScreenshot: (name: string) => Promise<string>,
  screenName: string,
  acceptableDiffPercent: number,
): Promise<string> {
  if (fs.existsSync(getExpectedImagePath(screenName))) {
    return takeScreenshot(screenName);
  }

  await delay(NEW_BASELINE_INTERVAL);
  let previousPath = await takeScreenshot(`${screenName}-settle-0`);

  for (let attempt = 1; attempt <= NEW_BASELINE_ATTEMPTS; attempt++) {
    await delay(NEW_BASELINE_INTERVAL);
    const currentPath = await takeScreenshot(`${screenName}-settle-${attempt}`);
    const { matched } = checkIsScreenShotMatch(
      fs.readFileSync(previousPath),
      fs.readFileSync(currentPath),
      acceptableDiffPercent,
    );

    if (matched) {
      return currentPath;
    }

    console.debug(
      colors.yellow(
        `New baseline '${screenName}' is not settled yet (attempt ${attempt})`,
      ),
    );
    previousPath = currentPath;
  }

  return previousPath;
}

function verifyBitmapsToBeEqual(
  tempImagePath: string,
  screenName: string,
  acceptableDiffPercent = 0.1,
): void {
  const platform = device.getPlatform();
  const deviceName = parseDeviceName(device.name);
  const SCREENS_DIR = `kit/assets/${platform}/${deviceName}`;

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

async function expectElementBitmapsToBeEqual(
  elementId: string,
  bitmapName: string,
  acceptableDiffPercent = 0.1,
): Promise<void> {
  const imagePath = await takeSettledScreenshot(
    (name) => element(by.id(elementId)).takeScreenshot(name),
    bitmapName,
    acceptableDiffPercent,
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
  const tempImagePath = await takeSettledScreenshot(
    (name) => device.takeScreenshot(name),
    screenName,
    acceptableDiffPercent,
  );

  verifyBitmapsToBeEqual(tempImagePath, screenName, acceptableDiffPercent);
}

export { expectBitmapsToBeEqual, expectElementBitmapsToBeEqual };
