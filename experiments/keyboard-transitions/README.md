# Interactive back swipe

Experimental iOS keyboard layout policies for [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699).

The [Interactive back swipe guide](../../docs/docs/guides/interactive-back-swipe.mdx) documents the three modes, navigator defaults, Android behavior, required native-stack options and synchronized recordings.

Open **Interactive back swipe** from the normal Examples menu in either app. FabricExample uses Metro **8083**; example uses **8084**. No diagnostic entry or custom Metro configuration is needed.

## Native gesture handling

The examples use their installed screens packages without local keyboard-transition patches. `close` wraps the existing native gesture delegate, preserves its acceptance decision and all its other callbacks, then resigns the focused input before pop begins. It restores focus after a canceled transition's full completion, outside the navigation animation transaction. A completed pop does not restore focus.

The `close` handler uses public UIKit gesture, delegate and transition APIs. The system edge/content gestures are obtained from UINavigationController. Custom native-stack pans are matched through the same existing pop delegate on the navigation container, without referencing screens classes. The existing focus holder retains the last input weakly. If React Native hands first-responder status to its root view on blur, restoration allows that same fallback responder; a different responder or a different last-focused input prevents restoration.

`none` and `interactively` keep their layout-callback policies. On iOS <26, `none` additionally routes a full-screen pan through UIKit's existing native pop driver; the original screens pan is restored when the policy changes. This uses a guarded lookup of the undocumented UIKit gesture target and `handleNavigationTransition:`. It does not modify screens sources or the application's JavaScript. The old synthetic `close` animation callbacks have been removed: close now forwards the keyboard's normal events.

## Verification

The visual E2E in `e2e/kit/018-interactive-back-swipe.e2e.ts` checks all three policies, compares cancellation against one common initial full-screen image from the current run and checks the common setup image after completion. It also checks that tapping the composer's leading edge does not dismiss the keyboard. In `none` and `close`, a completing content swipe is held while independent simulator screenshots assert the mid-transition layout. This catches the iOS 18 `none` gap that cancellation-only images missed. The keyboard check compares real key legends, so differences in keyboard material do not require per-OS goldens. It retains explicit focus and raised-composer checks; references are captured before the gestures, never updated after a failure.

Continuous keyboard/composer alignment in `interactively` is a separate known issue. A held-gesture screenshot on iOS 18.5 exposed a gap; changing the source-screen origin alone did not align the content with the real keyboard. That experiment was reverted and this mode's movement implementation is unchanged. Its cancellation and completion remain covered; the new mid-transition layout assertion applies to `none` and `close`.

The pre-iOS-26 fix was verified on November 18, 2026 with FabricExample (RN 0.87.1, unmodified screens 4.27.0). The new keyboard-position assertion failed on the unfixed iOS 18.5 build with 100% unmatched key legends. Final Release builds passed all three Detox cases on both existing simulators:

| Simulator     | OS       | `close`                                                   | `none`                                                                        | `interactively`                    |
| ------------- | -------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| iPhone 16 Pro | iOS 18.5 | Mid-transition layout, cancellation and completion passed | Mid-transition content/keyboard alignment, cancellation and completion passed | Cancellation and completion passed |
| iPhone 17 Pro | iOS 26.2 | Mid-transition layout, cancellation and completion passed | Mid-transition content/keyboard alignment, cancellation and completion passed | Cancellation and completion passed |

Earlier verification used existing iPhone 17 Pro simulators with iOS 26.5 and iOS 26.2. On iOS 26.2, a full gesture replay passed 61 structural checks for cancellation and completion in all three modes with FabricExample (RN 0.87.1, unmodified screens 4.27.0). The native `close` handler also passed the focused Detox test in the older example (RN 0.81.4, unmodified screens 4.16.0), including keyboard visibility, focus, an edge tap, canceled swipe restoration and completed pop.

Native traces confirmed that `close` resigns before pop starts and restores focus after the canceled transition completes, followed by a regular keyboard-show notification with a 383 ms animation. The previous implementation could restore first-responder focus without showing the software keyboard. In the older architecture, resigning also promotes RCTRootView to first responder; the native handler allows restoration from that same captured ancestor, while rejecting a different focused input or responder. A final 40-check replay also passed quick edge cancellation, full-screen cancellation, an edge tap, an opposite-direction pan and completed pop. The recording shows the keyboard opening progressively after the screen has returned. Final builds contain no diagnostic logging.

The earlier dependency experiments and fixed-golden Detox failures are historical evidence rather than verification of this handler. The current test compares the canceled screen to its own initial state, preserving the original pixel tolerances and explicit focus/composer checks. Separate touch-driven replays verify the visible transition; final-state screenshot comparisons alone do not establish pixel-by-pixel synchronization during a gesture.

On iOS 26, the older `example` with screens 4.16.0 builds and exposes the playground, but its `none` full-screen transition still lowers the keyboard and leaves a gap below the held content. Switching to an edge gesture and a trial backport of the newer native gesture did not pass cancellation checks; neither trial is included in the final patch.

The guide comparison targets iOS 26.5 with RN 0.87.1 and screens 4.27.0. Older screens versions can choose a different native/custom transition for the same fullScreenGestureEnabled option. The guide calls out this compatibility boundary.

Native implementation: `ios/observers/movement/KeyboardBackSwipeGesture.swift` handles close, focus restoration and the pre-iOS-26 native-pop adapter for `none`; `KeyboardBackSwipeTransition.swift` handles the layout policies. The setting is global, opt-in and persists until explicitly changed. Gesture delegates are restored when the policy changes or the last keyboard observer unmounts. The current experiment assumes one configured horizontal native-stack flow.
