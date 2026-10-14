import { sv } from "../../../../__fixtures__/sv";
import { createRender, reactionEffect } from "../__fixtures__/setup";

// A `withTiming` driven `extraContentPadding` produces many reaction frames
// before a single native scroll event lands. Every frame must build on the
// offset the previous frame commanded, otherwise only the last frame's delta
// survives and the list scrolls a fraction of the requested distance.
// see https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1540
const RAMP = [
  [4, 0],
  [9, 4],
  [14, 9],
  [19, 14],
  [22, 19],
] as const;

describe("useExtraContentPadding: animated (multi-frame) padding ramp", () => {
  it("should accumulate every frame of the ramp (inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(0);

    render({
      extraContentPadding: sv(22),
      keyboardPadding: sv(300),
      scroll: sv(0),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // no scroll event lands in between, so `scroll` stays at 0 for all 5 frames
    RAMP.forEach(([current, previous]) => reactionEffect(current, previous));

    expect(contentOffsetY.value).toBe(-22);
  });

  it("should accumulate every frame of the ramp (non-inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(0);

    render({
      extraContentPadding: sv(22),
      keyboardPadding: sv(300),
      scroll: sv(0),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    RAMP.forEach(([current, previous]) => reactionEffect(current, previous));

    expect(contentOffsetY.value).toBe(22);
  });

  it("should unwind symmetrically when the ramp animates back to 0 (inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(0);

    render({
      extraContentPadding: sv(0),
      keyboardPadding: sv(300),
      scroll: sv(0),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    RAMP.forEach(([current, previous]) => reactionEffect(current, previous));
    expect(contentOffsetY.value).toBe(-22);

    // and back down to 0: the shrink ramp must undo exactly what grew
    [...RAMP]
      .reverse()
      .forEach(([current, previous]) => reactionEffect(previous, current));

    expect(contentOffsetY.value).toBe(0);
  });

  it("should rebase on the observed offset when a real scroll event lands", () => {
    const render = createRender();
    const contentOffsetY = sv(0);
    const scroll = sv(0);

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll,
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(10, 0);
    expect(contentOffsetY.value).toBe(-10);

    // the user drags the list, so a native scroll event moves `scroll` somewhere
    // unrelated to what we commanded. The next frame must honour it, exactly as
    // it did before the compounding fix.
    scroll.value = -100;

    reactionEffect(20, 10);
    expect(contentOffsetY.value).toBe(-110);

    // and the next in-flight frame compounds from the new observed base again
    reactionEffect(30, 20);
    expect(contentOffsetY.value).toBe(-120);
  });

  it("should rebase on the observed offset when a real scroll event lands (non-inverted)", () => {
    const render = createRender();
    const contentOffsetY = sv(0);
    const scroll = sv(0);

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      scroll,
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      contentOffsetY,
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    reactionEffect(10, 0);
    expect(contentOffsetY.value).toBe(10);

    scroll.value = 500;

    reactionEffect(20, 10);
    expect(contentOffsetY.value).toBe(510);

    reactionEffect(30, 20);
    expect(contentOffsetY.value).toBe(520);
  });
});
