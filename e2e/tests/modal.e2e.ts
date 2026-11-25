// Ported from kit/008-modal.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import { LONG_TIMEOUT, expectScreen, openExample, test } from "./support/kit";

const INPUT = "keyboard_animation_text_input";

describe("Modal integration", { serial: true }, () => {
  test("should navigate to modal screen", async (ctx) => {
    await openExample(ctx, "modal");
    await expect(ctx.screen.getByTestId("show_button")).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should open modal", async (ctx) => {
    await ctx.screen.getByTestId("show_button").tap();
    await expect(ctx.screen.getByTestId("close_button")).toBeVisible({
      timeout: 15_000,
    });
    await expectScreen(ctx.screen, "ModalJustOpened");
  });

  test("should open keyboard", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).first().tap();
    await expectScreen(ctx.screen, "ModalKeyboardOpened");
  });

  test("should close modal", async (ctx) => {
    await ctx.screen.getByTestId("close_button").tap();
  });

  test("should close keyboard automatically", async (ctx) => {
    await expectScreen(ctx.screen, "ModalKeyboardClosed");
  });

  test("should open keyboard without Modal", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).tap({ timeout: LONG_TIMEOUT });
  });

  test("should open modal and close keyboard", async (ctx) => {
    await ctx.screen.getByTestId("show_button").tap();
    await expect(ctx.screen.getByTestId("close_button")).toBeVisible({
      timeout: 15_000,
    });
    await expectScreen(ctx.screen, "ModalJustOpened");
  });

  test("should open keyboard again", async (ctx) => {
    await ctx.screen.getByTestId(INPUT).first().tap();
    await expectScreen(ctx.screen, "ModalKeyboardOpened");
  });

  test("should close modal again", async (ctx) => {
    await ctx.screen.getByTestId("close_button").tap();
  });

  test("should restore initial state before Modal show", async (ctx) => {
    await expectScreen(ctx.screen, "ModalBeforeOpening");
  });
});
