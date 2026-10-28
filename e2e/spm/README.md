# SwiftPM smoke test

Use React Native 0.88.0, React Native Reanimated 4.7.1, and React Native Worklets 0.13.0. This tests the published package layout, React Native codegen, the native Fabric view, TurboModule calls, and the Reanimated keyboard animation.

From the repository root, using Node 24 and Yarn 1:

```sh
npm pack --ignore-scripts --pack-destination /tmp
npx @react-native-community/cli@20.2.0 init RNKCSpmExample \
  --version 0.88.0 --directory build/spm/RNKCSpmExample \
  --pm yarn --skip-install --install-pods false --skip-git-init
```

In the generated application's `package.json`, remove `@react-native/new-app-screen` and `react-native-safe-area-context`, then add:

```json
"react-native-keyboard-controller": "file:/tmp/react-native-keyboard-controller-<version>.tgz",
"react-native-reanimated": "4.7.1",
"react-native-worklets": "0.13.0"
```

Copy `e2e/spm/App.tsx` over the generated `App.tsx`. Add `react-native-worklets/plugin` to `babel.config.js`, then run from the application directory:

```sh
yarn install
yarn react-native spm add --deintegrate --yes
yarn start
```

Build the generated `.xcodeproj` in both Debug and Release. Reuse the project's existing DerivedData directory and select an existing simulator explicitly. The build must resolve `ReactNativeKeyboardController`, compile its Swift and Objective-C targets, and link them into the app. `swift package dump-package` alone does not verify any of those steps.

On the simulator:

1. Launch the app. Verify `Keyboard hidden` appears.
2. Tap **First input** and type text. Verify `Keyboard visible` appears and the toolbar moves above the keyboard.
3. Tap **Next input** and type text. Verify it appears in **Second input**.
4. Tap **Dismiss keyboard**. Verify `Keyboard hidden` appears and the toolbar returns to the bottom.

The recorded flow is `.argent/flows/issue1693-spm-smoke.yaml`. Replay it against each build:

```sh
argent flow run issue1693-spm-smoke --platform ios --device <existing-simulator-udid>
```

Capture screenshots of the hidden and visible states, and check runtime logs for native module or view registration errors. The flow keeps accessibility checks for input values because the native view hierarchy does not expose those values. Its idle checks can warn about the blinking input caret; the text-entry assertions still have to pass.

For type-checking the generated app, exclude `ios` and `android` in its `tsconfig.json`. Otherwise TypeScript follows SwiftPM's generated autolinking symlinks and checks dependency source trees again.

## Static package layout

SwiftPM requires separate targets for Swift and Objective-C/C++. The package has an Objective-C helper target, a Swift target, and the React Native target. It discovers Swift files automatically. The Paper view manager is excluded because this integration requires the New Architecture.

SwiftPM currently does not expose a static Swift target's generated header to Objective-C++. `ios/KeyboardControllerSwift.h` declares the consumed Objective-C interface, and two Swift classes have explicit Objective-C runtime names. Keep that header in sync when changing the exposed Swift methods. CocoaPods continues to use its generated Swift header.

The integration and verification approach follows the introducing PRs for [safe area context](https://github.com/appandflow/react-native-safe-area-context/pull/768), [screens](https://github.com/software-mansion/react-native-screens/pull/4593), [gesture handler](https://github.com/software-mansion/react-native-gesture-handler/pull/4510), and [Reanimated/Worklets](https://github.com/software-mansion/react-native-reanimated/pull/10472). The React Native 0.88 minimum uses the newer `swiftpmConfig` autolinking configuration.
