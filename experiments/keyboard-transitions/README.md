# Interactive back swipe

Experimental iOS keyboard layout policies for [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699).

The [Interactive back swipe guide](../../docs/docs/guides/interactive-back-swipe.mdx) documents the three modes, navigator defaults, Android behavior, required native-stack options and synchronized recordings.

Open **Interactive back swipe** from the normal Examples menu in either app. FabricExample uses Metro **8083**; example uses **8084**. No diagnostic entry or custom Metro configuration is needed.

## Screens patches

Animated restoration after a canceled close gesture requires the example's dependency patch:

- FabricExample: `patches/react-native-screens+4.27.0.patch`.
- example: `patches/react-native-screens+4.16.0.patch`.

Both are applied by the existing patch-package postinstall. They save and resign the input before an accepted back gesture starts the pop, then restore focus after cancellation. Completed pops do not restore the outgoing input. UIKit captured and instantly restored the keyboard when dismissal happened later in viewWillDisappear; a control build without keyboard-controller's performWithoutAnimation calls still reproduced that jump.

## Verification

The visual E2E in `e2e/kit/018-interactive-back-swipe.e2e.ts` checks all three policies, compares cancellation against one common full-screen image and checks the common setup image after completion.

The Detox suite is currently **red** on the iPhone 17 Pro simulator with iOS 26.5. After a short canceled swipe, `close` restores first-responder focus but leaves the software keyboard hidden. The native trace confirms `becomeFirstResponder` succeeds without a keyboard-show notification. In `none` and `interactively`, the restored screenshot has a blank content area. These failures must be resolved before treating this experiment as a verified feature; the assertions remain strict.

Separate Argent HID runs ended with visible content and keyboard in FabricExample, including after a short `none` drag and lift. Those structural checks do not establish pixel-by-pixel synchronization or equivalence to Detox's gesture. The difference is observed evidence, not a confirmed diagnosis of Detox or UIKit. Raw recordings, logs and reusable flows remain local in `.argent/`.

The older `example` with screens 4.16.0 builds and exposes the playground, but its `none` full-screen transition still lowers the keyboard and leaves a gap below the held content. Switching to an edge gesture and a trial backport of the newer native gesture did not pass cancellation checks; neither trial is included in the final patch.

The guide comparison targets iOS 26.5 with RN 0.87.1 and screens 4.27.0. Older screens versions can choose a different native/custom transition for the same fullScreenGestureEnabled option. The guide calls out this compatibility boundary.

Native implementation: `ios/observers/movement/KeyboardBackSwipeTransition.swift`. The setting is global, opt-in and persists until explicitly changed. The current experiment assumes one configured horizontal native-stack flow.
