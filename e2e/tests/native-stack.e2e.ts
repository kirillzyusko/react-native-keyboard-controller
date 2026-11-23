// Ported from kit/009-native-stack.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  closeKeyboard,
  expectScreen,
  openExample,
  switchToEmojiKeyboard,
  test,
} from "./support/kit";

const INPUT = "keyboard_animation_text_input";

describe("Native stack", { serial: true }, () => {
  test("should navigate to `Native stack` screen", async (ctx) => {
    await openExample(ctx, "native_stack");
    await expect(ctx.screen.getByTestId(INPUT)).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have expected state when keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap();
    await expectScreen(ctx.screen, "NativeStackKeyboardIsShown");
  });

  test("should have expected state when emoji keyboard is opened", async (ctx) => {
    await switchToEmojiKeyboard(ctx);
    await expectScreen(ctx.screen, "NativeStackEmojiKeyboard");
  });

  test("should have expected state when keyboard is closed", async (ctx) => {
    await closeKeyboard(ctx, INPUT);
    await expectScreen(ctx.screen, "NativeStackKeyboardIsHidden");
  });
});
