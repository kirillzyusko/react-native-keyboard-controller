import { scrollDistanceWithRespectToSnapPoints } from "../utils";

describe("scrollDistanceWithRespectToSnapPoints specification", () => {
  it("should return relative scroll value if `snapPoints` array is not provided", () => {
    expect(scrollDistanceWithRespectToSnapPoints(120, undefined)).toBe(120);
  });

  it("should return relative scroll value if `snapPoints=[]`", () => {
    expect(scrollDistanceWithRespectToSnapPoints(130, [])).toBe(130);
  });

  it("should return relative scroll value if it's bigger than any value in `snapPoints`", () => {
    expect(scrollDistanceWithRespectToSnapPoints(100, [50])).toBe(100);
  });

  it("should return relative scroll value if it's equal to one of `snapPoints`", () => {
    expect(scrollDistanceWithRespectToSnapPoints(150, [50, 150, 200])).toBe(
      150,
    );
  });

  it("should return a value from `snapPoints` if it's bigger than a necessary scroll", () => {
    expect(scrollDistanceWithRespectToSnapPoints(180, [50, 100, 200])).toBe(
      200,
    );
  });
});
