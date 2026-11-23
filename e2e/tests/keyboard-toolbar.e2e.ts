// Ported from kit/005-keyboard-toolbar.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  expectElement,
  expectScreen,
  openExample,
  test,
} from "./support/kit";

describe("`KeyboardToolbar` specification", { serial: true }, () => {
  test("should navigate to `Toolbar` screen", async (ctx) => {
    await openExample(ctx, "toolbar");
    await expect(ctx.screen.getByTestId("toolbar.scrollView")).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have expected UI when first input is focused", async (ctx) => {
    await ctx.screen.getByTestId("TextInput#1").tap();
    await expectElement(
      ctx.screen,
      "keyboard.toolbar",
      "ToolbarFirstInputFocused",
    );
  });

  test("should show bottom sheet when `AutoFill Contacts` is pressed", async (ctx) => {
    await ctx.screen.getByTestId("autofill_contacts").tap();
    await expect(ctx.screen.getByTestId("autofill_contacts_close")).toBeVisible(
      { timeout: 15_000 },
    );
  });

  test("should set focus back when modal closed", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("autofill_contacts_close").tap();
    await expect(screen.getByTestId("TextInput#1")).toBeFocused();
    // Detox retried this tap (waitForCompletion) until the button was back.
    await screen.getByTestId("autofill_contacts").tap({ timeout: 15_000 });
  });

  test("should do correct actions when contact gets selected", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("contact_0").tap({ timeout: LONG_TIMEOUT });
    // hide modal
    await expect(screen.getByTestId("autofill_contacts_modal")).toBeHidden();
    // should update text value
    await expect(screen.getByTestId("TextInput#1")).toHaveText("Kiryl");
    // shouldn't render AutoFill Contacts anymore
    await expect(screen.getByTestId("autofill_contacts")).toHaveCount(0);
    // should move focus to next field
    await expect(screen.getByTestId("TextInput#2")).toBeFocused();
    // should match to snapshot (active arrows, no "AutoFill Contacts" label)
    await expectElement(screen, "keyboard.toolbar", "ToolbarAllButtonsEnabled");
  });

  test("should skip a disabled fields", async (ctx) => {
    await ctx.screen.getByTestId("keyboard.toolbar.next").tap();
    await expect(ctx.screen.getByTestId("TextInput#5")).toBeFocused();
  });

  test("should handle multiple clicks in row", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("keyboard.toolbar.next").tap();
    await expect(screen.getByTestId("TextInput#6")).toBeFocused({
      timeout: 15_000,
    });
    await screen.getByTestId("keyboard.toolbar.next").tap();
    await expect(screen.getByTestId("TextInput#7")).toBeFocused({
      timeout: 15_000,
    });
    await screen.getByTestId("keyboard.toolbar.next").tap();
    await expect(screen.getByTestId("TextInput#8")).toBeFocused({
      timeout: 15_000,
    });
  });

  test("should handle `previous` clicks correctly", async (ctx) => {
    await ctx.screen.getByTestId("keyboard.toolbar.previous").tap();
    await expect(ctx.screen.getByTestId("TextInput#7")).toBeFocused({
      timeout: 15_000,
    });
  });

  test("should have expected UI state when end of form reached", async (ctx) => {
    for (let i = 0; i < 6; i++) {
      await ctx.screen.getByTestId("keyboard.toolbar.next").tap();
    }
    await expect(ctx.screen.getByTestId("TextInput#13")).toBeFocused();
    await expectElement(
      ctx.screen,
      "keyboard.toolbar",
      "ToolbarLastInputFocused",
    );
  });

  test("should enable next button when go to previous field from the last one", async (ctx) => {
    await ctx.screen.getByTestId("keyboard.toolbar.previous").tap();
    await expect(ctx.screen.getByTestId("TextInput#12")).toBeFocused();
    await expectElement(
      ctx.screen,
      "keyboard.toolbar",
      "ToolbarAllButtonsEnabled",
    );
  });

  test("should close keyboard when press `Done`", async (ctx) => {
    await ctx.screen.getByTestId("keyboard.toolbar.done").tap();
    await expectScreen(ctx.screen, "ToolbarKeyboardClosed");
  });
});
