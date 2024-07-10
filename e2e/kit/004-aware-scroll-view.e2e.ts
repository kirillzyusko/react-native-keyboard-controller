import { expectBitmapsToBeEqual } from "./asserts";
import {
  Env,
  tap,
  typeText,
  waitAndReplace,
  waitAndTap,
  waitAndType,
  waitForElementById,
  waitForExpect,
} from "./helpers";

const BLINKING_CURSOR = 0.35;

const closeKeyboard = async () => {
  // tap outside to close a keyboard
  await tap("aware_scroll_view_container", { x: 0, y: 100 });
};

describe("AwareScrollView test cases", () => {
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

    if (Env.softCheck) {
      // on Android (not AOSP) focus and resize events are asynchronous
      // so there can be a case when scrolling for current keyboard size
      // has finished and then keyboard got resized (became smaller) and
      // final distance is bigger than 50px
      // Ideally I'd like to have an assert `.toBeAboveKeyboard(minDistance)`
      // bit it's hard to achieve in detox (hard to get visible rect)
      // so for such asynchronous operations we simply assure that the input is
      // visible and don't check the pixel perfect match
      await waitForElementById("TextInput#4");
    } else {
      await waitForExpect(async () => {
        await expectBitmapsToBeEqual(
          "AwareScrollViewInputChanged",
          BLINKING_CURSOR,
        );
      });
    }
  });

  it("should auto-scroll when user types a text", async () => {
    await element(by.id("aware_scroll_view_container")).scroll(80, "up");
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

    if (Env.softCheck) {
      await waitForElementById("TextInput#2");
      await waitForElementById("TextInput#6");
    } else {
      await waitForExpect(async () => {
        await expectBitmapsToBeEqual(
          "AwareScrollViewKeyboardClosed",
          BLINKING_CURSOR,
        );
      });
    }
  });

  it("shouldn't scroll back when keyboard dismissed if such behavior intentionally disabled", async () => {
    await waitAndTap("open_bottom_sheet_modal");
    await waitAndTap("bottom_sheet_toggle_back_scroll");
    await waitAndTap("bottom_sheet_close_modal");
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

  it("shouldn't auto scroll if `KeyboardAwareScrollView` is disabled", async () => {
    await waitAndTap("open_bottom_sheet_modal");
    await waitAndTap("bottom_sheet_toggle_enabled_state");
    await waitAndTap("bottom_sheet_close_modal");
    await waitAndTap("TextInput#7");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewDisabledStateKeyboardOpened",
        BLINKING_CURSOR,
      );
    });
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewDisabledStateKeyboardClosed",
        BLINKING_CURSOR,
      );
    });
  });
});
