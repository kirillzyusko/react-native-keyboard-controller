import { setupAnimatedPadding as setup } from "../__fixtures__/animatedPadding";

describe("useExtraContentPadding — same animation continues from where we scrolled", () => {
  it("should scroll the full distance while `scroll` is not updated yet", () => {
    // #1540: before the fix only the last frame (22 - 19 = 3px) was applied
    const { frame, startAnimation, contentOffsetY } = setup({ scroll: 100 });

    startAnimation();
    frame(4);
    frame(9);
    frame(14);
    frame(19);
    frame(22);

    expect(contentOffsetY.value).toBe(122);
  });

  it("should scroll the full distance for inverted list", () => {
    const { frame, startAnimation, contentOffsetY } = setup({
      scroll: -100,
      keyboardPadding: 300,
      inverted: true,
    });

    startAnimation();
    frame(4);
    frame(9);
    frame(14);
    frame(19);
    frame(22);

    expect(contentOffsetY.value).toBe(-122);
  });

  it("should come back to the initial position when animation goes back", () => {
    const { frame, startAnimation, scroll, contentOffsetY } = setup({
      scroll: 100,
    });

    startAnimation();
    frame(10);
    frame(20);
    expect(contentOffsetY.value).toBe(120);

    scroll.value = 120;
    startAnimation();
    frame(10);
    frame(0);
    expect(contentOffsetY.value).toBe(100);
  });

  it("should ignore a late scroll event that reports an older position", () => {
    // we asked for 120, then for 140, and only then event says 120
    const { frame, startAnimation, scroll, contentOffsetY } = setup({
      scroll: 100,
    });

    startAnimation();
    frame(20);
    expect(contentOffsetY.value).toBe(120);
    frame(40);
    expect(contentOffsetY.value).toBe(140);

    scroll.value = 120;
    frame(60);

    expect(contentOffsetY.value).toBe(160);
  });

  it("should ignore a scroll event that reports a position in between", () => {
    // numbers from a real device: -325.33 is half way from -317 to -333.67
    const { frame, startAnimation, scroll, contentOffsetY } = setup({
      scroll: -317,
      padding: 1,
      keyboardPadding: 317,
      inverted: true,
      keyboardLiftBehavior: "whenAtEnd",
    });

    startAnimation();
    frame(17.666687);
    expect(contentOffsetY.value).toBeCloseTo(-333.666687);

    scroll.value = -325.333333;
    frame(34.333313);
    expect(contentOffsetY.value).toBeCloseTo(-350.333313);

    frame(51);
    expect(contentOffsetY.value).toBeCloseTo(-367);
  });

  it("should not accumulate an error when iOS rounds scroll events to 1/3px", () => {
    // sequence from iOS simulator logs: events arrive every second frame
    // and report our own scroll rounded to the screen pixel
    const { frame, startAnimation, scroll, contentOffsetY } = setup({
      scroll: 1092.333333,
      padding: 1,
    });

    startAnimation();
    frame(1.2);
    frame(1.69);
    scroll.value = 1093;
    frame(3.97);
    frame(6.62);
    scroll.value = 1098;
    frame(8.59);
    frame(10.73);
    scroll.value = 1102;
    frame(17.67);

    // exactly start position + padding change, without rounding errors
    expect(contentOffsetY.value).toBeCloseTo(1092.333333 + 16.67);
  });

  it("should ignore user scroll in the middle of an animation", () => {
    const { frame, startAnimation, scroll, contentOffsetY } = setup({
      scroll: 100,
    });

    startAnimation();
    frame(10);
    scroll.value = 500;
    frame(20);

    expect(contentOffsetY.value).toBe(120);
  });

  it("should not depend on `finished` flag (Reanimated 3 sets it on every frame)", () => {
    const { frame, startAnimation, padding, scroll, contentOffsetY } = setup({
      scroll: 1180.333333,
      padding: 1,
      keyboardPadding: 317,
    });

    startAnimation();
    frame(17.666687);
    expect(contentOffsetY.value).toBeCloseTo(1197.00002);

    padding._animation!.finished = true;
    // this event describes an older scroll
    scroll.value = 1188.666666;
    frame(34.333313);
    expect(contentOffsetY.value).toBeCloseTo(1213.666646);

    padding._animation!.finished = true;
    frame(51);
    expect(contentOffsetY.value).toBeCloseTo(1230.333333);
  });

  it("should keep position when a frame doesn't change the padding", () => {
    const { frame, startAnimation, scroll, contentOffsetY } = setup({
      scroll: 100,
    });

    startAnimation();
    frame(10);
    frame(10);
    scroll.value = 105;
    frame(20);

    expect(contentOffsetY.value).toBe(120);
  });

  it("should keep clamping at 0 while animation continues", () => {
    // content is shorter than viewport, so there is nothing to scroll
    const { frame, startAnimation, contentOffsetY } = setup({
      scroll: 5,
      padding: 20,
      size: 500,
    });

    startAnimation();
    frame(10);
    expect(contentOffsetY.value).toBe(0);
    frame(0);
    expect(contentOffsetY.value).toBe(0);
  });
});
