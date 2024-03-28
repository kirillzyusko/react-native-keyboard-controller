import { expectBitmapsToBeEqual } from "./asserts";
import {
  tap,
  typeText,
  waitAndReplace,
  waitAndTap,
  waitAndType,
  waitForExpect,
} from "./helpers";
import setDemoMode from "./utils/setDemoMode";

const DATE_AND_TIME = 0.75;
const BLINKING_CURSOR = 0.35;
const ACCEPTABLE_DIFF =
  // on iOS there is currently bug - we can not set default date and time, but it's fixed in XCode 15.3
  // but it's not available on GH yet, so we use this workaround
  BLINKING_CURSOR + (device.getPlatform() === "ios" ? DATE_AND_TIME : 0);

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
        ACCEPTABLE_DIFF,
      );
    });
  });

  it("should detect TextInput growth", async () => {
    await waitAndType("TextInput#3", "\n\n\n\n\n");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewFirstInputGrown",
        ACCEPTABLE_DIFF,
      );
    });
  });

  it("should auto-scroll when new input gets focused", async () => {
    await waitAndReplace("TextInput#3", "\n\n");
    await waitAndTap("TextInput#4");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewInputChanged",
        ACCEPTABLE_DIFF,
      );
    });
  });

  it("should auto-scroll when user types a text", async () => {
    await element(by.id("aware_scroll_view_container")).scroll(80, "up");
    await typeText("TextInput#4", "1");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewTextChanged",
        ACCEPTABLE_DIFF,
      );
    });
  });

  it("should scroll back when keyboard dismissed", async () => {
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewKeyboardClosed",
        ACCEPTABLE_DIFF,
      );
    });
  });

  it("shouldn't scroll back when keyboard dismissed if such behavior intentionally disabled", async () => {
    await waitAndTap("open_bottom_sheet_modal");
    await waitAndTap("bottom_sheet_toggle_back_scroll");
    await waitAndTap("bottom_sheet_close_modal");
    await waitAndTap("TextInput#5");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewSecondInputFocused",
        ACCEPTABLE_DIFF,
      );
    });
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewKeyboardClosedWithoutBackScroll",
        ACCEPTABLE_DIFF,
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
        ACCEPTABLE_DIFF,
      );
    });
    await closeKeyboard();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual(
        "AwareScrollViewDisabledStateKeyboardClosed",
        ACCEPTABLE_DIFF,
      );
    });
  });
});
