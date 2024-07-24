import { expectBitmapsToBeEqual } from "./asserts";
import {
  scrollDownUntilElementIsVisible,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Modal integration", () => {
  it("should navigate to modal screen", async () => {
    await scrollDownUntilElementIsVisible("main_scroll_view", "modal");
    await waitAndTap("modal");
    await waitForElementById("show_button");
  });

  it("should open modal", async () => {
    await waitAndTap("show_button");
    await waitForElementById("close_button");
  });

  it("should open keyboard", async () => {
    await element(by.id("keyboard_animation_text_input")).atIndex(0).tap();
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ModalKeyboardOpened");
    });
  });

  it("should close modal", async () => {
    await waitAndTap("close_button");
  });

  it("should close keyboard automatically", async () => {
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ModalKeyboardClosed");
    });
  });
});
