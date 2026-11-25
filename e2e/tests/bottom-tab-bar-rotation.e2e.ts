// Ported from kit/010-bottom-tab-bar-rotation.e2e.ts
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

describe("Bottom tab bar", { serial: true }, () => {
  test("should navigate to `Bottom tab bar` screen", async (ctx) => {
    await openExample(ctx, "bottom_tab_bar");
  });

  test("should have expected state in portrait mode", async (ctx) => {
    await expect(ctx.screen.getByTestId(INPUT)).toBeVisible({
      timeout: 15_000,
    });
    await expectScreen(ctx.screen, "BottomTabBarPortrait", 0.25);
  });

  test("should have expected state in landscape mode", async (ctx) => {
    await ctx.device.setOrientation("landscape-left");
    await expectScreen(ctx.screen, "BottomTabBarLandscape");
  });

  test("should have expected state in portrait mode after rotation", async (ctx) => {
    await ctx.device.setOrientation("portrait");
    await expectScreen(ctx.screen, "BottomTabBarPortraitAgain");
  });

  test("should have expected state when keyboard open", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap({ timeout: LONG_TIMEOUT });
    await expectScreen(ctx.screen, "BottomTabBarKeyboardIsShown");
  });

  test("should have expected state when emoji keyboard closed", async (ctx) => {
    await closeKeyboard(ctx, INPUT);
    await expectScreen(ctx.screen, "BottomTabBarKeyboardIsHidden");
  });
});
