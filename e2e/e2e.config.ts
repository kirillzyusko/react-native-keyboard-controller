import { mobile } from "@e2e-dev/mobile";

import type { E2EConfig } from "e2e";

const bundleId = "com.example.reactnativekeyboardcontroller";
const ios = {
  bundleId,
  appPath:
    "../example/ios/build/Build/Products/Release-iphonesimulator/KeyboardControllerExample.app",
};
const android = {
  bundleId,
  appPath: "../example/android/app/build/outputs/apk/release/app-release.apk",
};

// One target per device the CI matrix runs (`yarn test-example:<target>`).
// iOS 15 is not a target: agent-device's test runner needs iOS 15.6, and the
// newest iOS 15 simulator is 15.5.
// Stored screenshots are named after the target, so each device keeps its own.
const iosDevices = {
  "ios-16": "iPhone 14 Pro",
  "ios-17": "iPhone 15 Pro",
  "ios-18": "iPhone 16 Pro",
  "ios-26": "iPhone 17 Pro",
  "ios-26e": "iPhone 16e",
};

export default {
  targets: [
    ...Object.entries(iosDevices).map(([name, device]) => ({
      name,
      // E2E_IOS_DEVICE (a simulator UDID) picks one simulator when several
      // share the name.
      engine: mobile({
        platform: "ios",
        device: process.env.E2E_IOS_DEVICE ?? device,
      }),
      app: ios,
    })),
    // Android: the booted emulator (CI boots one AVD per job), or the serial
    // in E2E_ANDROID_DEVICE.
    ...["android-28", "android-31"].map((name) => ({
      name,
      engine: mobile({
        platform: "android",
        device: process.env.E2E_ANDROID_DEVICE,
      }),
      app: android,
    })),
  ],
  // One device per platform at a time.
  workers: 1,
} satisfies E2EConfig;
