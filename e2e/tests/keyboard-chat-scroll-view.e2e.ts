// Ported from kit/017-keyboard-chat-scroll-view.e2e.ts
import { describe } from "@e2e-dev/mobile";
import { expect } from "e2e";

import {
  LONG_TIMEOUT,
  expectScreen,
  openExample,
  replaceText,
  swipeElement,
  test,
  typeText,
} from "./support/kit";

import type { Screen } from "e2e";

const closeKeyboard = async ({ screen }: { screen: Screen }) => {
  await screen.getByTestId("layout_passes").tap({ timeout: LONG_TIMEOUT });
};

describe("`KeyboardChatScrollView` specs", { serial: true }, () => {
  test("should navigate to `KeyboardChatScrollView` example", async (ctx) => {
    await openExample(ctx, "chat_kit");
    await expect(ctx.screen.getByTestId("chat.input")).toBeVisible({
      timeout: LONG_TIMEOUT,
    });
  });

  test("should use non-inverted `FlatList`", async (ctx) => {
    const { screen } = ctx;

    await screen.getByTestId("open_bottom_sheet_modal").tap();
    await screen
      .getByTestId("bottom_sheet_toggle_flat_list_state")
      .tap({ timeout: LONG_TIMEOUT });
    await screen.getByTestId("bottom_sheet_close_modal").tap();
    await swipeElement(ctx, "chat.scroll", "up", "fast", 1, 0.5, 0.5);
    await swipeElement(ctx, "chat.scroll", "up", "fast", 1, 0.5, 0.5);
    await expect(screen.getByTestId("layout_passes")).toHaveText(
      "Layout pass: 1",
    );
  });

  test("should push content up with `always` mode", async (ctx) => {
    await ctx.screen.getByTestId("chat.input").tap();
    await expectScreen(ctx.screen, "KeyboardChatScrollViewAlways");
    await expect(ctx.screen.getByTestId("layout_passes")).toHaveText(
      "Layout pass: 1",
    );
  });

  test("should push content down even if you scrolled a little bit", async (ctx) => {
    await swipeElement(ctx, "chat.scroll", "down", "slow", 0.1, 0.5, 0.3);
    await closeKeyboard(ctx);
    await expectScreen(ctx.screen, "KeyboardChatScrollViewAlwaysClosed");
    await expect(ctx.screen.getByTestId("layout_passes")).toHaveText(
      "Layout pass: 1",
    );
  });

  test("should not change position if we reached the top", async (ctx) => {
    await swipeElement(ctx, "chat.scroll", "down", "fast", 1, 0.5, 0.5);
    await swipeElement(ctx, "chat.scroll", "down", "fast", 1, 0.5, 0.5);
    await ctx.screen.getByTestId("chat.input").tap({ timeout: LONG_TIMEOUT });
    await swipeElement(ctx, "chat.scroll", "down", "fast", 0.2, 0.5, 0.2);
    await swipeElement(ctx, "chat.scroll", "down", "fast", 0.2, 0.5, 0.2);
    await expect(ctx.screen.getByTestId("layout_passes")).toHaveText(
      "Layout pass: 1",
    );
    await closeKeyboard(ctx);
    await expectScreen(ctx.screen, "KeyboardChatScrollViewAlwaysClosedAtTop");
  });

  test("should close keyboard interactively", async (ctx) => {
    await ctx.screen.getByTestId("chat.input").tap({ timeout: LONG_TIMEOUT });
    await swipeElement(ctx, "chat.scroll", "up", "fast", 0.2, 0.5, 0.2);
    await swipeElement(ctx, "chat.scroll", "down", "fast", 0.4, 0.5, 0.2);
    await expectScreen(
      ctx.screen,
      "KeyboardChatScrollViewAlwaysClosedInteractively",
    );
  });

  test("should change content position when input grows", async (ctx) => {
    await ctx.screen.getByTestId("chat.input").tap({ timeout: LONG_TIMEOUT });
    await typeText(ctx, "chat.input", "\n\n\n\n");
    await expectScreen(ctx.screen, "KeyboardChatScrollViewAlwaysInputGrown");
    await replaceText(ctx, "chat.input", "");
  });
});

// Detox: `it.todo` inside the group above. e2e has no todo, and a serial group
// cannot skip one member, so the placeholder sits in its own group.
describe("`KeyboardChatScrollView` specs (todo)", () => {
  test.skip("should work with inverted list", async () => {});
});
