import { renderHook } from "@testing-library/react-native";
import { useAnimatedRef } from "react-native-reanimated";

import type { useExtraContentPadding } from "..";
import type Reanimated from "react-native-reanimated";

const mockScrollTo = jest.fn();
let reactionEffect: (current: number, previous: number | null) => void;

jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  scrollTo: (...args: unknown[]) => mockScrollTo(...args),
  useAnimatedReaction: (
    producer: () => number,
    effect: (current: number, previous: number | null) => void,
  ) => {
    reactionEffect = effect;
  },
}));

function sv<T>(initial: T): { value: T } {
  return { value: initial };
}

type RenderOptions = Omit<
  Parameters<typeof useExtraContentPadding>[0],
  "scrollViewRef"
>;

function createRender() {
  return function render(options: RenderOptions) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("..") as {
      useExtraContentPadding: typeof useExtraContentPadding;
    };

    return renderHook(() => {
      const ref = useAnimatedRef<Reanimated.ScrollView>();

      mod.useExtraContentPadding({ scrollViewRef: ref, ...options });
    });
  };
}

beforeEach(() => {
  jest.resetModules();
  mockScrollTo.mockClear();
});

describe("useExtraContentPadding", () => {
  describe("always behavior", () => {
    it("should scrollTo on grow when at end (non-inverted)", () => {
      const render = createRender();
      const scroll = sv(1200);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
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
      const scroll = sv(100);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "always",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).toHaveBeenCalledWith(
        expect.anything(),
        0,
        120,
        false,
      );
    });

    it("should scrollTo on shrink (non-inverted)", () => {
      const render = createRender();
      const scroll = sv(1220);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(0),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
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
      const scroll = sv(5);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
        inverted: true,
        keyboardLiftBehavior: "always",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).toHaveBeenCalledWith(
        expect.anything(),
        0,
        -15,
        false,
      );
    });
  });

  describe("whenAtEnd behavior", () => {
    it("should scrollTo when at end (non-inverted)", () => {
      const render = createRender();
      const scroll = sv(1200);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(0),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "whenAtEnd",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).toHaveBeenCalled();
    });

    it("should NOT scrollTo when NOT at end (non-inverted)", () => {
      const render = createRender();
      const scroll = sv(100);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(0),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "whenAtEnd",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it("should scrollTo when at end (inverted)", () => {
      const render = createRender();
      const scroll = sv(5);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(0),
        scroll,
        layout,
        size,
        inverted: true,
        keyboardLiftBehavior: "whenAtEnd",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).toHaveBeenCalled();
    });

    it("should NOT scrollTo when NOT at end (inverted)", () => {
      const render = createRender();
      const scroll = sv(100);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(0),
        scroll,
        layout,
        size,
        inverted: true,
        keyboardLiftBehavior: "whenAtEnd",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).not.toHaveBeenCalled();
    });
  });

  describe("never behavior", () => {
    it("should NOT scrollTo on grow", () => {
      const render = createRender();
      const scroll = sv(1200);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(0),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "never",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).not.toHaveBeenCalled();
    });
  });

  describe("persistent behavior", () => {
    it("should scrollTo on grow", () => {
      const render = createRender();
      const scroll = sv(100);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(20),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "persistent",
        freeze: false,
      });

      reactionEffect(20, 0);

      expect(mockScrollTo).toHaveBeenCalledWith(
        expect.anything(),
        0,
        120,
        false,
      );
    });

    it("should NOT scrollTo on shrink when NOT at end", () => {
      const render = createRender();
      const scroll = sv(100);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(0),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "persistent",
        freeze: false,
      });

      reactionEffect(0, 20);

      expect(mockScrollTo).not.toHaveBeenCalled();
    });

    it("should scrollTo on shrink when at end", () => {
      const render = createRender();
      const scroll = sv(1200);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(0),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
        inverted: false,
        keyboardLiftBehavior: "persistent",
        freeze: false,
      });

      reactionEffect(0, 20);

      expect(mockScrollTo).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
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
      const scroll = sv(1490);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(50),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
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
      const scroll = sv(-280);
      const layout = sv({ width: 390, height: 800 });
      const size = sv({ width: 390, height: 2000 });

      render({
        extraContentPadding: sv(50),
        keyboardPadding: sv(300),
        scroll,
        layout,
        size,
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
});
