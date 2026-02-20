import {
  clampedScrollTarget,
  computeIOSContentOffset,
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
});
