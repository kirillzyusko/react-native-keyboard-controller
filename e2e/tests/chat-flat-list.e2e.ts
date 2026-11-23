// Ported from kit/013-chat-flat-list.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  closeKeyboard,
  expectScreen,
  openHome,
  test,
} from "./support/kit";

describe("Chat FlatList specification", { serial: true }, () => {
  test("should navigate to `Chat FlatList` screen", async (ctx) => {
    await openHome(ctx);
    await ctx.screen
      .getByTestId("reanimated_chat_flat_list")
      .tap({ timeout: LONG_TIMEOUT });
    await expect(ctx.screen.getByTestId("flat-list.container")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("should have expected state when keyboard is opened", async (ctx) => {
    await ctx.screen.getByTestId("flat-list.input").tap();
    await expectScreen(ctx.screen, "ChatFlatListKeyboardIsShown");
  });

  test("should scroll to top and show all messages", async (ctx) => {
    await ctx.screen.getByTestId("flat-list.scrollToTop").tap();
    await expectScreen(ctx.screen, "ChatFlatListTopMessages");
  });

  test("should hide keyboard and remain scroll position", async (ctx) => {
    await closeKeyboard(ctx, "flat-list.input");
    await expectScreen(ctx.screen, "ChatFlatListKeyboardIsHidden");
  });
});
