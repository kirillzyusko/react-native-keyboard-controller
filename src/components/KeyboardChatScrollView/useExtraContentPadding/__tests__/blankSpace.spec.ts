import { sv } from "../../../../__fixtures__/sv";
import {
  createRender,
  flushRAF,
  mockScrollTo,
  reactionEffect,
} from "../__fixtures__/setup";

describe("useExtraContentPadding — blankSpace floor", () => {
  it("should skip scroll when blankSpace fully absorbs the change", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(0),
      blankSpace: sv(500),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // previousTotal = max(500, 0+0) = 500
    // currentTotal = max(500, 0+20) = 500
    // effectiveDelta = 0 → skip
    reactionEffect(20, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should scroll by effective delta when blankSpace partially absorbs", async () => {
    const render = createRender();

    render({
      extraContentPadding: sv(300),
      keyboardPadding: sv(200),
      blankSpace: sv(400),
      scroll: sv(100),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // previousTotal = max(400, 200+0) = 400
    // currentTotal = max(400, 200+300) = 500
    // effectiveDelta = 100
    // maxScroll = max(2000 - 800 + 500, 0) = 1700
    // target = min(100 + 100, 1700) = 200
    reactionEffect(300, 0);
    await flushRAF();

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, 200, false);
  });

  it("blankSpace=0 produces identical behavior to default", async () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      blankSpace: sv(0),
      scroll: sv(1200),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: false,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // previousTotal = max(0, 300+0) = 300
    // currentTotal = max(0, 300+20) = 320
    // effectiveDelta = 20
    // maxScroll = max(2000 - 800 + 320, 0) = 1520
    // target = min(1200 + 20, 1520) = 1220
    reactionEffect(20, 0);
    await flushRAF();

    expect(mockScrollTo).toHaveBeenCalledWith(
      expect.anything(),
      0,
      1220,
      false,
    );
  });

  it("should use currentTotal for inverted clamp", () => {
    const render = createRender();

    render({
      extraContentPadding: sv(20),
      keyboardPadding: sv(300),
      blankSpace: sv(400),
      scroll: sv(5),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // previousTotal = max(400, 300+0) = 400
    // currentTotal = max(400, 300+20) = 400
    // effectiveDelta = 0 → skip (blankSpace floor absorbs)
    reactionEffect(20, 0);

    expect(mockScrollTo).not.toHaveBeenCalled();
  });

  it("should scroll when change exceeds blankSpace floor (inverted)", async () => {
    const render = createRender();

    render({
      extraContentPadding: sv(200),
      keyboardPadding: sv(300),
      blankSpace: sv(400),
      scroll: sv(5),
      layout: sv({ width: 390, height: 800 }),
      size: sv({ width: 390, height: 2000 }),
      inverted: true,
      keyboardLiftBehavior: "always",
      freeze: false,
    });

    // previousTotal = max(400, 300+0) = 400
    // currentTotal = max(400, 300+200) = 500
    // effectiveDelta = 100
    // target = max(5 - 100, -500) = max(-95, -500) = -95
    reactionEffect(200, 0);
    await flushRAF();

    expect(mockScrollTo).toHaveBeenCalledWith(expect.anything(), 0, -95, false);
  });
});
