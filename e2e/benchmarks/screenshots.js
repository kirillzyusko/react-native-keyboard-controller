/* eslint-env node */
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const directory = fs.mkdtempSync(
  path.join(os.tmpdir(), "keyboard-png-benchmark-"),
);
const results = {};

try {
  for (const optimized of [false, true]) {
    const name = optimized ? "optimized" : "original";
    const report = path.join(directory, `${name}.json`);

    execFileSync(
      process.execPath,
      [
        require.resolve("jest/bin/jest"),
        "--runInBand",
        "--config",
        JSON.stringify({
          rootDir: __dirname,
          testMatch: ["**/*.bench.js"],
          testEnvironment: "node",
          watchman: false,
          sandboxInjectedGlobals: optimized ? ["Math"] : [],
        }),
      ],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          PNG_BENCHMARK_FILTER: optimized ? "0" : "-1",
          PNG_BENCHMARK_REPORT: report,
        },
      },
    );
    results[name] = JSON.parse(fs.readFileSync(report, "utf8"));
  }

  if (results.original.changed !== results.optimized.changed) {
    throw new Error("Optimized comparison changed the mismatched pixel count");
  }
  console.log(
    JSON.stringify(
      {
        ...results,
        speedup: results.original.totalMs / results.optimized.totalMs,
      },
      null,
      2,
    ),
  );
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
