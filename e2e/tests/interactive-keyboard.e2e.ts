// Ported from kit/006-interactive-keyboard.e2e.ts
import { describe } from "@e2e-dev/mobile";

import {
  type Ctx,
  expectScreen,
  openExample,
  swipeElement,
  test,
} from "./support/kit";

const scrollable = (ctx: Ctx) =>
  ctx.platform === "android" ? "chat.gesture" : "chat.scroll";

const safeSwipe = async (callback: () => Promise<void>) => {
  try {
    await callback();
  } catch {
    // ignore exception, will be thrown on Android 9
  }
};

describe("Interactive keyboard interactions", { serial: true }, () => {
  test("should navigate to `Interactive keyboard` screen", async (ctx) => {
    await openExample(ctx, `interactive_keyboard_${ctx.platform}`);

    // scroll to the end of ScrollView to be sure UI is always identical
    await safeSwipe(() =>
      swipeElement(ctx, scrollable(ctx), "up", "fast", 1, 0.5, 0.4),
    );
  });

  test("should have expected state when keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId("chat.input").tap();
    await expectScreen(ctx.screen, "InteractiveKeyboardIsShown");
  });

  test("should have expected state after the gesture", async (ctx) => {
    await safeSwipe(() =>
      swipeElement(ctx, scrollable(ctx), "down", "fast", 1),
    );
    await expectScreen(ctx.screen, "InteractiveKeyboardAfterGestureDown");
  });

  test("should react on the gesture up when keyboard closed", async (ctx) => {
    // show the keyboard on Android 12+
    await safeSwipe(() =>
      swipeElement(ctx, scrollable(ctx), "up", "fast", 1, 0.5, 0.5),
    );
    // scroll to the end of ScrollView to be sure UI is always identical
    await safeSwipe(() =>
      swipeElement(ctx, scrollable(ctx), "up", "fast", 1, 0.5, 0.4),
    );
    await expectScreen(ctx.screen, "InteractiveKeyboardAfterGestureUp");
  });
});
