// Ported from kit/015-keyboard-extender.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  expectScreen,
  openExample,
  tapAtCentre,
  test,
} from "./support/kit";

describe("`KeyboardExtender` specification", { serial: true }, () => {
  test("should navigate to `Keyboard Extender` screen", async (ctx) => {
    await openExample(ctx, "keyboard_extender");
    await expect(ctx.screen.getByTestId("donation_amount")).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have `KeyboardExtender` above the keyboard", async (ctx) => {
    await ctx.screen.getByTestId("donation_amount").tap();
    await expectScreen(ctx.screen, "KeyboardExtenderIsAttached");
  });

  test("should have working `Touchable`s inside", async (ctx) => {
    // The extender sits in the keyboard's frame, which agent-device reads as covering it.
    await tapAtCentre(ctx, "donation_20");
    await expect(ctx.screen.getByText("20 dollars")).toBeVisible({
      timeout: 15_000,
    });
    // Detox: tapItemAtIndex("OK") taps the first "OK" (the alert's button).
    await ctx.screen.getByText("OK").first().tap();
    // round corners in the bottom keyboard on iOS 26 when taking second screenshot
    await expectScreen(ctx.screen, "KeyboardExtenderIsAttached", 0.35);
  });

  test("should disappear when disabled", async (ctx) => {
    await ctx.screen.getByTestId("postal_code").tap({ timeout: LONG_TIMEOUT });
    await expectScreen(ctx.screen, "KeyboardExtenderIsDetached");
  });

  test("should appear again when enabled", async (ctx) => {
    await ctx.screen
      .getByTestId("donation_amount")
      .tap({ timeout: LONG_TIMEOUT });
    // round corners in the bottom keyboard on iOS 26 when taking second screenshot
    await expectScreen(ctx.screen, "KeyboardExtenderIsAttached", 0.35);
  });
});
