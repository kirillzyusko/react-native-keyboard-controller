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
    "example-fabric.ios.release": {
      type: "ios.app",
      binaryPath:
        "../FabricExample/ios/build/Build/Products/Release-iphonesimulator/KeyboardControllerFabricExample.app",
      build:
        "xcodebuild CC=clang CPLUSPLUS=clang++ LD=clang LDPLUSPLUS=clang++ -workspace ../FabricExample/ios/KeyboardControllerFabricExample.xcworkspace -scheme KeyboardControllerFabricExample -configuration Release -sdk iphonesimulator -derivedDataPath ../FabricExample/ios/build",
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
    simulator15: {
      type: "ios.simulator",
      device: {
        type: "iPhone 13 Pro",
        os: "iOS 15.5",
      },
    },
    simulator16: {
      type: "ios.simulator",
      device: {
        type: "iPhone 14 Pro",
        os: "iOS 16.4",
      },
    },
    simulator17: {
      type: "ios.simulator",
      device: {
        type: "iPhone 15 Pro",
        os: "iOS 17.5",
      },
    },
    simulator18: {
      type: "ios.simulator",
      device: {
        type: "iPhone 16 Pro",
        os: "iOS 18.1",
      },
    },
    attached: {
      type: "android.attached",
      device: {
        adbName: ".*",
      },
    },
    emulator28: {
      type: "android.emulator",
      device: {
        avdName: "e2e_emulator_28",
      },
      utilBinaryPaths: ["apks/test-butler-app-2.2.1.apk"],
    },
    emulator31: {
      type: "android.emulator",
      device: {
        avdName: "e2e_emulator_31",
      },
    },
  },
  configurations: {
    "example.ios.sim-15.debug": {
      device: "simulator15",
      app: "example.ios.debug",
    },
    "example.ios.sim-15.release": {
      device: "simulator15",
      app: "example.ios.release",
    },
    "example.ios.sim-16.debug": {
      device: "simulator16",
      app: "example.ios.debug",
    },
    "example.ios.sim-16.release": {
      device: "simulator16",
      app: "example.ios.release",
    },
    "example.ios.sim-17.debug": {
      device: "simulator17",
      app: "example.ios.debug",
    },
    "example.ios.sim-17.release": {
      device: "simulator17",
      app: "example.ios.release",
    },
    "example-fabric.ios.sim-17.release": {
      device: "simulator17",
      app: "example-fabric.ios.release",
    },
    "example.ios.sim-18.debug": {
      device: "simulator18",
      app: "example.ios.debug",
    },
    "example.ios.sim-18.release": {
      device: "simulator18",
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
    "example.android.emu-28.debug": {
      device: "emulator28",
      app: "example.android.debug",
    },
    "example.android.emu-28.release": {
      device: "emulator28",
      app: "example.android.release",
    },
    "example.android.emu-31.debug": {
      device: "emulator31",
      app: "example.android.debug",
    },
    "example.android.emu-31.release": {
      device: "emulator31",
      app: "example.android.release",
    },
  },
};
