import { sv } from "../../../../__fixtures__/sv";
import {
  createRender,
  flushRAF,
  mockScrollTo,
  reactionEffect,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — animated padding", () => {
  it("keeps the initial offset for an inverted list despite delayed scroll events", () => {
    const extraContentPadding = sv(1) as ReturnType<typeof sv<number>> & {
      _animation?: { finished?: boolean } | null;
    };
    const scroll = sv(-317);
    const contentOffsetY = sv(-317);

    extraContentPadding._animation = {};

    createRender()({
      extraContentPadding,
      keyboardPadding: sv(317),
      scroll,
      layout: sv({ width: 390, height: 500 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
      freeze: false,
    });

    reactionEffect(17.666687, 1);
    expect(contentOffsetY.value).toBeCloseTo(-333.666687);

    scroll.value = -325.333333;
    reactionEffect(34.333313, 17.666687);
    expect(contentOffsetY.value).toBeCloseTo(-350.333313);

    extraContentPadding._animation.finished = true;
    reactionEffect(51, 34.333313);
    expect(contentOffsetY.value).toBeCloseTo(-367);
  });

  it("keeps the initial scroll offset while native events lag on iOS", () => {
    const extraContentPadding = sv(1) as ReturnType<typeof sv<number>> & {
      _animation?: { finished?: boolean } | null;
    };
    const scroll = sv(1180.333333);
    const contentOffsetY = sv(1180.333333);

    extraContentPadding._animation = {};

    createRender()({
      extraContentPadding,
      keyboardPadding: sv(317),
      scroll,
      layout: sv({ width: 390, height: 500 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(17.666687, 1);
    expect(contentOffsetY.value).toBeCloseTo(1197.00002);

    // Reanimated 3 can set this flag on every frame, not only at completion.
    extraContentPadding._animation.finished = true;
    // This event describes an older scroll command.
    scroll.value = 1188.666666;
    reactionEffect(34.333313, 17.666687);
    expect(contentOffsetY.value).toBeCloseTo(1213.666646);

    extraContentPadding._animation.finished = true;
    reactionEffect(51, 34.333313);
    expect(contentOffsetY.value).toBeCloseTo(1230.333333);

    // After completion an imperative update follows the live scroll again.
    extraContentPadding._animation = null;
    scroll.value = 1230.333333;
    reactionEffect(52, 51);
    expect(contentOffsetY.value).toBeCloseTo(1231.333333);
  });

  it("uses the same anchor when scrolling through scrollTo", async () => {
    const extraContentPadding = sv(0) as ReturnType<typeof sv<number>> & {
      _animation?: { finished?: boolean } | null;
    };
    const scroll = sv(300);

    extraContentPadding._animation = {};

    createRender()({
      extraContentPadding,
      keyboardPadding: sv(0),
      scroll,
      layout: sv({ width: 390, height: 500 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(10, 0);
    await flushRAF();
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      310,
      false,
    );

    scroll.value = 304;
    reactionEffect(20, 10);
    await flushRAF();
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      320,
      false,
    );

    extraContentPadding._animation.finished = true;
    reactionEffect(30, 20);
    await flushRAF();
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      330,
      false,
    );

    extraContentPadding._animation = null;
    scroll.value = 330;
    reactionEffect(31, 30);
    await flushRAF();
    expect(mockScrollTo).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      331,
      false,
    );
  });
});
