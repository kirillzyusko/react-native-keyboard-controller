# Interactive back swipe

Experimental iOS keyboard layout policies for [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699).

The [Interactive back swipe guide](../../docs/docs/guides/interactive-back-swipe.mdx) documents the three modes, navigator defaults, Android behavior, required native-stack options and synchronized recordings.

Open **Interactive back swipe** from the normal Examples menu in either app. FabricExample uses Metro **8083**; example uses **8084**. No diagnostic entry or custom Metro configuration is needed.

## Navigator-owned behavior

The examples use their installed screens packages without local keyboard-transition patches. The layout policy does not dismiss the system keyboard or restore first-responder focus; the navigator owns both operations.

Earlier experiments changed screens to resign the input before an accepted back gesture and restore focus after cancellation. That changed the timing of UIKit's keyboard snapshot and restoration. Those dependency changes have been removed. Animated restoration in `close` is therefore not guaranteed; `none` and `interactively` do not depend on those changes.

## Verification

The visual E2E in `e2e/kit/018-interactive-back-swipe.e2e.ts` checks all three policies, compares cancellation against one common full-screen image and checks the common setup image after completion.

Earlier Detox runs with the experimental dependency changes were **red** on the iPhone 17 Pro simulator with iOS 26.5. After a short canceled swipe, `close` restored first-responder focus but left the software keyboard hidden. The native trace confirmed `becomeFirstResponder` succeeded without a keyboard-show notification. In `none` and `interactively`, the restored screenshot had a blank content area. The Detox suite has not been rerun after removing the dependency changes; the assertions remain strict.

On November 18, 2026, the rebased FabricExample Release build passed with unmodified screens 4.27.0. An agent walkthrough and a complete replay passed 61 structural checks for canceled and completed swipes in all three modes on the iPhone 17 Pro simulator with iOS 26.5. Mid-gesture screenshots confirmed the held vertical layout in `none` and the downward movement with the keyboard in `interactively`. In `close`, the keyboard returned after cancellation; the recording still showed a jump during restoration. This verifies the exercised HID path, not the unresolved Detox suite or other navigator configurations.

Separate HID runs ended with visible content and keyboard in FabricExample, including after a short `none` drag and lift. Those structural checks do not establish pixel-by-pixel synchronization or equivalence to Detox's gesture. The difference is observed evidence, not a confirmed diagnosis of Detox or UIKit. These earlier runs used the removed dependency changes and do not verify the current unmodified screens behavior.

The older `example` with screens 4.16.0 builds and exposes the playground, but its `none` full-screen transition still lowers the keyboard and leaves a gap below the held content. Switching to an edge gesture and a trial backport of the newer native gesture did not pass cancellation checks; neither trial is included in the final patch.

The guide comparison targets iOS 26.5 with RN 0.87.1 and screens 4.27.0. Older screens versions can choose a different native/custom transition for the same fullScreenGestureEnabled option. The guide calls out this compatibility boundary.

Native implementation: `ios/observers/movement/KeyboardBackSwipeTransition.swift`. The setting is global, opt-in and persists until explicitly changed. The current experiment assumes one configured horizontal native-stack flow.
