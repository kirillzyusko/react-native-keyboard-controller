/* eslint-env node, jest */
const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");

const pixelmatch = require("pixelmatch");
const { PNG } = require("pngjs");

test("process an existing full-resolution screenshot without changing pixels", () => {
  const buffer = fs.readFileSync(
    path.join(
      __dirname,
      "../kit/assets/ios/iPhone 17 Pro/KeyboardAnimationKeyboardIsShown.png",
    ),
  );
  const start = performance.now();
  const expected = PNG.sync.read(buffer);
  const actual = PNG.sync.read(buffer);
  const decoded = performance.now();

  actual.data.fill(128, 0, actual.width * 200 * 4);
  const diff = new PNG({ width: expected.width, height: expected.height });
  const changed = pixelmatch(
    expected.data,
    actual.data,
    diff.data,
    expected.width,
    expected.height,
    { threshold: 0.1 },
  );
  const compared = performance.now();
  const encoded = PNG.sync.write(diff, {
    filterType: Number(process.env.PNG_BENCHMARK_FILTER),
  });
  const packed = performance.now();

  expect(changed).toBeGreaterThan(0);
  expect(PNG.sync.read(encoded).data.equals(diff.data)).toBe(true);

  fs.writeFileSync(
    process.env.PNG_BENCHMARK_REPORT,
    JSON.stringify({
      decodeMs: decoded - start,
      compareMs: compared - decoded,
      encodeMs: packed - compared,
      totalMs: packed - start,
      changed,
    }),
  );
}, 300000);
