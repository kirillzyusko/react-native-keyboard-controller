import fs from "fs";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { delay } from "../helpers";

type Frame = { x: number; y: number; width: number; height: number };
type Policy = "close" | "none";

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
  y: number,
  scale: number,
) => {
  const rect = { x: 8, y: frame.y + 3, width: 140, height: frame.height - 6 };
  const expected = crop(reference, rect, scale);
  let best = 1;

  for (const adjustment of [-1, 0, 1]) {
    const current = crop(
      actual,
      { ...rect, x: rect.x + x, y: rect.y + y + adjustment },
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

  for (let dy = -4; dy <= 4; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      let missed = 0;

      for (const [px, py] of points) {
        let matched = false;

        for (let row = -1; row <= 1 && !matched; row += 1) {
          for (let column = -1; column <= 1 && !matched; column += 1) {
            matched = dark(
              actual,
              px + x + dx + column,
              py + y + dy + row,
              scale,
            );
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

export const expectMidSwipeLayout = async (
  mode: Policy,
  screenFrame: Frame,
  closedComposer: Frame,
  openComposer: Frame,
  closed: PNG,
  opened: PNG,
) => {
  const screen = element(by.id("back-swipe.gesture"));
  // takeScreenshot uses simctl, so it can observe a held EarlGrey gesture.
  const gesture = screen.longPressAndDrag(
    100,
    0.2,
    0.25,
    screen,
    0.8,
    0.25,
    "slow",
    8000,
  );
  const completion = gesture.then(
    () => undefined,
    (error: Error) => error,
  );
  const deadline = Date.now() + 9000;
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

    if (mode === "close") {
      expectComposer(closed, middle, closedComposer, x, 0, scale);
    } else {
      expectComposer(opened, middle, openComposer, x, 0, scale);
      expectKeyboard(opened, middle, keyboardTop, x, 0, scale);
    }
  } finally {
    gestureError = await completion;
  }

  if (gestureError) {
    throw gestureError;
  }
};
