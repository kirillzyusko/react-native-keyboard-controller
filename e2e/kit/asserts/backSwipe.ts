import fs from "fs";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { delay } from "../helpers";

type Frame = { x: number; y: number; width: number; height: number };
type Policy = "close" | "none" | "interactively";

export const readScreenshot = async (name: string) =>
  PNG.sync.read(fs.readFileSync(await device.takeScreenshot(name)));

const white = (image: PNG, x: number, y: number) => {
  const i = (Math.round(y) * image.width + Math.round(x)) * 4;

  return (
    image.data[i] > 248 && image.data[i + 1] > 248 && image.data[i + 2] > 248
  );
};

// The outgoing chat is white; the incoming setup is shaded by navigation.
const screenOffset = (image: PNG, frame: Frame) => {
  const scale = image.width / frame.width;
  const y = image.height * 0.14;
  let x = image.width - 1;

  while (x >= 0 && white(image, x, y)) {
    x -= 1;
  }

  return (x + 1) / scale;
};

const crop = (image: PNG, frame: Frame, scale: number) => {
  const result = new PNG({
    width: Math.round(frame.width * scale),
    height: Math.round(frame.height * scale),
  });

  PNG.bitblt(
    image,
    result,
    Math.round(frame.x * scale),
    Math.round(frame.y * scale),
    result.width,
    result.height,
    0,
    0,
  );

  return result;
};

const expectComposer = (
  reference: PNG,
  actual: PNG,
  frame: Frame,
  x: number,
  scale: number,
) => {
  // Compare the controls above the home indicator and rounded screen corners.
  const rect = {
    x: 8,
    y: frame.y + 3,
    width: 140,
    height: Math.min(48, frame.height - 6),
  };
  const expected = crop(reference, rect, scale);
  let best = 1;

  for (const adjustment of [-1, 0, 1]) {
    const current = crop(
      actual,
      { ...rect, x: rect.x + x, y: rect.y + adjustment },
      scale,
    );
    const changed = pixelmatch(
      expected.data,
      current.data,
      null,
      expected.width,
      expected.height,
      {
        threshold: 0.1,
      },
    );

    best = Math.min(best, changed / (expected.width * expected.height));
  }

  if (best > 0.03) {
    throw new Error(
      `Composer moved away from the expected mid-swipe layout (${(
        best * 100
      ).toFixed(2)}%)`,
    );
  }
};

const dark = (image: PNG, x: number, y: number, scale: number) => {
  const px = Math.round(x * scale);
  const py = Math.round(y * scale);

  if (px < 0 || px >= image.width || py < 0 || py >= image.height) {
    return false;
  }
  const i = (py * image.width + px) * 4;

  return Math.max(image.data[i], image.data[i + 1], image.data[i + 2]) < 100;
};

// Match the actual key legends rather than the OS-dependent blur/background.
// An empty gap, another key row, or a keyboard at the wrong x cannot match.
const expectKeyboard = (
  reference: PNG,
  actual: PNG,
  top: number,
  x: number,
  y: number,
  scale: number,
  maxY = y,
) => {
  const points: [number, number][] = [];

  for (let row = 0; row < 64; row += 1) {
    for (let column = 0; column < 140; column += 1) {
      if (dark(reference, 4 + column, top + 32 + row, scale)) {
        points.push([4 + column, top + 32 + row]);
      }
    }
  }

  if (points.length < 20) {
    throw new Error(
      "The initial screenshot contains no usable software-keyboard key legends",
    );
  }
  let best = 1;

  for (let dy = Math.round(y) - 4; dy <= Math.round(maxY) + 4; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      let missed = 0;

      for (const [px, py] of points) {
        let matched = false;

        for (let row = -1; row <= 1 && !matched; row += 1) {
          for (let column = -1; column <= 1 && !matched; column += 1) {
            matched = dark(actual, px + x + dx + column, py + dy + row, scale);
          }
        }

        if (!matched) {
          missed += 1;
        }
      }
      best = Math.min(best, missed / points.length);
    }
  }

  if (best > 0.1) {
    throw new Error(
      `Keyboard is detached from the mid-swipe layout (${(best * 100).toFixed(
        1,
      )}% unmatched key legends)`,
    );
  }
};

// Sample the solid leading margin of the footer, clear of the input and key legends.
const footerBottom = (
  image: PNG,
  screenX: number,
  openY: number,
  scale: number,
) => {
  const x = Math.round((screenX + 4) * scale);
  let footerPixels = 0;

  for (let y = Math.round(openY * scale); y < image.height; y++) {
    const i = (y * image.width + x) * 4;

    if (
      image.data[i] === 250 &&
      image.data[i + 1] === 250 &&
      image.data[i + 2] === 250
    ) {
      footerPixels++;
    } else {
      if (footerPixels > 25 * scale) {
        return y / scale;
      }
      footerPixels = 0;
    }
  }

  throw new Error("Could not locate the moving composer in the screenshot");
};

export const expectMidSwipeLayout = async (
  mode: Policy,
  screenFrame: Frame,
  closedComposer: Frame,
  openComposer: Frame,
  closed: PNG,
  opened: PNG,
  useScreensPan: boolean,
) => {
  const screen = element(by.id("back-swipe.gesture"));
  // takeScreenshot uses simctl, so it can observe a held EarlGrey gesture.
  const start = mode === "none" && !useScreensPan ? 0 : 0.2;
  const gesture = screen.longPressAndDrag(
    100,
    start,
    0.25,
    screen,
    start + 0.6,
    0.25,
    "slow",
    14000,
  );
  const completion = gesture.then(
    () => undefined,
    (error: Error) => error,
  );
  const deadline = Date.now() + 16000;
  let previous = -1;
  let middle: PNG | undefined;
  let x = 0;
  let gestureError: Error | undefined;
  let attempt = 0;

  try {
    while (Date.now() < deadline) {
      const current = await readScreenshot(
        `InteractiveBackSwipe-${mode}-middle-${++attempt}`,
      );
      const offset = screenOffset(current, screenFrame);

      if (
        offset > screenFrame.width * 0.5 &&
        offset < screenFrame.width * 0.62 &&
        Math.abs(offset - previous) < 1
      ) {
        middle = current;
        x = offset;
        break;
      }
      previous = offset;
      await delay(150);
    }

    if (!middle) {
      throw new Error(
        `The back gesture never held the screen in the middle of its transition (last x=${previous}, frame=${JSON.stringify(
          screenFrame,
        )})`,
      );
    }

    const scale = opened.width / screenFrame.width;
    const keyboardTop = openComposer.y + openComposer.height;
    const travel = middle.height / scale - keyboardTop;

    if (mode === "close") {
      expectComposer(closed, middle, closedComposer, x, scale);
    } else if (mode === "interactively") {
      const shift =
        footerBottom(middle, x, openComposer.y, scale) - keyboardTop;

      if (shift < travel * 0.2 || shift > travel * 0.85) {
        throw new Error(
          `Expected a partially lowered composer, got ${shift}pt of ${travel}pt`,
        );
      }
      expectKeyboard(opened, middle, keyboardTop, 0, shift, scale);
    } else {
      expectComposer(opened, middle, openComposer, x, scale);

      const xShift = useScreensPan ? 0 : x;
      const minY = useScreensPan ? travel * 0.2 : 0;
      const maxY = useScreensPan ? travel * 0.85 : 0;

      expectKeyboard(opened, middle, keyboardTop, xShift, minY, scale, maxY);
    }
  } finally {
    gestureError = await completion;
  }

  if (gestureError) {
    throw gestureError;
  }
};
