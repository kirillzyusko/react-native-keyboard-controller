// Ported from kit/012-close-keyboard.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import { expectScreen, openExample, test } from "./support/kit";

describe(
  "`KeyboardController.dismiss()` specification",
  { serial: true },
  () => {
    test("should navigate to `CloseKeyboard` screen", async (ctx) => {
      await openExample(ctx, "close");
    });

    test("should show keyboard", async (ctx) => {
      await ctx.screen.getByTestId("input").tap();
      await expectScreen(ctx.screen, "CloseKeyboardOpened");
    });

    test("should dismiss keyboard loosing focus", async (ctx) => {
      await ctx.screen.getByTestId("close_keyboard_button").tap();
      await expect(ctx.screen.getByTestId("input")).not.toBeFocused();
    });

    test("should show keyboard again when input tapped", async (ctx) => {
      await ctx.screen.getByTestId("input").tap();
      await expectScreen(ctx.screen, "CloseKeyboardOpened");
    });

    test("should dismiss keyboard keeping focus", async (ctx) => {
      await ctx.screen.getByTestId("keep_focus_button").tap();
      await ctx.screen.getByTestId("close_keyboard_button").tap();
      await expect(ctx.screen.getByTestId("input")).toBeFocused();
    });

    test("should show keyboard again when input with focus tapped", async (ctx) => {
      await ctx.screen.getByTestId("input").tap();
      await expectScreen(ctx.screen, "CloseKeyboardOpenedKeepingFocus");
    });

    test("should dismiss keyboard", async (ctx) => {
      await ctx.screen.getByTestId("close_keyboard_button").tap();
      await expect(ctx.screen.getByTestId("input")).toBeFocused();
    });

    test("should show keyboard when `KeyboardController.setFocusTo('current')` is called", async (ctx) => {
      await ctx.screen.getByTestId("set_focus_to_current").tap();
      await expectScreen(ctx.screen, "CloseKeyboardOpenedKeepingFocus");
    });

    test("should dismiss keyboard and blur input if `.blur()` is called", async (ctx) => {
      await ctx.screen.getByTestId("blur_from_ref").tap();
      await expect(ctx.screen.getByTestId("input")).not.toBeFocused();
    });

    test("should reveal a keyboard", async (ctx) => {
      await ctx.screen.getByTestId("keep_focus_button").tap();
      await ctx.screen.getByTestId("input").tap();
      await expectScreen(ctx.screen, "CloseKeyboardOpened");
    });

    test("should close keyboard immediately", async (ctx) => {
      await ctx.screen.getByTestId("animated_button").tap();
      await ctx.screen.getByTestId("close_keyboard_button").tap();
      await expect(ctx.screen.getByTestId("input")).not.toBeFocused();
      await expectScreen(ctx.screen, "CloseKeyboardClosed");
    });
  },
);
