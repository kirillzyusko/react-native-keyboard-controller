import waitForExpect from "wait-for-expect";

import { expectBitmapsToBeEqual } from "./asserts";
import {
  tap,
  typeText,
  waitAndReplace,
  waitAndTap,
  waitAndType,
} from "./helpers";
import setDemoMode from "./utils/setDemoMode";

const BLINKING_CURSOR = 0.35;

const closeKeyboard = async () => {
  // tap outside to close a keyboard
  await tap("aware_scroll_view_container", { x: 0, y: 100 });
};

describe("AwareScrollView test cases", () => {
  beforeAll(async () => {
    await setDemoMode();
    await device.launchApp();
  });

  it("should push input above keyboard on focus", async () => {
    await waitAndTap("aware_scroll_view");
    await waitAndTap("TextInput#3");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewFirstInputFocused",
        BLINKING_CURSOR,
      );
    });
  });

  it("should detect TextInput growth", async () => {
    await waitAndType("TextInput#3", "\n\n\n\n\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewFirstInputGrown",
        BLINKING_CURSOR,
      );
    });
  });

  it("should auto-scroll when new input gets focused", async () => {
    await waitAndReplace("TextInput#3", "\n\n");
    await waitAndTap("TextInput#4");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewInputChanged",
        BLINKING_CURSOR,
      );
    });
  });

  it("should auto-scroll when user types a text", async () => {
    await element(by.id("TextInput#4")).swipe("down", "slow", 0.15);
    await typeText("TextInput#4", "1");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewTextChanged",
        BLINKING_CURSOR,
      );
    });
  });

  it("should scroll back when keyboard dismissed", async () => {
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewKeyboardClosed",
        BLINKING_CURSOR,
      );
    });
  });

  it("shouldn't scroll back when keyboard dismissed if such behavior intentionally disabled", async () => {
    await waitAndTap("disable_scroll_on_keyboard_hide");
    await waitAndTap("TextInput#5");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewSecondInputFocused",
        BLINKING_CURSOR,
      );
    });
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewKeyboardClosedWithoutBackScroll",
        BLINKING_CURSOR,
      );
    });
  });
});
