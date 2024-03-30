import { expect } from "detox";

import {
  delay,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitAndType,
  waitForElementById,
} from "./helpers";
import setDemoMode from "./utils/setDemoMode";

describe("`onTextChange` functionality", () => {
  beforeAll(async () => {
    await setDemoMode();
    await device.launchApp();
  });

  it("should fire `onTextChange` with correct text", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "text_input_mask",
    );
    await waitAndTap("text_input_mask");
    await waitForElementById("masked_input");
    await waitAndTap("masked_input");
    await delay(500); // for keyboard to appear
    await waitAndType("masked_input", "1234567890");
    await expect(element(by.id("formatted_text"))).toHaveText(
      "Formatted: +1 (123) 456 78 90",
    );
    await expect(element(by.id("extracted_text"))).toHaveText(
      "Extracted: 1234567890",
    );
    await expect(element(by.id("worklet_text"))).toHaveText(
      "Worklet: +1 (123) 456 78 90",
    );
  });
});
