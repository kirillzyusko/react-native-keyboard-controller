import colors from "colors/safe";
import { expect } from "detox";

import { waitForElementById } from "../awaitable";
import { getDevicePreference } from "../env/devicePreferences";

const TIMEOUT_FOR_LONG_OPERATIONS = 30000;

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
    await device.tap(emojiButtonCoordinates);
  }
};

export const scrollDownUntilElementIsVisible = async (
  scrollViewId: string,
  elementId: string,
): Promise<void> => {
  await waitForElementById(scrollViewId, TIMEOUT_FOR_LONG_OPERATIONS);
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(100, "down", NaN, 0.5);
};

export const scrollUpUntilElementIsBarelyVisible = async (
  scrollViewId: string,
  elementId: string,
): Promise<void> => {
  for (;;) {
    await element(by.id(scrollViewId)).scroll(50, "up", 0.01, 0.5);

    try {
      // verify that we can interact with element
      if (device.getPlatform() === "ios") {
        await expect(element(by.id(elementId))).toBeVisible();
      } else {
        // on Android visible is always true
        await element(by.id(elementId)).tap({ x: 0, y: 25 });
      }
    } catch (e) {
      await element(by.id(scrollViewId)).scroll(50, "down", 0.01, 0.5);
      break;
    }
  }
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
