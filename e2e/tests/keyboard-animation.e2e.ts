// Ported from kit/001-keyboard-animation.e2e.ts
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

// Serial: the Detox tests share one screen and run in order, as here.
describe("Simple keyboard animation", { serial: true }, () => {
  test("should navigate to `Animated transition` screen", async (ctx) => {
    await openExample(ctx, "animated_transition");
    await expect(ctx.screen.getByTestId(INPUT)).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should have expected state when keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap();
    await expectScreen(ctx.screen, "KeyboardAnimationKeyboardIsShown");
  });

  test("should have expected state when emoji keyboard is opened", async (ctx) => {
    await switchToEmojiKeyboard(ctx);
    await expectScreen(ctx.screen, "KeyboardAnimationEmojiKeyboard");
  });

  test("should have expected state when keyboard is closed", async (ctx) => {
    await closeKeyboard(ctx, INPUT);
    await expectScreen(ctx.screen, "KeyboardAnimationKeyboardIsHidden");
  });
});
