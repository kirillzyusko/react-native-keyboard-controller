// Ported from kit/002-enabled-disabled.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  closeKeyboard,
  expectScreen,
  openExample,
  test,
} from "./support/kit";

const INPUT = "keyboard_animation_text_input";

describe("Disabled/enabled functionality", { serial: true }, () => {
  test("should navigate to `Enabled/disabled` screen", async (ctx) => {
    await openExample(ctx, "enabled_disabled");
    await expect(ctx.screen.getByTestId(INPUT)).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have expected state when enabled and keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap();
    await expectScreen(ctx.screen, "EnabledKeyboardIsShown");
  });

  test("should have expected state when enabled and keyboard is closed", async (ctx) => {
    await closeKeyboard(ctx, INPUT);
    await expectScreen(ctx.screen, "EnabledKeyboardIsHidden");
  });

  test("should disable module", async (ctx) => {
    await ctx.screen.getByTestId("toggle_button").tap();
  });

  test("should have expected state when disabled and keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap();
    await expectScreen(ctx.screen, "DisabledKeyboardIsShown");
  });

  test("should have expected state when disabled and keyboard is closed", async (ctx) => {
    await closeKeyboard(ctx, INPUT);
    await expectScreen(ctx.screen, "DisabledKeyboardIsHidden");
  });
});
