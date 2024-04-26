import colors from "colors/safe";

import { waitForElementById } from "../awaitable";

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

export const scrollDownUntilElementIsVisible = async (
  scrollViewId: string,
  elementId: string,
): Promise<void> => {
  await waitForElementById(scrollViewId, TIMEOUT_FOR_LONG_OPERATIONS);
  await waitFor(element(by.id(elementId)))
    .toBeVisible()
    .whileElement(by.id(scrollViewId))
    .scroll(100, "down");
};

export const closeKeyboard = async (textInputId: string) => {
  if (device.getPlatform() === "android") {
    await device.pressBack();
  } else {
    await typeText(textInputId, "\n");
  }
};
