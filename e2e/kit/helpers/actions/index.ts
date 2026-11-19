import { execFileSync } from "child_process";

import colors from "colors/safe";
import { expect } from "detox";

import { waitForElementById, waitForExpect } from "../awaitable";
import { getDevicePreference } from "../env/devicePreferences";

const TIMEOUT_FOR_LONG_OPERATIONS = 30000;

const getAndroidKeyboard = () => {
  const source = execFileSync(
    "adb",
    ["-s", device.id, "shell", "dumpsys", "window", "displays"],
    { encoding: "utf8", timeout: 10000 },
  ).match(
    /InsetsSource[^\n]*\btype=ime frame=\[\d+,(\d+)\][^\n]*\bvisible=(true|false)/,
  );

  return source
    ? { top: Number(source[1]), visible: source[2] === "true" }
    : undefined;
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const tap = async (id: string, point?: Detox.Point2D): Promise<void> => {
  console.debug(
    "---------------------------------\n",
    "Tap on element with id: ",
    colors.magenta(id),
  );

  await element(by.id(id)).tap(point);
};

// Not used yet. Will be used later
export const tapItemAtIndex = async (id: string, index = 0): Promise<void> => {
  console.debug(
    "---------------------------------\n",
    "Tap at index on element with id:",
    colors.magenta(id),
  );
  await element(by.text(id)).atIndex(index).tap();
};

export const clearField = async (id: string): Promise<void> => {
  console.debug(
    "---------------------------------\n",
    "Clear field with id:",
    colors.magenta(id),
  );
  await element(by.id(id)).clearText();
};

export const replaceText = async (id: string, text = ""): Promise<void> => {
  console.debug(
    "---------------------------------\n",
    "Replace field with id:",
    colors.magenta(id),
  );
  await element(by.id(id)).replaceText(text);
};

export const typeText = async (id: string, text: string): Promise<void> => {
  console.debug(
    "---------------------------------\n",
    "Type on field with id:",
    colors.magenta(id),
    "\x1b[36text:\x1b[0m",
    colors.yellow(text),
  );

  await element(by.id(id)).typeText(text);
};

export const swipeUp = async (id: string): Promise<void> => {
  console.debug(
    "---------------------------------\n",
    "Swipe element with id: ",
    colors.magenta(id),
  );
  await element(by.id(id)).swipe("up", "fast", 1, NaN, 0.85);
};

export const waitAndTap = async (
  id: string,
  point?: Detox.Point2D,
): Promise<void> => {
  await waitForElementById(id, TIMEOUT_FOR_LONG_OPERATIONS);
  await tap(id, point);
};

export const waitAndFocus = async (id: string): Promise<void> => {
  await waitForExpect(async () => {
    await waitForElementById(id);
    const keyboard =
      device.getPlatform() === "android" ? getAndroidKeyboard() : undefined;

    if (keyboard?.visible) {
      const { frame } = (await element(
        by.id(id),
      ).getAttributes()) as Detox.AndroidElementAttributes;
      const bottom = Math.min(frame.y + frame.height, keyboard.top);

      if (bottom <= frame.y) {
        throw new Error(`Input '${id}' is covered by the keyboard`);
      }

      await device
        .getUiDevice()
        .click(
          Math.round(frame.x + frame.width / 2),
          Math.round((frame.y + bottom) / 2),
        );
    } else {
      await tap(id);
    }

    await expect(element(by.id(id))).toBeFocused();

    if (device.getPlatform() === "android") {
      const focusedKeyboard = getAndroidKeyboard();

      if (focusedKeyboard && !focusedKeyboard.visible) {
        throw new Error(`Waiting for the keyboard to open for '${id}'`);
      }
    }
  });
};

export const waitAndType = async (id: string, text: string): Promise<void> => {
  await waitForElementById(id, TIMEOUT_FOR_LONG_OPERATIONS);
  await typeText(id, text);
};

export const waitAndReplace = async (id: string, text = ""): Promise<void> => {
  await waitForElementById(id, TIMEOUT_FOR_LONG_OPERATIONS);
  await replaceText(id, text);
};

export const nativeGoBack = async (id: string): Promise<void> => {
  if (device.getPlatform() === "android") {
    await device.pressBack();
  } else {
    await element(by.id(id)).swipe("right", "slow", NaN, 0, 0.5);
  }
};

export const clearAndType = async (id: string, text: string): Promise<void> => {
  await waitForElementById(id, TIMEOUT_FOR_LONG_OPERATIONS);
  await clearField(id);
  await waitAndType(id, text);
};

export const switchToEmojiKeyboard = async () => {
  const emojiButtonCoordinates = getDevicePreference().emojiButtonCoordinates;

  // emoji button is not available
  if (!emojiButtonCoordinates) {
    return;
  }

  // on Android we need to use UiDevice, because keyboard is a third party application,
  // so we have to press through the screen (not the app)
  if (device.getPlatform() === "android") {
    const uiDevice = device.getUiDevice();

    await uiDevice.click(emojiButtonCoordinates.x, emojiButtonCoordinates.y);
  } else {
    // iOS exposes a hidden duplicate after the active Emoji button.
    await element(by.label("Emoji")).atIndex(0).tap();
  }
};

export const scrollDownUntilElementIsVisible = async (
  scrollViewId: string,
  elementId: string,
  {
    x,
    y,
    checkScrollViewVisibility,
  }: { x: number; y: number; checkScrollViewVisibility: boolean } = {
    x: NaN,
    y: 0.5,
    checkScrollViewVisibility: true,
  },
): Promise<void> => {
  if (checkScrollViewVisibility) {
    await waitForElementById(scrollViewId, TIMEOUT_FOR_LONG_OPERATIONS);
  }
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(200, "down", x, y);

  const keyboard =
    device.getPlatform() === "android" ? getAndroidKeyboard() : undefined;

  if (keyboard?.visible) {
    for (let attempt = 0; attempt < 20; attempt++) {
      const { frame } = (await element(
        by.id(elementId),
      ).getAttributes()) as Detox.AndroidElementAttributes;

      if (frame.y + frame.height * 0.75 <= keyboard.top) {
        return;
      }

      await element(by.id(scrollViewId)).scroll(50, "down", x, y);
    }

    throw new Error(`Could not scroll '${elementId}' above the keyboard`);
  }
};

export const scrollUpUntilElementIsBarelyVisible = async (
  scrollViewId: string,
  elementId: string,
): Promise<void> => {
  const distanceToScroll = device.getPlatform() === "ios" ? 80 : 50;
  const keyboard =
    device.getPlatform() === "android" ? getAndroidKeyboard() : undefined;
  const keyboardTop = keyboard?.visible ? keyboard.top : undefined;

  for (let attempt = 0; attempt < 20; attempt++) {
    await element(by.id(scrollViewId)).scroll(
      distanceToScroll,
      "up",
      0.02,
      0.4,
    );

    let isVisible = true;

    if (keyboardTop !== undefined) {
      // Edge-to-edge content can remain "visible" behind the keyboard.
      // Check its actual overlap instead of tapping through to the IME.
      const { frame } = (await element(
        by.id(elementId),
      ).getAttributes()) as Detox.AndroidElementAttributes;

      isVisible = frame.y + frame.height * 0.75 <= keyboardTop;
    } else {
      try {
        if (device.getPlatform() === "ios") {
          await expect(element(by.id(elementId))).toBeVisible();
        } else {
          await element(by.id(elementId)).tap({ x: 0, y: 25 });
        }
      } catch (e) {
        isVisible = false;
      }
    }

    if (!isVisible) {
      await element(by.id(scrollViewId)).scroll(50, "down", 0.01, 0.5);

      return;
    }
  }

  throw new Error(`Could not scroll '${elementId}' out of view`);
};

export const selectText = async (id: string) => {
  console.debug(
    "---------------------------------\n",
    "Select text with id:",
    colors.magenta(id),
  );

  if (device.getPlatform() === "ios") {
    // on Android multiTap sometimes may not work properly
    await element(by.id(id)).multiTap(2);
  } else {
    await element(by.id(id)).longPress();
  }
};

export const closeKeyboard = async (textInputId: string) => {
  if (device.getPlatform() === "android") {
    await device.pressBack();
  } else {
    await typeText(textInputId, "\n");
  }
};
