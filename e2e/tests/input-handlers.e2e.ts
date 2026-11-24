// Ported from kit/003-input-handlers.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  hideAndroidKeyboard,
  openExample,
  tapBackspaceKey,
  test,
  typeText,
} from "./support/kit";

describe("input handlers functionality", { serial: true }, () => {
  test("should fire `onTextChange` with correct text", async (ctx) => {
    const { screen } = ctx;

    await openExample(ctx, "focused_input_handlers");
    await expect(screen.getByTestId("masked_input")).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
    await screen.getByTestId("masked_input").tap();
    // Detox waited 500 ms "to make sure keyboard is shown"; the next action waits for the field.
    await typeText(ctx, "masked_input", "1234567890");
    await expect(screen.getByTestId("formatted_text")).toHaveText(
      "Formatted: +1 (123) 456 78 90",
    );
    await expect(screen.getByTestId("extracted_text")).toHaveText(
      "Extracted: 1234567890",
    );
    await expect(screen.getByTestId("worklet_text")).toHaveText(
      "Worklet: +1 (123) 456 78 90",
    );
  });

  test("should fire `onSelectionChange` with expected values", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("multiline_input").tap();
    await typeText(ctx, "multiline_input", "QWERTY\nqwerty");

    await expect(screen.getByTestId("formatted_text")).toHaveText(
      "Formatted: QWERTY\nqwerty",
    );
    await expect(screen.getByTestId("worklet_text")).toHaveText(
      "Worklet: QWERTY\nqwerty",
    );
    // On Android these labels can sit under the keyboard, out of the
    // accessibility tree.
    await hideAndroidKeyboard(ctx);
    await expect(screen.getByTestId("selection_text_start_end")).toHaveText(
      "start: 13, end: 13",
    );
    await expect(
      screen.getByTestId("original_selection_text_start_end"),
    ).toHaveText("start: 13, end: 13");

    await screen.getByTestId("multiline_input").clear();
    await typeText(ctx, "multiline_input", "QWERTY");

    await expect(screen.getByTestId("formatted_text")).toHaveText(
      "Formatted: QWERTY",
    );
    await expect(screen.getByTestId("worklet_text")).toHaveText(
      "Worklet: QWERTY",
    );
    // On Android these labels can sit under the keyboard, out of the
    // accessibility tree.
    await hideAndroidKeyboard(ctx);
    await expect(screen.getByTestId("selection_text_start_end")).toHaveText(
      "start: 6, end: 6",
    );
    await expect(
      screen.getByTestId("original_selection_text_start_end"),
    ).toHaveText("start: 6, end: 6");

    await tapBackspaceKey(ctx);

    await expect(screen.getByTestId("formatted_text")).toHaveText(
      "Formatted: QWERT",
    );
    await expect(screen.getByTestId("worklet_text")).toHaveText(
      "Worklet: QWERT",
    );
    // On Android these labels can sit under the keyboard, out of the
    // accessibility tree.
    await hideAndroidKeyboard(ctx);
    await expect(screen.getByTestId("selection_text_start_end")).toHaveText(
      "start: 5, end: 5",
    );
    await expect(
      screen.getByTestId("original_selection_text_start_end"),
    ).toHaveText("start: 5, end: 5");
  });

  test("should fire `onSelectionChange` when we switch between inputs", async (ctx) => {
    const { screen } = ctx;

    await expect(screen.getByTestId("selection_text_start_end")).toHaveText(
      "start: 5, end: 5",
    );
    await screen.getByTestId("masked_input").tap();
    await hideAndroidKeyboard(ctx);
    await expect(screen.getByTestId("selection_text_start_end")).toHaveText(
      "start: 18, end: 18",
    );
    await typeText(ctx, "multiline_input", ""); // just set focus back
    await hideAndroidKeyboard(ctx);
    await expect(screen.getByTestId("selection_text_start_end")).toHaveText(
      "start: 5, end: 5",
    );
  });
});
