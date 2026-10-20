import { expect as jestExpect } from "@jest/globals";
import { expect } from "detox";

import { expectBitmapsToBeEqual } from "./asserts";
import {
  Env,
  scrollDownUntilElementIsVisible,
  waitAndReplace,
  waitAndTap,
  waitAndType,
  waitForElementById,
  waitForExpect,
} from "./helpers";

const closeKeyboard = async () => {
  await waitAndTap("layout_passes");
};

const inputTop = async () => {
  const attributes = await element(by.id("chat.input")).getAttributes();

  if (!("frame" in attributes)) {
    throw new Error("Chat input did not expose its screen frame");
  }

  return attributes.frame.y;
};

const expectKeyboardDismissed = async (closedTop: number) => {
  jestExpect(await inputTop()).toBeCloseTo(closedTop, 0);
};

describe("`KeyboardChatScrollView` specs", () => {
  it("should navigate to `KeyboardChatScrollView` example", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "chat_kit");
    await waitAndTap("chat_kit");
    await waitForElementById("chat.input");
  });

  it("should use non-inverted `FlatList`", async () => {
    await waitAndTap("open_bottom_sheet_modal");
    await waitAndTap("bottom_sheet_toggle_flat_list_state");
    await waitAndTap("bottom_sheet_close_modal");
    await element(by.id("chat.scroll")).swipe("up", "fast", 1, 0.5, 0.5);
    await element(by.id("chat.scroll")).swipe("up", "fast", 1, 0.5, 0.5);
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
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "KeyboardChatScrollViewAlwaysClosed",
        device.getPlatform() === "android" ? 0.15 : 0.1,
      );
    });
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 1");
  });

  it("should not change position if we reached the top", async () => {
    await element(by.id("chat.scroll")).swipe("down", "fast", 1, 0.5, 0.5);
    await element(by.id("chat.scroll")).swipe("down", "fast", 1, 0.5, 0.5);
    await waitAndTap("chat.input");
    await element(by.id("chat.scroll")).swipe("down", "fast", 0.2, 0.5, 0.2);
    await element(by.id("chat.scroll")).swipe("down", "fast", 0.2, 0.5, 0.2);
    await expect(element(by.id("layout_passes"))).toHaveText("Layout pass: 1");
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardChatScrollViewAlwaysClosedAtTop");
    });
  });

  it("should close keyboard interactively", async () => {
    const normalizeViewport =
      device.getPlatform() === "android" && Env.softCheck;
    const closedTop = normalizeViewport ? await inputTop() : 0;

    await waitAndTap("chat.input");
    await element(by.id("chat.scroll")).swipe("up", "fast", 0.2, 0.5, 0.2);
    await element(by.id("chat.scroll")).swipe("down", "fast", 0.4, 0.5, 0.2);

    if (normalizeViewport) {
      await waitForExpect(() => expectKeyboardDismissed(closedTop));

      // API 31 fling displacement differs between renderers. Dismissal is
      // verified above; reuse the reviewed top-of-list viewport for the image.
      await element(by.id("chat.scroll")).scrollTo("top");
    }
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "KeyboardChatScrollViewAlwaysClosedInteractively",
      );
    });
  });

  // TODO: this test is flaky on iOS, so temporarily skip it
  it.skip("should change content position when input grows", async () => {
    await waitAndTap("chat.input");
    await waitAndType("chat.input", "\n\n\n\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("KeyboardChatScrollViewAlwaysInputGrown");
    });
    await waitAndReplace("chat.input", "");
  });

  it.todo("should work with inverted list");
});
