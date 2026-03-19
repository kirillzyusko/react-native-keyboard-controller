import { sv } from "../../../../__fixtures__/sv";
import {
  createRender,
  flushRAF,
  mockScrollTo,
  reactionEffect,
  withLegacyArch,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — contentOffsetY (iOS atomic path)", () => {
  it("should set contentOffsetY instead of scrollTo on grow (non-inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(100);

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(contentOffsetY.value).toBe(120);
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should set contentOffsetY instead of scrollTo on grow (inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(5);

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(5),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 0);

    expect(contentOffsetY.value).toBe(-15);
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should set contentOffsetY instead of scrollTo on shrink (non-inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(1220);

    render({
      extraContentPadding: sv(0),
      keyboardPadding: sv(300),
      scroll: sv(1220),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(0, 20);

    expect(contentOffsetY.value).toBe(1200);
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should clamp contentOffsetY to maxScroll (non-inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(1490);

    render({
      extraContentPadding: sv(50),
      keyboardPadding: sv(300),
      scroll: sv(1490),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // delta = 50, scroll + delta = 1540, maxScroll = 2000 - 800 + 300 + 50 = 1550
    reactionEffect(50, 0);

    expect(contentOffsetY.value).toBe(1540);
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should clamp contentOffsetY to -totalPadding (inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(-280);

    render({
      extraContentPadding: sv(50),
      keyboardPadding: sv(300),
      scroll: sv(-280),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // delta = 50, target = -280 - 50 = -330, clamp to -350
    reactionEffect(50, 0);

    expect(contentOffsetY.value).toBe(-330);
    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should fall back to scrollTo when contentOffsetY is undefined", async () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY: undefined,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(20, 0);
    await flushRAF();

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 120, false);
  });
});

describe("useExtraContentPadding — iOS legacy arch (scrollTo path)", () => {
  it("should use scrollTo directly when on legacy arch even if contentOffsetY is provided (non-inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(100);

    withLegacyArch(() => {
      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(300),
        scroll: sv(100),
        layout: sv({ width: 390, height: 800 }),
        size: sv({ width: 390, height: 2000 }),
        contentOffsetY,
        inverted: false,
        keyboardLiftBehavior: "always",
        freeze: false,
      });
    });

    reactionEffect(20, 0);

    expect(contentOffsetY.value).toBe(100);
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 120, false);
  });

  it("should use scrollTo directly when on legacy arch even if contentOffsetY is provided (inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(5);

    withLegacyArch(() => {
      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(300),
        scroll: sv(5),
        layout: sv({ width: 390, height: 800 }),
        size: sv({ width: 390, height: 2000 }),
        contentOffsetY,
        inverted: true,
        keyboardLiftBehavior: "always",
        freeze: false,
      });
    });

    reactionEffect(20, 0);

    expect(contentOffsetY.value).toBe(5);
    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, -15, false);
  });
});
