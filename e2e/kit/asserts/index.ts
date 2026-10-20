import fs from "fs";

import colors from "colors/safe";
import { device } from "detox";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { Env, delay } from "../helpers";
import { getDevicePreference } from "../helpers/env/devicePreferences";
import parseDeviceName from "../utils/parseDeviceName";

import { cropScreenshot } from "./cropScreenshot";
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
): { matched: boolean; percentDiff: string; diff: PNG; diffPixels: number } => {
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

  return { matched, percentDiff, diff, diffPixels };
};

function verifyBitmapsToBeEqual(
  tempImagePath: string,
  screenName: string | readonly string[],
  acceptableDiffPercent = 0.1,
  maskDisplayCutouts = false,
): void {
  const platform = device.getPlatform();
  const deviceName = parseDeviceName(device.name);
  const SCREENS_DIR = `kit/assets/${platform}/${deviceName}`;

  const expectedBitmapBuffer = fs.readFileSync(tempImagePath);
  const names = typeof screenName === "string" ? [screenName] : screenName;

  if (names.length === 0) {
    throw new Error("At least one screenshot baseline is required");
  }

  // Every candidate is an existing, reviewed baseline. Missing files must fail.
  const candidates = names.map((name) => {
    const expectedImagePath = `${SCREENS_DIR}/${name}.png`;
    const bitmapBuffer = fs.readFileSync(expectedImagePath);

    return {
      name,
      expectedImagePath,
      ...checkIsScreenShotMatch(
        expectedBitmapBuffer,
        bitmapBuffer,
        acceptableDiffPercent,
        maskDisplayCutouts,
      ),
    };
  });
  const best = candidates.reduce((closest, candidate) =>
    candidate.diffPixels < closest.diffPixels ? candidate : closest,
  );
  const { name, expectedImagePath, diff, matched, percentDiff } = best;

  console.debug(
    colors.green(
      `Screenshot '${name}' has ${percentDiff}% pixel diff! Acceptable is ${acceptableDiffPercent}%.`,
    ),
  );

  if (!matched) {
    const SCREEN_DIFF_IMAGE_PATH = `artifacts/${name}-diff.png`;

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
  const attributes = await element(by.id(elementId)).getAttributes();

  if (!("frame" in attributes)) {
    throw new Error(`No screen frame for element ${elementId}`);
  }
  // A software draw of a Fabric view can omit its hardware-rendered children.
  const imagePath = await device.takeScreenshot(bitmapName);
  const screen = PNG.sync.read(fs.readFileSync(imagePath));
  const preference = getDevicePreference();
  const logicalWidth =
    screen.width > screen.height ? preference.height : preference.width;
  const scale =
    device.getPlatform() === "ios" ? screen.width / logicalWidth : 1;
  const crop = cropScreenshot(screen, attributes.frame, scale);

  fs.writeFileSync(imagePath, PNG.sync.write(crop, { filterType: 0 }));

  verifyBitmapsToBeEqual(imagePath, bitmapName, acceptableDiffPercent);
}

async function expectBitmapsToBeEqual(
  screenName: string | readonly string[],
  // Allow subpixel text rounding and caret phases in the non-AOSP configuration.
  acceptableDiffPercent = Env.softCheck ? 0.15 : 0.1,
): Promise<void> {
  // better to wait 1s to be sure all scroll indicators etc are hidden
  // and then take a screenshot and compare it (because it's expensive operation)
  await delay(1000);
  const tempImagePath = await device.takeScreenshot(
    typeof screenName === "string" ? screenName : screenName[0],
  );

  verifyBitmapsToBeEqual(
    tempImagePath,
    screenName,
    acceptableDiffPercent,
    device.getPlatform() === "ios",
  );
}

export { expectBitmapsToBeEqual, expectElementBitmapsToBeEqual };
