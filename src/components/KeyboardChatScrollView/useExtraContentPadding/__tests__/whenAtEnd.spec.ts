import {
  createRender,
  mockScrollTo,
  reactionEffect,
  sv,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — whenAtEnd behavior", () => {
  it("should scrollTo when at end (non-inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(1200),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("should NOT scrollTo when NOT at end (non-inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "whenAtEnd",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should scrollTo when at end (inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(5),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it("should NOT scrollTo when NOT at end (inverted)", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});
