import {
  createRender,
  mockScrollTo,
  reactionEffect,
  sv,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — edge cases", () => {
  it("should not scrollTo when delta is 0", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 20);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not scrollTo on first render (previous is null)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, null);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should not scrollTo when freeze is true", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(1200),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: true,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should clamp to maxScroll (non-inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(50),
      keyboardPadding: sv(300),
      scroll: sv(1490),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // delta = 50, scroll + delta = 1540, maxScroll = 2000 - 800 + 300 + 50 = 1550
    reactionEffect(50, 0);

    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.anything(),
      0,
      1540,
      false,
    );
  });

  it("should clamp to -totalPadding (inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(50),
      keyboardPadding: sv(300),
      scroll: sv(-280),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // delta = 50, target = -280 - 50 = -330, clamp to -350
    reactionEffect(50, 0);

    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.anything(),
      0,
      -330,
      false,
    );
  });
});
