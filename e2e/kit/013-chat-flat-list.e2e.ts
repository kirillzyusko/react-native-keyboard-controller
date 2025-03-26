import { expectBitmapsToBeEqual } from "./asserts";
import {
  closeKeyboard,
  waitAndTap,
  waitForElementById,
  waitForExpect,
} from "./helpers";

describe("Chat FlatList specification", () => {
  it("should navigate to `Chat FlatList` screen", async () => {
    await waitAndTap("reanimated_chat_flat_list");
    await waitForElementById("flat-list.container");
  });

  it("should have expected state when keyboard is opened", async () => {
    await waitAndTap("flat-list.input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ChatFlatListKeyboardIsShown");
    });
  });

  it("should scroll to top and show all messages", async () => {
    await element(by.id("flat-list.chat")).swipe("down", "fast", 1, 0.5, 0.3);
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ChatFlatListTopMessages");
    });
  });

  it("should hide keyboard and remain scroll position", async () => {
    await closeKeyboard("flat-list.input");
    await waitForExpect(async () => {
      await expectBitmapsToBeEqual("ChatFlatListKeyboardIsHidden");
    });
  });
});
