// cspell:words xcrun simctl bootstatus udid
const { execFileSync } = require("child_process");

const udid = process.argv[2];

if (!udid || !/^[A-F0-9-]{36}$/i.test(udid)) {
  throw new Error("Usage: yarn setup:ios-simulator <simulator-udid>");
}

const simctl = (...args) =>
  execFileSync("xcrun", ["simctl", ...args], { stdio: "inherit" });
const preference = (...args) =>
  simctl("spawn", udid, "defaults", "write", "NSGlobalDomain", ...args);
const keyboards = ["en_US@sw=QWERTY;hw=Automatic", "emoji@sw=Emoji"];

simctl("bootstatus", udid, "-b");
preference("AppleKeyboards", "-array", ...keyboards);
preference("ApplePasscodeKeyboards", "-array", ...keyboards);
preference("AppleLanguages", "-array", "en-US");
preference("AppleLocale", "en_US");
preference("AppleICUForce24HourTime", "-bool", "YES");
const keyboardPreference = (...args) =>
  simctl(
    "spawn",
    udid,
    "defaults",
    "write",
    "com.apple.keyboard.preferences",
    ...args,
  );

keyboardPreference("KeyboardLastUsed", keyboards[0]);
// The cache stores the current keyboard followed by the cycling order.
keyboardPreference(
  "KeyboardsCurrentAndNext",
  "-array",
  keyboards[0],
  ...keyboards,
);
keyboardPreference(
  "KeyboardLastUsedForLanguage",
  "-dict",
  "en_US",
  keyboards[0],
  "ASCIICapable",
  keyboards[0],
  "NonASCII",
  keyboards[1],
  "emoji",
  keyboards[1],
);
execFileSync("defaults", [
  "write",
  "com.apple.iphonesimulator",
  "ConnectHardwareKeyboard",
  "-bool",
  "NO",
]);
// SpringBoard and the keyboard service cache these preferences until reboot.
simctl("shutdown", udid);
simctl("bootstatus", udid, "-b");
