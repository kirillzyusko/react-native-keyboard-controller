import {
  createRender,
  mockScrollTo,
  reactionEffect,
  sv,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — persistent behavior", () => {
  it("should scrollTo on grow", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "persistent",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 120, false);
  });

  it("should NOT scrollTo on shrink when NOT at end", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(0),
      keyboardPadding: sv(300),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "persistent",
      freeze: false,
    });

    reactionEffect(0, 20);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should scrollTo on shrink when at end", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(0),
      keyboardPadding: sv(300),
      scroll: sv(1200),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "persistent",
      freeze: false,
    });

    reactionEffect(0, 20);

    expect(mockScrollTo).toHaveBeenCalled();
  });
});
