import { expect } from "detox";

import {
  delay,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitAndType,
  waitForElementById,
} from "./helpers";

const DEFAULT_TIMEOUT = 5000;

describe("input handlers functionality", () => {
  it("should fire `onTextChange` with correct text", async () => {
    await scrollDownUntilElementIsVisible(
      "main_scroll_view",
      "focused_input_handlers",
    );
    await waitAndTap("focused_input_handlers");
    await waitForElementById("masked_input");
    await waitAndTap("masked_input");
    // make sure keyboard is shown
    await delay(5000);
    await waitAndType("masked_input", "1234567890");
    await expect(element(by.id("formatted_text"))).toHaveText(
      "Formatted: +1 (123) 456 78 90",
    );
    await expect(element(by.id("extracted_text"))).toHaveText(
      "Extracted: 1234567890",
    );
    /*await expect(element(by.id("worklet_text"))).toHaveText(
      "Worklet: +1 (123) 456 78 90",
    );*/
    await delay(10000);
  });

  it("should fire `onSelectionChange` with expected values", async () => {
    await delay(10000);
    await waitFor(element(by.id("selection_text_start_end")))
      .toHaveText("start: 18, end: 18")
      .withTimeout(DEFAULT_TIMEOUT);
    await waitFor(element(by.id("original_selection_text_start_end")))
      .toHaveText("start: 18, end: 18")
      .withTimeout(DEFAULT_TIMEOUT);

    await waitAndTap("multiline_input");
    await waitAndType("multiline_input", "QWERTY\nqwerty");

    await waitFor(element(by.id("formatted_text")))
      .toHaveText("Formatted: QWERTY\nqwerty")
      .withTimeout(DEFAULT_TIMEOUT);
    /*await waitFor(element(by.id("worklet_text")))
      .toHaveText("Worklet: QWERTY\nqwerty")
      .withTimeout(DEFAULT_TIMEOUT);*/
    await waitFor(element(by.id("selection_text_start_end")))
      .toHaveText("start: 13, end: 13")
      .withTimeout(DEFAULT_TIMEOUT);
    await waitFor(element(by.id("original_selection_text_start_end")))
      .toHaveText("start: 13, end: 13")
      .withTimeout(DEFAULT_TIMEOUT);

    await element(by.id("multiline_input")).clearText();
    await waitAndType("multiline_input", "QWERTY");

    await waitFor(element(by.id("formatted_text")))
      .toHaveText("Formatted: QWERTY")
      .withTimeout(DEFAULT_TIMEOUT);
    /*await waitFor(element(by.id("worklet_text")))
      .toHaveText("Worklet: QWERTY")
      .withTimeout(DEFAULT_TIMEOUT);*/
    await waitFor(element(by.id("selection_text_start_end")))
      .toHaveText("start: 6, end: 6")
      .withTimeout(DEFAULT_TIMEOUT);
    await waitFor(element(by.id("original_selection_text_start_end")))
      .toHaveText("start: 6, end: 6")
      .withTimeout(DEFAULT_TIMEOUT);

    await element(by.id("multiline_input")).tapBackspaceKey();

    await waitFor(element(by.id("formatted_text")))
      .toHaveText("Formatted: QWERT")
      .withTimeout(DEFAULT_TIMEOUT);
    /*await waitFor(element(by.id("worklet_text")))
      .toHaveText("Worklet: QWERT")
      .withTimeout(DEFAULT_TIMEOUT);*/
    await waitFor(element(by.id("selection_text_start_end")))
      .toHaveText("start: 5, end: 5")
      .withTimeout(DEFAULT_TIMEOUT);
    await waitFor(element(by.id("original_selection_text_start_end")))
      .toHaveText("start: 5, end: 5")
      .withTimeout(DEFAULT_TIMEOUT);
  });
});
