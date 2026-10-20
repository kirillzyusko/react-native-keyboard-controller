import { applyDisplayMask } from "./displayMask";

const bitmap = () => ({
  width: 10,
  height: 10,
  data: Buffer.alloc(400, 255),
});

it("excludes hardware-mask pixels while preserving visible differences", () => {
  const actual = bitmap();
  const expected = bitmap();

  actual.data.fill(0, 0, 4);
  actual.data[4] = 0;

  expect(applyDisplayMask(actual, expected)).toBe(99);
  expect(expected.data.subarray(0, 4)).toEqual(actual.data.subarray(0, 4));
  expect(expected.data[4]).toBe(255);
  expect(actual.data[4]).toBe(0);
});

it("retains all opaque pixels in the comparison", () => {
  const actual = bitmap();
  const expected = bitmap();

  actual.data[0] = 0;
  expect(applyDisplayMask(actual, expected)).toBe(100);
  expect(expected.data[0]).toBe(255);
});

it("rejects a transparent screenshot instead of allowing an empty comparison", () => {
  const actual = bitmap();

  actual.data.fill(0);
  expect(() => applyDisplayMask(actual, bitmap())).toThrow(
    "Unexpected transparency",
  );
});

it("rejects a screenshot from a different device size", () => {
  expect(() => applyDisplayMask(bitmap(), { ...bitmap(), width: 20 })).toThrow(
    "dimensions",
  );
});
