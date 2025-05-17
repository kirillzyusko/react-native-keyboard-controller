import { waitAndTap } from "./helpers";

describe("`KeyboardExtender` specification", () => {
  it("should navigate to `Keyboard Extender` screen", async () => {
    await waitAndTap("keyboard_extender");
  });
});
