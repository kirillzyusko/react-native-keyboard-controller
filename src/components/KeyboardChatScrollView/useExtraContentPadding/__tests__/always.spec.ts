import {
  createRender,
  mockScrollTo,
  reactionEffect,
  sv,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — always behavior", () => {
  it("should scrollTo on grow when at end (non-inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(1200),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.anything(),
      0,
      1220,
      false,
    );
  });

  it("should scrollTo on grow when NOT at end (non-inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 120, false);
  });

  it("should scrollTo on shrink (non-inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(0),
      keyboardPadding: sv(300),
      scroll: sv(1220),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(0, 20);

    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.anything(),
      0,
      1200,
      false,
    );
  });

  it("should scrollTo on grow (inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(5),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, -15, false);
  });
});
