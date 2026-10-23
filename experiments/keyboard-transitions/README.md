# Interactive back swipe

Experimental iOS keyboard policies for [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699).

```ts
KeyboardController.setInteractiveBackSwipe("close");
KeyboardController.setInteractiveBackSwipe("none");
KeyboardController.setInteractiveBackSwipe("interactively");

// Explicitly restore default event handling:
KeyboardController.setInteractiveBackSwipe(null);
```

The setting is global and persists until explicitly changed.

| Mode            | Behavior                                                                                     | Interaction reference |
| --------------- | -------------------------------------------------------------------------------------------- | --------------------- |
| `close`         | Close the keyboard when the back gesture starts; restore focus when the gesture is canceled. | Telegram, Notes       |
| `none`          | Preserve the chat's vertical layout while the screen and keyboard slide horizontally.        | WhatsApp, Messages    |
| `interactively` | Move the messages and input down with the keyboard, following the gesture and its reversal.  | Instagram             |

## Native-stack configuration

The navigator owns the keyboard transition. The FabricExample playground pairs each policy with these options:

| Mode            | `fullScreenGestureEnabled` | `keyboardHandlingEnabled` | `animation`     | `animationMatchesGesture` |
| --------------- | -------------------------- | ------------------------- | --------------- | ------------------------- |
| `close`         | `true`                     | `true`                    | `"default"`     | `false`                   |
| `none`          | `true`                     | `false`                   | `"default"`     | `false`                   |
| `interactively` | `true`                     | `false`                   | `"simple_push"` | `true`                    |

The **Interactive back swipe** screen exposes all three modes, including a selector that works with the keyboard already open.

## Native behavior

- Cache the focused input and its controller through `UIResponder.parentViewController`.
- Identify an interactive pop using the controller's transition coordinator and removal from its navigation stack. Keyboard notifications have no back-swipe origin field.
- Latch the policy until completion or cancellation. UIKit notifications and `KeyboardEvents` retain their normal lifecycle; the policy controls keyboard-controller's animation callbacks.
- `none` holds the outgoing screen's keyboard height until the transition ends.
- `interactively` samples the source screen's presentation layer with `CADisplayLink` and derives intermediate keyboard heights from horizontal displacement. On the tested iOS 26.5 path, `keyboardLayoutGuide` did not track the visible descent.
- `close` observes cancellation through `notifyWhenInteractionChanges` and forwards the restored keyboard's real animation instead of forcing a zero-duration final layout correction.
- A newly focused controller takes precedence over an outgoing screen's policy. Display links and transition callbacks are invalidated when their observer unmounts.

The implementation uses public UIKit APIs. The global setting currently supports one configured navigation flow. The progress calculation assumes a horizontal push; nested navigation, overlapping transitions and other presentation styles need further coverage.

## Canceled `close` gestures and screens

The playground includes `FabricExample/patches/react-native-screens+4.27.0.patch`, applied by its existing `patch-package` postinstall. Animated restoration after a canceled `close` gesture currently requires that experimental dependency patch.

Screens previously called `endEditing` in `viewWillDisappear`, after UIKit had captured the keyboard for the pop. On cancellation UIKit restored that state instantly, with zero-duration keyboard notifications. Removing keyboard-controller's `performWithoutAnimation` calls did not change that behavior.

The patch saves and resigns the input before an accepted back gesture starts the pop. If the gesture is canceled, screens restores focus after the navigation transaction completes. A completed pop does not restore the outgoing screen's input. The patch respects `keyboardHandlingEnabled`, leaving `none` and `interactively` unchanged, and preserves the standard navigation animation. It adds no UIKit swizzling or private API calls.

## Run

Use Yarn 1 and the existing FabricExample dependency/Pods setup. Keep the shared `FabricExample/ios/build` cache.

For the normal Examples menu, run Metro on **8083** and choose **Interactive back swipe**. For the standalone playground:

```sh
cd FabricExample
yarn start --port 8083 --config back-swipe-playground.metro.config.js
```

`ARGENT_BACK_SWIPE_FULL_APP=1` loads the normal menu with the same resolver configuration. A standalone Release build can embed `back-swipe-playground.index.js` with `BUNDLE_CONFIG=back-swipe-playground.metro.config.js` to run without Metro. Native API changes require CocoaPods/codegen and a native rebuild.

## Diagnostics and verification

`back-swipe-playground.index.js` records RN keyboard events and keyboard-controller callbacks in `globalThis.__backSwipePlaygroundTrace`. `issue243.interactive.index.js` preserves the original **Interactive Keyboard iOS** example with four native-stack flag combinations and no policy enabled.

The debug launch argument `--issue243-trace` records native keyboard notifications, responder calls and presentation-layer geometry in the app's Documents directory as `interactive-swipe-native.json`.

Published current/proposed recordings are in [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699). The proposed recordings cover canceled and completed gestures on an iPhone 17 Pro simulator, iOS 26.5, RN 0.87.1 and screens 4.27.0.

`.argent/flows/interactive-back-swipe-cancel.yaml` uses Metro **8083** and covers `close` cancellation. `.argent/flows/interactive-back-swipe-modes.yaml` covers canceled and completed gestures in all three modes on the same port. Its final replay passed 61 checks on an iPhone 17 Pro simulator, iOS 26.5.

The cancellation recording and native trace confirm a real keyboard animation: before the screens patch, restoration jumped from Y=874 to Y=539 with duration 0; afterward, presentation-layer positions passed through Y=859, 771, 650 and subsequent intermediate values over about 383 ms. A control build without either `performWithoutAnimation` call still reproduced the original jump.

The iOS build, TypeScript, scoped ESLint/SwiftLint and all 245 tracked library tests passed. Full-workspace lint and Jest remain blocked by unrelated diagnostics, generated artifacts and example/docs test setup. Physical iPhone verification was unavailable because the paired iPhone 16 Pro was disconnected.

The earlier `interactive-back-swipe-*.yaml` flows retain their original **8097** launch arguments; their individual-mode entries use the standalone configuration, and the menu flow needs `ARGENT_BACK_SWIPE_FULL_APP=1`. Gesture paths intentionally use raw back gestures; app controls use semantic selectors.

## Files

- `ios/observers/movement/KeyboardBackSwipeTransition.swift`: transition classification, layout policy and cancellation handling.
- `ios/observers/movement/observer/KeyboardMovementObserver*.swift`: event routing and observer cleanup.
- `ios/extensions/UIResponder.swift`: focused controller lookup.
- `ios/KeyboardControllerModule*`, `src/module.ts`, `src/types/module.ts`, `src/specs/NativeKeyboardController.ts`: public API and native export.
- Android Paper/Fabric modules, web bindings and Jest mocks: iOS API fallbacks.
- `FabricExample/src/screens/Examples/InteractiveBackSwipe/`: three-mode playground.
- `FabricExample/patches/react-native-screens+4.27.0.patch`: keyboard dismissal before the pop and animated restoration after cancellation.
- `docs/docs/api/keyboard-controller.md`: API usage.
