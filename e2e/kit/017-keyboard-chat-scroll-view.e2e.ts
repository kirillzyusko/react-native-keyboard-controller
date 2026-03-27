import { expect } from "detox";

import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("`KeyboardChatScrollView` specs", () => {
  it("should navigate to `KeyboardChatScrollView` example", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "chat_kit");
    await waitAndTap("chat_kit");
    await waitForElementById("chat.input");
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 2");
  });

  it("should use non-inverted `FlatList`", async () => {
    await waitAndTap("open_bottom_sheet_modal");
    await waitAndTap("bottom_sheet_toggle_flat_list_state");
    await waitAndTap("bottom_sheet_close_modal");
    await element(by.id("chat.scroll")).swipe("up", "fast", 1, 0.5, 0.5);
    // component gets re-mounted
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 1");
  });

  it("should push content up with `always` mode", async () => {
    await waitAndTap("chat.input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardChatScrollViewAlways");
    });
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 1");
  });

  it("should push content down even if you scrolled a little bit", async () => {
    await element(by.id("chat.scroll")).swipe("down", "slow", 0.1, 0.5, 0.3);
    await waitAndTap("layout_passes");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardChatScrollViewAlwaysClosed");
    });
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 1");
  });

  it("should not change position if we reached the top", async () => {
    await element(by.id("chat.scroll")).swipe("down", "fast", 1, 0.5, 0.5);
    await waitAndTap("chat.input");
    await element(by.id("chat.scroll")).swipe("down", "fast", 0.25, 0.5, 0.2);
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 1");
    await waitAndTap("layout_passes");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardChatScrollViewAlwaysClosedAtTop");
    });
  });

  it("should change content position when input grows", () => {});

  it("should work with inverted list", () => {});

  it("should close keyboard interactively", () => {});
});
