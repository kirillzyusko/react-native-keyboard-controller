# Keyboard transition experiments

Review snapshot for [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699) and the gray keyboard investigation that followed [#1215](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1215). Both APIs are experimental and opt-in.

## Interactive back swipe

```ts
KeyboardController.setInteractiveBackSwipe("close");
KeyboardController.setInteractiveBackSwipe("none");
KeyboardController.setInteractiveBackSwipe("interactively");

// Restore normal keyboard-controller event handling:
KeyboardController.setInteractiveBackSwipe(null);
```

| Mode            | Behavior                                                                                     | Interaction reference |
| --------------- | -------------------------------------------------------------------------------------------- | --------------------- |
| `close`         | Close the keyboard at gesture start, independently of finger progress.                       | Telegram, Notes       |
| `none`          | Preserve the chat's vertical layout while the screen and keyboard slide horizontally.        | WhatsApp, Messages    |
| `interactively` | Move the messages and input down with the keyboard; follow a pause, reversal and completion. | Instagram             |

The navigator owns the keyboard transition. Pair the API with these native-stack options:

| Mode            | `fullScreenGestureEnabled` | `keyboardHandlingEnabled` | `animation`     | `animationMatchesGesture` |
| --------------- | -------------------------- | ------------------------- | --------------- | ------------------------- |
| `close`         | `true`                     | `true`                    | `"default"`     | `false`                   |
| `none`          | `true`                     | `false`                   | `"default"`     | `false`                   |
| `interactively` | `true`                     | `false`                   | `"simple_push"` | `true`                    |

The **Interactive back swipe** screen in FabricExample sets these options, exposes the three modes and resets the policy when Chat unmounts. A radio selector also works with the keyboard already open.

### Native path

1. Cache the focused input's controller through `UIResponder.parentViewController`.
2. When a keyboard event arrives, look for that controller's interactive transition and its removal from the navigation stack. The keyboard notification itself has no back-swipe origin field.
3. Keep the selected mode until transition completion or cancellation. Continue the observer lifecycle and real UIKit notifications; gate only keyboard-controller's animation callbacks.
4. For `none`, hold the outgoing screen's keyboard height until the transition ends.
5. For `interactively`, sample the source screen's presentation layer with `CADisplayLink` and emit intermediate heights from its horizontal displacement. On the tested iOS 26.5 path, `keyboardLayoutGuide` did not track the keyboard's visible descent.
6. For `close`, dispatch the closing layout animation in a separate UIKit animation transaction, so it does not inherit the interactive navigation transaction.
7. Synchronize the final height after completion or cancellation. A new focused controller takes precedence over the outgoing screen's policy.

This part uses public UIKit APIs. The setting is global and currently intended for one configured navigation flow. The progress calculation assumes a horizontal push. Nested navigation, overlapping transitions, other presentation styles and other OS versions need coverage before this can become a stable API.

## Gray keyboard transition snapshot

```ts
const installed = await KeyboardController.fixKeyboardTransition();
```

Call this before navigation/focus to install the experiment. It returns `false` on unsupported platforms or when the expected UIKit classes/selectors are absent. Installation lasts for the process; reload JavaScript alone does not disable it. Restart the app for an API-off comparison.

UIKit's keyboard transition snapshot can show an opaque gray background when an input focuses early during a standard push. The experiment replaces the snapshot view inside `UIKBViewTreeSnapshotter` with a live `_UIPortalView` whose source is the keyboard container. UIKit still animates its transition snapshot, and the portal keeps sampling the live native material and content beneath it.

**This experiment uses private UIKit APIs:** `_UIPortalView`, `snapshotterForKeyboardView:afterScreenUpdates:` and the snapshotter's `_snapshotView`. It is disabled by default and is included here for review, without a claim of App Store suitability. It does not implement the back-swipe modes above.

The original late KAV movement from #1215 and this gray snapshot are separate symptoms. PR [#1598](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/1598) addressed the former; this prototype investigates the latter.

## Run in the current checkout

Use Yarn 1. Install the root and FabricExample dependencies if needed, then run CocoaPods without removing the shared build caches:

```sh
yarn
cd FabricExample
yarn
yarn bundle-install
yarn pods
```

Run the normal app on Metro 8083 and choose **Interactive back swipe** from the Examples menu:

```sh
cd FabricExample
yarn start --port 8083
# In another terminal, choose an existing allowed simulator explicitly:
yarn ios --udid <existing-iPhone-17-Pro-UDID> --port 8083
```

For just this playground, use the diagnostic entry/config:

```sh
cd FabricExample
yarn start --port 8083 --config back-swipe-playground.metro.config.js
```

Pass `ARGENT_BACK_SWIPE_FULL_APP=1` to that command to load the normal Examples menu with the same resolver configuration.

Other retained entries:

- `issue243.interactive.metro.config.js`: the original Interactive Keyboard iOS screen inside a native stack, with the four combinations of full-screen gesture and explicit keyboard dismissal. No back-swipe policy is enabled there. The two full-screen recordings in #1699 show the same visible history jump; they do not demonstrate a visual difference between `keyboardHandlingEnabled: true` and `false`.
- `issue1215.metro.config.js`: the in-repository native-stack/autofocus/KAV reproduction. It compares the package and RN avoiding views. The gray snapshot API is not enabled automatically; call `KeyboardController.fixKeyboardTransition()` before pushing to test it.

Always restart the app against the intended Metro port after changing entries. Native API additions require a native rebuild/codegen.

### Standalone review app on an iPhone

`FabricExample/keyboard-transitions.index.js` combines both experiments in one small menu. It includes the back-swipe playground and the native push/autofocus example with the preserved live Lottie backdrop. The snapshot workaround starts **off** and has an explicit enable button. Force quit and reopen to compare with it off again.

Build Release with this entry to embed JavaScript and run without Metro:

```sh
cd FabricExample
ENTRY_FILE=keyboard-transitions.index.js \
BUNDLE_CONFIG=keyboard-transitions.metro.config.js \
xcodebuild -workspace ios/KeyboardControllerFabricExample.xcworkspace \
  -scheme KeyboardControllerFabricExample -configuration Release \
  -destination 'id=<connected-iPhone-UDID>' -derivedDataPath ios/build \
  IPHONEOS_DEPLOYMENT_TARGET=15.1 DEVELOPMENT_TEAM=<your-team-id> build
```

The app is named **KeyboardControllerFabricExample**. Open **Interactive back swipe**, choose a mode, open Chat, focus Message, then swipe right from the message history. A short slow drag cancels; a long drag completes. **All experiments** returns to the menu. To compare keyboard materials, open the gray keyboard example before enabling the live snapshot, then enable it from the menu and repeat the same push.

## Diagnostics and evidence

`back-swipe-playground.index.js` records UIKit/RN keyboard events and keyboard-controller callbacks in `globalThis.__backSwipePlaygroundTrace`. `issue243.interactive.index.js` records the baseline configurations in `globalThis.__issue243Trace`.

The opt-in debug launch argument `--issue243-trace` enables `InteractiveSwipeTrace` in FabricExample's AppDelegate. It records native notifications, responder calls, transition progress, model/presentation geometry and scroll state to the app's Documents directory as `interactive-swipe-native.json`. Leave it off for ordinary use.

The preserved `.argent/flows/interactive-back-swipe-*.yaml` recordings use their original Metro port **8097**, not the project's normal 8083. Start the matching diagnostic config on 8097 to replay those exact recordings. The `menu` flow needs `ARGENT_BACK_SWIPE_FULL_APP=1`; the individual mode flows need the standalone entry. The flows target an iPhone 17 Pro on iOS 26.5. They use semantic selectors, explicit keyboard/destination checks and deliberate raw back gestures. The unlabeled LogBox X has a documented, device-specific coordinate fallback.

The newer `.argent/flows/keyboard-transitions-menu.yaml` uses **8083** with `keyboard-transitions.metro.config.js`. It checks the combined review menu, opens both examples, focuses the input before and after enabling the snapshot API, checks the software keyboard and returns to the menu. It uses semantic targets throughout. The two Feedback idle checks warn because the Lottie backdrop intentionally keeps moving; the following accessibility checks establish keyboard readiness. This smoke test does not establish a visual before/after fix.

Published current/proposed recordings are in [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699). Each proposed mode includes a canceled and a completed swipe. Back-swipe verification was performed on an iPhone 17 Pro simulator, iOS 26.5, RN 0.87.1 and screens 4.27.0. The gray snapshot API was previously checked on an iPhone 17 Pro simulator, iOS 26.2, including repeated pushes and text input. Those earlier runs are evidence of the experiments, not broad platform coverage.

The `patches/` directory preserves the tested external reproduction's API and Lottie backdrop changes. These historical patches target `rhinck/keyboard-example`, not this repository. That temporary reproduction checkout is no longer present; the current native implementations live under `ios/` in this branch. The Lottie patch includes its generated animation JSON so the backdrop experiment can be inspected in full.

### Snapshot verification (2026-10-23)

- TypeScript and ESLint for the selected JS/TS files passed.
- Library Jest tests passed: 33 suites, 274 tests.
- SwiftFormat and SwiftLint passed for the six changed library Swift files.
- FabricExample Debug built for the existing iPhone 17 Pro simulator, iOS 26.5.
- The combined menu flow replayed end to end on that simulator: 31 passed, 0 failed/errored; two expected idle warnings for the looping Lottie. The snapshot API returned `true`.
- FabricExample Release built and installed on the connected iPhone 16 Pro, iOS 26.6.1, with the standalone entry and bundled JS.
- Physical-device UI verification initially stopped before the first screen read: the Argent/XCTest runner timed out enabling automation mode. Installation is verified; on-device interaction and visual behavior are not yet verified by that attempt.

The full workspace lint and Jest commands fail outside the selected changes: lint includes unrelated diagnostics and generated coverage/E2E artifacts; Jest includes standalone evidence specs and example/docs tests with missing native-module mocks. The scoped checks above passed. Builds used the shared `FabricExample/ios/build` cache and the existing local dependency setup; unrelated worktree changes are excluded from this snapshot.

## Files to review

- `ios/observers/movement/KeyboardBackSwipeTransition.swift`: back-swipe classification, policy and intermediate heights.
- `ios/observers/movement/observer/KeyboardMovementObserver*.swift`: event routing and cleanup.
- `ios/extensions/UIResponder.swift`: input owner lookup.
- `ios/swizzling/KeyboardTransitionSnapshot.swift`: private UIKit snapshot experiment.
- `ios/KeyboardControllerModule*` and `src/{module,types/module,specs/NativeKeyboardController,bindings}.ts`: exported APIs and platform fallbacks.
- Android Paper/Fabric modules and `jest/index.js`: no-op methods and mocks for the iOS APIs.
- `FabricExample/src/screens/Examples/InteractiveBackSwipe/`: working three-mode playground.
- `docs/docs/api/keyboard-controller.md`: API usage and limits.

This branch is a review snapshot. It does not enable either experiment by default outside its playground, and it includes no release or production-readiness claim.
