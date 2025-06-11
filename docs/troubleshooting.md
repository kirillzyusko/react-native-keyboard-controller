# Troubleshooting

This section attempts to outline issues that users frequently encounter when first getting accustomed to using `react-native-keyboard-controller`. These issues may or may not be related to `react-native-keyboard-controller`.

## Incompatible `kotlinVersion` and failed Android builds[​](/react-native-keyboard-controller/docs/troubleshooting.md#incompatible-kotlinversion-and-failed-android-builds "Direct link to incompatible-kotlinversion-and-failed-android-builds")

Sometimes you may see failed Android builds complaining that your version of kotlin is lower than expected version.

`error: module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 1.6.0, expected version is 1.4.1.`

To overcome this issue you will need to set higher version of the kotlin:

### `react-native` or `expo` bare workflow[​](/react-native-keyboard-controller/docs/troubleshooting.md#react-native-or-expo-bare-workflow "Direct link to react-native-or-expo-bare-workflow")

You need to modify `android/build.gradle` and specify correct `kotlinVersion`:

```
buildscript {
    ext {
        kotlinVersion = "1.6.21"
    }
}
```

For more information please, see how it's configured in [example](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/9d0e63712a2f55dab0f6f3f95398567bb9ca1efa/example/android/build.gradle#L9) project.

### `Expo` managed workflow[​](/react-native-keyboard-controller/docs/troubleshooting.md#expo-managed-workflow "Direct link to expo-managed-workflow")

If you are using Expo managed workflow you need to install `expo-build-properties`

```
npx expo install expo-build-properties
```

And add plugin inside of your `app.json` or `app.config.js` with following configuration:

```
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "kotlinVersion": "1.6.21"
          }
        }
      ]
    ]
  }
}
```

## Swift support[​](/react-native-keyboard-controller/docs/troubleshooting.md#swift-support "Direct link to Swift support")

Since part of this library is written using `swift` language - your project needs to support it. For that you can create empty `.swift` file with bridging header. See this [step-by-step](https://stackoverflow.com/a/56176956/9272042) guide if you have problems.

## Animations frame drops[​](/react-native-keyboard-controller/docs/troubleshooting.md#animations-frame-drops "Direct link to Animations frame drops")

Sometimes you may see that animation performance is poor. If you are using `sentry@5` make sure `enableStallTracking` is disabled (i. e. `enableStallTracking: false`) or upgrade to `sentry@6`,

See [this issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/641) for more details.

## `MutexLockWithTimeout` C++ exception[​](/react-native-keyboard-controller/docs/troubleshooting.md#mutexlockwithtimeout-c-exception "Direct link to mutexlockwithtimeout-c-exception")

This exception is thrown when you are trying to use `KeyboardProvider` or `KeyboardAwareScrollView` on Android with the new architecture enabled. A top of stacktrace will look like this:

```
NonPI::MutexLockWithTimeout at line 384 within libc
offset 726000) (std::__ndk1::mutex::lock at line 12 within split_config.arm64_v8a.apk
offset c01000) (facebook::react::Binding::schedulerDidFinishTransaction at line 84 within split_config.arm64_v8a.apk
offset c01000) (facebook::react::Scheduler::uiManagerDidFinishTransaction at line 68 within split_config.arm64_v8a.apk
offset c01000) (facebook::react::UIManager::shadowTreeDidFinishTransaction const at line 64 within split_config.arm64_v8a.apk
offset c01000) (facebook::react::ShadowTree::mount const at line 348 within split_config.arm64_v8a.apk
offset c01000) (facebook::react::ShadowTree::tryCommit const at line 2612 within split_config.arm64_v8a.apk
```

You have two ways to fix this problem:

* enable `allowRecursiveCommitsWithSynchronousMountOnAndroid` feature flag (see [react-native-reanimated#6418](https://github.com/software-mansion/react-native-reanimated/issues/6418#issuecomment-2296107100) and [react-native-keyboard-controller](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/687))
* upgrade to `react-native@0.77+` (starting from this version this flag is enabled by default).

## Filename longer than 260 characters[​](/react-native-keyboard-controller/docs/troubleshooting.md#filename-longer-than-260-characters "Direct link to Filename longer than 260 characters")

If you experience this error on Windows you need to perform next steps:

1. **Download the Latest Version of Ninja**

   * Download the latest Ninja release from the [official repository](https://github.com/ninja-build/ninja/releases)
   * Replace the existing `ninja.exe` in `$SDK_PATH$\cmake\$CMAKE_VERSION$\bin` with the newly downloaded version

2. **Update the build.gradle File**

   * Open `android/app/build.gradle`
   * Inside the `android.defaultConfig` block, add the following code:

   ```
   import org.apache.tools.ant.taskdefs.condition.Os

   externalNativeBuild {
       cmake {
           def cmakeDir = "${android.sdkDirectory}/cmake/3.31.1/bin"
           def ninjaExecutable = Os.isFamily(Os.FAMILY_WINDOWS) ? "ninja.exe" : "ninja"
           def ninjaPath = "${cmakeDir}/${ninjaExecutable}".replace("\\", "/")
           arguments "-DCMAKE_MAKE_PROGRAM=${ninjaPath}",
                      "-DCMAKE_OBJECT_PATH_MAX=1024"
      }
   }
   ```

   tip

   This setup automatically builds the correct path to `ninja` based on the CMake version (`3.31.1`) in your Android SDK. If you're using a different version, update `cmakeDir` accordingly.

3. **Enable Long Path Support in Windows**

   * Run the following `PowerShell` command to enable long path support in Windows:

   ```
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```
