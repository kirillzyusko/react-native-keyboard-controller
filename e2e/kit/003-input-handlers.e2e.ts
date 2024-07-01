import { expect } from "detox";

import {
  delay,
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitAndType,
  waitForElementById,
} from "./helpers";

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
    await delay(500);
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

  it("should fire `onSelectionChange` with expected values", async () => {
    await waitAndTap("multiline_input");
    await waitAndType("multiline_input", "QWERTY\nqwerty");

    await expect(element(by.id("formatted_text"))).toHaveText(
      "Formatted: QWERTY\nqwerty",
    );
    await expect(element(by.id("worklet_text"))).toHaveText(
      "Worklet: QWERTY\nqwerty",
    );
    await expect(element(by.id("selection_text_start_end"))).toHaveText(
      "start: 13, end: 13",
    );
    await expect(
      element(by.id("original_selection_text_start_end")),
    ).toHaveText("start: 13, end: 13");

    await element(by.id("multiline_input")).clearText();
    await waitAndType("multiline_input", "QWERTY");

    await expect(element(by.id("formatted_text"))).toHaveText(
      "Formatted: QWERTY",
    );
    await expect(element(by.id("worklet_text"))).toHaveText("Worklet: QWERTY");
    await expect(element(by.id("selection_text_start_end"))).toHaveText(
      "start: 6, end: 6",
    );
    await expect(
      element(by.id("original_selection_text_start_end")),
    ).toHaveText("start: 6, end: 6");

    await element(by.id("multiline_input")).tapBackspaceKey();

    await expect(element(by.id("formatted_text"))).toHaveText(
      "Formatted: QWERT",
    );
    await expect(element(by.id("worklet_text"))).toHaveText("Worklet: QWERT");
    await expect(element(by.id("selection_text_start_end"))).toHaveText(
      "start: 5, end: 5",
    );
    await expect(
      element(by.id("original_selection_text_start_end")),
    ).toHaveText("start: 5, end: 5");
  });

  it("should fire `onSelectionChange` when we switch between inputs", async () => {
    await expect(element(by.id("selection_text_start_end"))).toHaveText(
      "start: 5, end: 5",
    );
    await waitAndTap("masked_input");
    await expect(element(by.id("selection_text_start_end"))).toHaveText(
      "start: 18, end: 18",
    );
    await waitAndType("multiline_input", ""); // just set focus back
    await expect(element(by.id("selection_text_start_end"))).toHaveText(
      "start: 5, end: 5",
    );
  });
});
