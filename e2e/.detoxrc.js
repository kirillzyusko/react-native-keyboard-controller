/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "kit/jest.config.js",
    },
    jest: {
      setupTimeout: 240000,
    },
  },
  apps: {
    "example.ios.debug": {
      type: "ios.app",
      binaryPath:
        "../example/ios/build/Build/Products/Debug-iphonesimulator/KeyboardControllerExample.app",
      build:
        "xcodebuild CC=clang CPLUSPLUS=clang++ LD=clang LDPLUSPLUS=clang++ -workspace ../example/ios/KeyboardControllerExample.xcworkspace -scheme KeyboardControllerExample -configuration Debug -sdk iphonesimulator -derivedDataPath ../example/ios/build",
    },
    "example.ios.release": {
      type: "ios.app",
      binaryPath:
        "../example/ios/build/Build/Products/Release-iphonesimulator/KeyboardControllerExample.app",
      build:
        "xcodebuild CC=clang CPLUSPLUS=clang++ LD=clang LDPLUSPLUS=clang++ -workspace ../example/ios/KeyboardControllerExample.xcworkspace -scheme KeyboardControllerExample -configuration Release -sdk iphonesimulator -derivedDataPath ../example/ios/build",
    },
    "example.android.debug": {
      type: "android.apk",
      binaryPath:
        "../example/android/app/build/outputs/apk/debug/app-debug.apk",
      build:
        "cd ../example/android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug --build-cache",
      reversePorts: [8081],
    },
    "example.android.release": {
      type: "android.apk",
      binaryPath:
        "../example/android/app/build/outputs/apk/release/app-release.apk",
      build:
        "cd ../example/android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release --build-cache",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: {
        type: "iPhone 14 Pro",
      },
    },
    attached: {
      type: "android.attached",
      device: {
        adbName: ".*",
      },
    },
    emulator: {
      type: "android.emulator",
      device: {
        avdName: "e2e_emulator",
      },
      utilBinaryPaths: ["apks/test-butler-app-2.2.1.apk"],
    },
  },
  configurations: {
    "example.ios.sim.debug": {
      device: "simulator",
      app: "example.ios.debug",
    },
    "example.ios.sim.release": {
      device: "simulator",
      app: "example.ios.release",
    },
    "example.android.att.debug": {
      device: "attached",
      app: "example.android.debug",
    },
    "example.android.att.release": {
      device: "attached",
      app: "example.android.release",
    },
    "example.android.emu.debug": {
      device: "emulator",
      app: "example.android.debug",
    },
    "example.android.emu.release": {
      device: "emulator",
      app: "example.android.release",
    },
  },
};
