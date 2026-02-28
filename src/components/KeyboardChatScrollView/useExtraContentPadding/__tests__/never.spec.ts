import {
  createRender,
  mockScrollTo,
  reactionEffect,
  sv,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — never behavior", () => {
  it("should NOT scrollTo on grow", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(1200),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "never",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
