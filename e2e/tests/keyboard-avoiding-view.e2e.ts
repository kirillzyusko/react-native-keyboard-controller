// Ported from kit/007-keyboard-avoiding-view.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  expectScreen,
  openExample,
  test,
  typeText,
} from "./support/kit";

const USERNAME = "keyboard_avoiding_view.username";

describe("`KeyboardAvoidingView` specification", { serial: true }, () => {
  test("should navigate to `KeyboardAvoidingView` screen", async (ctx) => {
    await openExample(ctx, "keyboard_avoiding_view");
    await expect(
      ctx.screen.getByTestId("keyboard_avoiding_view.container"),
    ).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have expected UI when keyboard closed - package/padding", async (ctx) => {
    // 0.25 because on iOS Home indicator sometimes may have different colors per different runs
    await expectScreen(ctx.screen, "AvoidingViewPackagePaddingInitial", 0.27);
  });

  test("should have expected UI when keyboard opened - package/padding", async (ctx) => {
    await ctx.screen.getByTestId(USERNAME).tap();
    await expectScreen(ctx.screen, "AvoidingViewPackagePaddingOpened");
  });

  test("should have expected UI when keyboard gets closed - package/padding", async (ctx) => {
    await typeText(ctx, USERNAME, "\n");
    await expectScreen(ctx.screen, "AvoidingViewPackagePaddingClosed");
  });

  test("should toggle implementation - RN/padding", async (ctx) => {
    await ctx.screen.getByTestId("keyboard_avoiding_view.implementation").tap();
  });

  test("should have expected UI when keyboard closed - RN/padding", async (ctx) => {
    await expectScreen(ctx.screen, "AvoidingViewRNPaddingInitial");
  });

  test("should have expected UI when keyboard opened - RN/padding", async (ctx) => {
    await ctx.screen.getByTestId(USERNAME).tap();
    await expectScreen(ctx.screen, "AvoidingViewRNPaddingOpened");
  });

  test("should have expected UI when keyboard gets closed - RN/padding", async (ctx) => {
    await typeText(ctx, USERNAME, "\n");
    await expectScreen(ctx.screen, "AvoidingViewRNPaddingClosed");
  });
});
