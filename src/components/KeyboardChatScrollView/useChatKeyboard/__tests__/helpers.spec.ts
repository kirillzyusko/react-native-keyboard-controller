jest.mock("react-native-reanimated", () => ({
  ...require("react-native-reanimated/mock"),
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  interpolate: require("../__fixtures__/testUtils").mockInterpolate,
}));

import {
  clampedScrollTarget,
  computeIOSContentOffset,
  getEffectiveHeight,
  getMinimumPaddingAbsorbed,
  getScrollEffective,
  isScrollAtEnd,
  shouldShiftContent,
} from "../helpers";

describe("`isScrollAtEnd` specification", () => {
  it("should return true when scrolled exactly to end", () => {
    expect(isScrollAtEnd(200, 800, 1000)).toBe(true);
  });

  it("should return true when within threshold of end", () => {
    // 190 + 800 = 990 >= 1000 - 20 = 980
    expect(isScrollAtEnd(190, 800, 1000)).toBe(true);
  });

  it("should return false when far from end", () => {
    // 100 + 800 = 900 < 1000 - 20 = 980
    expect(isScrollAtEnd(100, 800, 1000)).toBe(false);
  });

  it("should return true when content is smaller than layout", () => {
    expect(isScrollAtEnd(0, 800, 400)).toBe(true);
  });

  it("should return true when at scroll position 0 with matching content", () => {
    expect(isScrollAtEnd(0, 800, 800)).toBe(true);
  });

  describe("inverted", () => {
    it("should return true when scroll offset is 0 (latest messages)", () => {
      expect(isScrollAtEnd(0, 800, 2000, true)).toBe(true);
    });

    it("should return true when within threshold of 0", () => {
      expect(isScrollAtEnd(15, 800, 2000, true)).toBe(true);
    });

    it("should return false when scrolled away from latest messages", () => {
      expect(isScrollAtEnd(100, 800, 2000, true)).toBe(false);
    });

    it("should return true for negative offsets (keyboard inset)", () => {
      expect(isScrollAtEnd(-300, 800, 2000, true)).toBe(true);
    });

    it("should return false at traditional scroll end (oldest messages)", () => {
      // offset 1200 = contentHeight(2000) - layoutHeight(800) → oldest messages
      expect(isScrollAtEnd(1200, 800, 2000, true)).toBe(false);
    });
  });
});

describe("`shouldShiftContent` specification", () => {
  it("should always return true for `always` behavior", () => {
    expect(shouldShiftContent("always", false)).toBe(true);
    expect(shouldShiftContent("always", true)).toBe(true);
  });

  it("should always return false for `never` behavior", () => {
    expect(shouldShiftContent("never", false)).toBe(false);
    expect(shouldShiftContent("never", true)).toBe(false);
  });

  it("should return `isAtEnd` for `whenAtEnd` behavior", () => {
    expect(shouldShiftContent("whenAtEnd", true)).toBe(true);
    expect(shouldShiftContent("whenAtEnd", false)).toBe(false);
  });

  it("should always return true for `persistent` behavior", () => {
    expect(shouldShiftContent("persistent", false)).toBe(true);
    expect(shouldShiftContent("persistent", true)).toBe(true);
  });
});

describe("`clampedScrollTarget` specification", () => {
  it("should add keyboard height to scroll offset", () => {
    expect(clampedScrollTarget(100, 300, 1000, 800)).toBe(400);
  });

  it("should clamp to 0 when offset is negative", () => {
    expect(clampedScrollTarget(-500, 300, 1000, 800)).toBe(0);
  });

  it("should clamp to maxScroll when target exceeds content", () => {
    // maxScroll = 1000 - 800 + 300 = 500
    // target = 400 + 300 = 700 > 500
    expect(clampedScrollTarget(400, 300, 1000, 800)).toBe(500);
  });

  it("should handle single-message case (content smaller than layout)", () => {
    // maxScroll = max(200 - 800 + 300, 0) = max(-300, 0) = 0
    expect(clampedScrollTarget(0, 300, 200, 800)).toBe(0);
  });

  it("should return 0 when keyboard height is 0 and scroll is at top", () => {
    expect(clampedScrollTarget(0, 0, 1000, 800)).toBe(0);
  });
});

describe("`getEffectiveHeight` specification", () => {
  it("should return height as-is when offset is 0", () => {
    expect(getEffectiveHeight(300, 300, 0)).toBe(300);
    expect(getEffectiveHeight(150, 300, 0)).toBe(150);
  });

  it("should return height as-is when targetKeyboardHeight is 0", () => {
    expect(getEffectiveHeight(0, 0, 50)).toBe(0);
  });

  it("should subtract offset proportionally at full keyboard height", () => {
    // interpolate(300, [0, 300], [0, 250]) = 250
    expect(getEffectiveHeight(300, 300, 50)).toBe(250);
  });

  it("should interpolate proportionally at intermediate heights", () => {
    // interpolate(150, [0, 300], [0, 250]) = 125
    expect(getEffectiveHeight(150, 300, 50)).toBe(125);
  });

  it("should return 0 when height is 0", () => {
    expect(getEffectiveHeight(0, 300, 50)).toBe(0);
  });

  it("should clamp effective target to 0 when offset exceeds keyboard height", () => {
    // interpolate(300, [0, 300], [0, max(300 - 400, 0)]) = interpolate(300, [0, 300], [0, 0]) = 0
    expect(getEffectiveHeight(300, 300, 400)).toBe(0);
  });
});

describe("`computeIOSContentOffset` specification", () => {
  describe("non-inverted", () => {
    it("should add keyboard height to relative scroll", () => {
      expect(computeIOSContentOffset(100, 300, 1000, 800, false)).toBe(400);
    });

    it("should clamp to 0 when result would be negative", () => {
      expect(computeIOSContentOffset(-500, 300, 1000, 800, false)).toBe(0);
    });

    it("should clamp to maxScroll when target exceeds content", () => {
      // maxScroll = 1000 - 800 + 300 = 500
      expect(computeIOSContentOffset(400, 300, 1000, 800, false)).toBe(500);
    });

    it("should handle single-message case (content smaller than layout)", () => {
      // maxScroll = max(200 - 800 + 300, 0) = 0
      expect(computeIOSContentOffset(0, 300, 200, 800, false)).toBe(0);
    });
  });

  describe("inverted", () => {
    it("should subtract keyboard height from relative scroll", () => {
      expect(computeIOSContentOffset(500, 300, 1000, 800, true)).toBe(200);
    });

    it("should allow negative values for inverted lists", () => {
      expect(computeIOSContentOffset(100, 300, 1000, 800, true)).toBe(-200);
    });

    it("should return negative keyboard height when scroll is at 0", () => {
      expect(computeIOSContentOffset(0, 300, 1000, 800, true)).toBe(-300);
    });

    it("should clamp to maxScroll when relativeScroll exceeds content", () => {
      // relativeScroll=1500, keyboardHeight=0 → 1500 exceeds maxScroll=200
      expect(computeIOSContentOffset(1500, 0, 1000, 800, true)).toBe(200);
    });

    it("should clamp to -keyboardHeight at minimum", () => {
      // relativeScroll=-500, keyboardHeight=300 → -500-300=-800, clamped to -300
      expect(computeIOSContentOffset(-500, 300, 1000, 800, true)).toBe(-300);
    });

    it("should handle single-message case (content smaller than layout)", () => {
      // maxScroll = max(200 - 800, 0) = 0
      // relativeScroll=100, keyboardHeight=300 → 100-300=-200, clamped to -300 min, but -200 > -300
      // max(min(-200, 0), -300) = max(-200, -300) = -200
      expect(computeIOSContentOffset(100, 300, 200, 800, true)).toBe(-200);
    });
  });

  describe("with extraContentPadding (via totalPaddingForMaxScroll)", () => {
    // The 6th parameter is totalPaddingForMaxScroll which replaces keyboardHeight
    // in the clamping logic. When extraContentPadding=50 and keyboard=300,
    // the caller computes totalPaddingForMaxScroll = 300 + 50 = 350.

    describe("non-inverted", () => {
      it("should not clamp a scroll position that is valid within the extended range", () => {
        // The key regression: scroll pushed to 1550 by extraContentPadding=50
        // relativeScroll = 1550 - 300 = 1250
        // totalPaddingForMaxScroll = 300 + 50 = 350
        // maxScroll = 2000 - 800 + 350 = 1550 → result = 1550 (correct)
        expect(computeIOSContentOffset(1250, 300, 2000, 800, false, 350)).toBe(
          1550,
        );
      });

      it("should not affect result when scroll is below maxScroll", () => {
        // 300 + 100 = 400, still below maxScroll of 1550
        expect(computeIOSContentOffset(100, 300, 2000, 800, false, 350)).toBe(
          400,
        );
      });

      it("should clamp to the extended maxScroll", () => {
        // totalPaddingForMaxScroll = 350 (keyboard=300 + extraContentPadding=50)
        // maxScroll = 1000 - 800 + 350 = 550; 300 + 400 = 700 → clamped to 550
        expect(computeIOSContentOffset(400, 300, 1000, 800, false, 350)).toBe(
          550,
        );
      });
    });

    describe("inverted", () => {
      it("should extend the minimum bound by extraContentPadding", () => {
        // totalPaddingForMaxScroll = 350 (keyboard=300 + extraContentPadding=50)
        // relativeScroll=-100 → min(-100-300, maxScroll)=-400, clamped to -350
        expect(computeIOSContentOffset(-100, 300, 1000, 800, true, 350)).toBe(
          -350,
        );
      });

      it("should clamp to extended minimum when relativeScroll is very negative", () => {
        // totalPaddingForMaxScroll = 350 (keyboard=300 + extraContentPadding=50)
        // relativeScroll=-500, keyboard=300 → -500-300=-800, clamped to -350
        expect(computeIOSContentOffset(-500, 300, 1000, 800, true, 350)).toBe(
          -350,
        );
      });
    });
  });

  describe("with totalPaddingForMaxScroll", () => {
    it("should use totalPaddingForMaxScroll for maxScroll (non-inverted)", () => {
      // scrollEff=100, totalPaddingForMaxScroll=500
      // maxScroll = 1000 - 800 + 500 = 700
      // target = min(max(100 + 100, 0), 700) = 200
      expect(computeIOSContentOffset(100, 100, 1000, 800, false, 500)).toBe(
        200,
      );
    });

    it("should use totalPaddingForMaxScroll for min clamp (inverted)", () => {
      // relativeScroll=0, keyboardHeight=200, totalPaddingForMaxScroll=500
      // result = max(min(0-200, 1200), -500) = max(-200, -500) = -200
      expect(computeIOSContentOffset(0, 200, 2000, 800, true, 500)).toBe(-200);
    });

    it("should clamp to -totalPaddingForMaxScroll (inverted)", () => {
      // relativeScroll=-600, keyboardHeight=200, totalPaddingForMaxScroll=500
      // result = max(min(-600-200, 1200), -500) = max(-800, -500) = -500
      expect(computeIOSContentOffset(-600, 200, 2000, 800, true, 500)).toBe(
        -500,
      );
    });

    it("should fall back to keyboardHeight when undefined", () => {
      expect(computeIOSContentOffset(100, 300, 1000, 800, false)).toBe(
        computeIOSContentOffset(100, 300, 1000, 800, false, undefined),
      );
    });
  });
});

describe("`getMinimumPaddingAbsorbed` specification", () => {
  it("should return 0 when blankSpace is 0", () => {
    expect(getMinimumPaddingAbsorbed(0, 0)).toBe(0);
    expect(getMinimumPaddingAbsorbed(0, 20)).toBe(0);
  });

  it("should return blankSpace minus extraContentPadding", () => {
    expect(getMinimumPaddingAbsorbed(500, 20)).toBe(480);
  });

  it("should return full blankSpace when extraContentPadding is 0", () => {
    expect(getMinimumPaddingAbsorbed(500, 0)).toBe(500);
  });

  it("should return 0 when extraContentPadding exceeds blankSpace", () => {
    expect(getMinimumPaddingAbsorbed(100, 200)).toBe(0);
  });

  it("should return 0 when they are equal", () => {
    expect(getMinimumPaddingAbsorbed(100, 100)).toBe(0);
  });
});

describe("`getScrollEffective` specification", () => {
  it("should return rawEffective when minimumPaddingAbsorbed is 0", () => {
    expect(getScrollEffective(300, 0)).toBe(300);
  });

  it("should subtract minimumPaddingAbsorbed from rawEffective", () => {
    expect(getScrollEffective(300, 200)).toBe(100);
  });

  it("should return 0 when minimumPaddingAbsorbed equals rawEffective", () => {
    expect(getScrollEffective(300, 300)).toBe(0);
  });

  it("should return 0 when minimumPaddingAbsorbed exceeds rawEffective", () => {
    expect(getScrollEffective(300, 500)).toBe(0);
  });

  it("should return 0 when rawEffective is 0", () => {
    expect(getScrollEffective(0, 0)).toBe(0);
    expect(getScrollEffective(0, 100)).toBe(0);
  });
});

describe("`clampedScrollTarget` with totalPaddingForMaxScroll", () => {
  it("should use totalPaddingForMaxScroll for maxScroll when provided", () => {
    // scrollEff=100, totalPaddingForMaxScroll=500
    // maxScroll = 1000 - 800 + 500 = 700
    // target = min(max(100 + 100, 0), 700) = 200
    expect(clampedScrollTarget(100, 100, 1000, 800, 500)).toBe(200);
  });

  it("should allow larger maxScroll with bigger totalPaddingForMaxScroll", () => {
    // Without: maxScroll = 1000 - 800 + 100 = 300, target = min(400+100, 300) = 300
    expect(clampedScrollTarget(400, 100, 1000, 800)).toBe(300);
    // With: maxScroll = 1000 - 800 + 500 = 700, target = min(400+100, 700) = 500
    expect(clampedScrollTarget(400, 100, 1000, 800, 500)).toBe(500);
  });

  it("should fall back to keyboardHeight when undefined", () => {
    expect(clampedScrollTarget(100, 300, 1000, 800)).toBe(
      clampedScrollTarget(100, 300, 1000, 800, undefined),
    );
  });
});
