// Ported from kit/011-over-keyboard-view.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import { expectScreen, openExample, tapAtCentre, test } from "./support/kit";

describe("`OverKeyboardView` specification", { serial: true }, () => {
  test("should navigate to `OverKeyboardView` screen", async (ctx) => {
    await openExample(ctx, "over_keyboard_view");
  });

  test("should have expected state when view is not visible", async (ctx) => {
    await expect(
      ctx.screen.getByTestId("over_keyboard_view.input"),
    ).toBeVisible({ timeout: 15_000 });
    // iOS home indicator may have different color
    await expectScreen(ctx.screen, "OverKeyboardViewNotShown", 0.28);
  });

  test("should be visible when `visible={true}`", async (ctx) => {
    await ctx.screen.getByTestId("over_keyboard_view.show").tap();
    await expectScreen(ctx.screen, "OverKeyboardViewShown");
  });

  test("should have touchable background", async (ctx) => {
    await ctx.screen.getByTestId("over_keyboard_view.background").tap();
    await expectScreen(ctx.screen, "OverKeyboardViewNotShown");
  });

  test("should be displayed overlapping keyboard", async (ctx) => {
    await ctx.screen.getByTestId("over_keyboard_view.input").tap();
    await ctx.screen.getByTestId("over_keyboard_view.show").tap();
    await expectScreen(ctx.screen, "OverKeyboardViewShownWithKeyboard", 0.27);
  });

  test("should have tappable elements", async (ctx) => {
    // OverKeyboardView draws over the keyboard; agent-device refuses a locator
    // tap on anything inside the keyboard's frame.
    await tapAtCentre(ctx, "over_keyboard_view.content");
    await expectScreen(ctx.screen, "OverKeyboardViewHiddenWithKeyboard");
  });
});
