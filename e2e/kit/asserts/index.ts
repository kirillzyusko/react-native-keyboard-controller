import fs from 'fs';

import colors from 'colors/safe';
import { device } from 'detox';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const parseDeviceName = (name: string) =>
  name.split('(').pop()?.replace(')', '');
const getDirFromFilePath = (path: string) =>
  path.substring(0, path.lastIndexOf('/'));

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
  onWrite: () => void
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
  acceptableDiffPercent: number
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
    { threshold: 0.1 }
  );
  const percentDiff = ((diffPixels / totalPixels) * 100).toFixed(2);

  const matched = diffPixels <= allowableError;

  return { matched, percentDiff, diff };
};

async function expectBitmapsToBeEqual(
  screenName: string,
  acceptableDiffPercent = 0.1
): Promise<void> {
  const platform = device.getPlatform();
  const deviceName = parseDeviceName(device.name);
  const SCREENS_DIR = `kit/assets/${platform}/${deviceName}`;

  const tempImagePath = await device.takeScreenshot(screenName);

  const expectedImagePath = `${SCREENS_DIR}/${screenName}.png`;
  const expectedBitmapBuffer = fs.readFileSync(tempImagePath);

  const onWrite = () =>
    console.debug(
      colors.green(
        `Generated an image for the '${screenName}' screen on the path '${SCREENS_DIR}'`
      )
    );

  const bitmapBuffer = readFromFileOrCreateNew(
    expectedImagePath,
    expectedBitmapBuffer,
    onWrite
  );

  const { diff, matched, percentDiff } = checkIsScreenShotMatch(
    expectedBitmapBuffer,
    bitmapBuffer,
    acceptableDiffPercent
  );

  console.debug(
    colors.green(`Screenshot '${screenName}' has ${percentDiff}% pixel diff!`)
  );

  if (!matched) {
    const SCREEN_DIFF_IMAGE_PATH = `artifacts/${screenName}-diff.png`;

    writeToFile(SCREEN_DIFF_IMAGE_PATH, PNG.sync.write(diff));

    throw new Error(
      `Expected image at ${tempImagePath} to match to image at ${expectedImagePath}, but it had ${percentDiff}% pixel diff!`
    );
  }
}

export { expectBitmapsToBeEqual };
