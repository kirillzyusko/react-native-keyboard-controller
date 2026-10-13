import { sv } from "../../../../__fixtures__/sv";
import { setupAnimatedPadding as setup } from "../__fixtures__/animatedPadding";
import {
  createRender,
  flushRAF,
  mockScrollTo,
  reactionEffect,
} from "../__fixtures__/setup";

import type { Padding } from "../__fixtures__/animatedPadding";

describe("useExtraContentPadding — when to start from `scroll`", () => {
  describe("new animation: starts from `scroll`", () => {
    it("should keep the position where user scrolled between two animations", () => {
      const { frame, startAnimation, padding, scroll, contentOffsetY } = setup({
        scroll: 100,
      });

      startAnimation();
      frame(10);
      frame(20);
      expect(contentOffsetY.value).toBe(120);

      // Reanimated keeps the finished animation in `_animation`
      padding._animation!.finished = true;
      scroll.value = 60;

      startAnimation();
      frame(30);
      frame(40);

      expect(contentOffsetY.value).toBe(80);
    });

    it("should start from `scroll` when a new animation interrupts the running one", () => {
      const { frame, startAnimation, scroll, contentOffsetY } = setup({
        scroll: 100,
      });

      startAnimation();
      frame(10);
      frame(20);
      expect(contentOffsetY.value).toBe(120);

      scroll.value = 118;
      startAnimation();
      frame(25);

      expect(contentOffsetY.value).toBe(123);
    });
  });

  describe("value set without animation: always uses `scroll`", () => {
    it("should start every change from `scroll`", () => {
      const { frame, setWithoutAnimation, scroll, contentOffsetY } = setup({
        scroll: 100,
      });

      setWithoutAnimation();
      frame(10);
      expect(contentOffsetY.value).toBe(110);

      scroll.value = 60;
      frame(20);

      expect(contentOffsetY.value).toBe(70);
    });

    it("should not reuse the position from a previous animation", () => {
      const {
        frame,
        startAnimation,
        setWithoutAnimation,
        scroll,
        contentOffsetY,
      } = setup({ scroll: 100 });

      startAnimation();
      frame(10);
      frame(20);
      expect(contentOffsetY.value).toBe(120);

      scroll.value = 50;
      setWithoutAnimation();
      frame(30);

      expect(contentOffsetY.value).toBe(60);
    });

    it("should start an animation after a value without animation from `scroll`", () => {
      const {
        frame,
        startAnimation,
        setWithoutAnimation,
        scroll,
        contentOffsetY,
      } = setup({ scroll: 100 });

      setWithoutAnimation();
      frame(10);
      scroll.value = 80;

      startAnimation();
      frame(20);
      expect(contentOffsetY.value).toBe(90);

      // `scroll` is late, but it's the same animation
      frame(30);
      expect(contentOffsetY.value).toBe(100);
    });
  });

  describe("freeze", () => {
    it("should start from `scroll` after freeze, even for the same animation", () => {
      const { frame, startAnimation, freeze, scroll, contentOffsetY } = setup({
        scroll: 100,
      });

      startAnimation();
      frame(10);
      expect(contentOffsetY.value).toBe(110);

      freeze.value = true;
      frame(20);
      expect(contentOffsetY.value).toBe(110);

      freeze.value = false;
      scroll.value = 200;
      frame(30);

      expect(contentOffsetY.value).toBe(210);
    });
  });

  describe("scrollTo path", () => {
    it("should continue from where we scrolled", async () => {
      const padding = sv(0) as Padding;
      const scroll = sv(300);

      padding._animation = {};

      createRender()({
        extraContentPadding: padding,
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

      padding._animation = null;
      scroll.value = 320;
      reactionEffect(21, 20);
      await flushRAF();
      expect(mockScrollTo).toHaveBeenLastCalledWith(
        expect.anything(),
        0,
        321,
        false,
      );
    });
  });
});
