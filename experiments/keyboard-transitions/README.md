# Interactive back swipe

Experimental iOS keyboard layout policies for [#1699](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/1699).

The [Interactive back swipe guide](../../docs/docs/guides/interactive-back-swipe.mdx) documents the three modes, navigator defaults, Android behavior, required native-stack options and synchronized recordings.

Open **Interactive back swipe** from the normal Examples menu in either app. FabricExample uses Metro **8083**; example uses **8084**. No diagnostic entry or custom Metro configuration is needed.

## Native gesture handling

The examples use their installed screens packages without local keyboard-transition patches. `close` wraps the existing native gesture delegate, preserves its acceptance decision and all its other callbacks, then resigns the focused input before pop begins. It restores focus after a canceled transition's full completion, outside the navigation animation transaction. A completed pop does not restore focus.

The `close` handler uses public UIKit gesture, delegate and transition APIs. The system edge/content gestures are obtained from UINavigationController. Custom native-stack pans are matched through the same existing pop delegate on the navigation container, without referencing screens classes. The existing focus holder retains the last input weakly. If React Native hands first-responder status to its root view on blur, restoration allows that same fallback responder; a different responder or a different last-focused input prevents restoration.

`none` holds the outgoing layout height. `interactively` sends the keyboard-hidden target inside `UIViewControllerTransitionCoordinator.animate(alongsideTransition:completion:)`. UIKit runs the corresponding native view animation forwards and backwards with the gesture. The animation has the same timing source as the transition. Completion restores the appropriate layout value on the next main-queue turn.

## Verification

In FabricExample with screens 4.27.0, a runtime trace of the same drag, reversal and completed pop on iOS 18.5 and 26.2 showed repeated `UIPercentDrivenInteractiveTransition.update(_:)` calls. Observing `percentComplete` through KVO delivered its initial value. The keyboard host’s model center changed at the endpoints. The layout uses the coordinator for native view animations, so it does not need either observation or an extra frame sampler.

The playground uses a `KeyboardStickyView` for the chat, with the bottom safe-area inset inside the footer. Its outer edge can follow the keyboard through the full range of travel. The [guide](../../docs/docs/guides/interactive-back-swipe.mdx#version-and-gesture-differences) documents the keyboard trajectory for each native-stack option.

FabricExample (RN 0.87.1, screens 4.27.0) passed the three Detox scenarios on iOS 18.5 and 26.2. Each compares the canceled chat to its original screenshot and the completed pop to the setup screen. The held-swipe screenshot checks the composer’s position and locates the real keyboard by its key legends.

| Held gesture                            | iPhone 16 Pro simulator, iOS 18.5                                              | iPhone 17 Pro simulator, iOS 26.2                                              |
| --------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `none`, explicit system edge (XCUITest) | Screen and keys moved 252 pt sideways, footer and keys held their height       | Screen and keys moved 253 pt sideways, footer and keys held their height       |
| `none`, full-screen pan                 | Footer kept its height as the keys descended                                   | Keyboard and footer traveled sideways with the outgoing screen                 |
| `interactively`, `simple_push`          | Footer followed the keyboard down and returned after cancellation              | Footer followed the keyboard down and returned after cancellation              |
| `close`                                 | Footer reached its keyboard-hidden position, focus returned after cancellation | Footer reached its keyboard-hidden position, focus returned after cancellation |

On iOS 18 the Detox scenario deliberately selects the full-screen screens pan. The system edge gestures in the table were driven separately with XCUITest, including a canceled drag and a completed pop. Starting a simulated in-app drag near the edge was insufficient to exercise the UIKit recognizer there.

Earlier verification used existing iPhone 17 Pro simulators with iOS 26.5 and iOS 26.2. On iOS 26.2, a full gesture replay passed 61 structural checks for cancellation and completion in all three modes with FabricExample (RN 0.87.1, unmodified screens 4.27.0). The native `close` handler also passed the focused Detox test in the older example (RN 0.81.4, unmodified screens 4.16.0), including keyboard visibility, focus, an edge tap, canceled swipe restoration and completed pop.

Native traces confirmed that `close` resigns before pop starts and restores focus after the canceled transition completes, followed by a regular keyboard-show notification with a 383 ms animation. The previous implementation could restore first-responder focus without showing the software keyboard. In the older architecture, resigning also promotes RCTRootView to first responder; the native handler allows restoration from that same captured ancestor, while rejecting a different focused input or responder. A final 40-check replay also passed quick edge cancellation, full-screen cancellation, an edge tap, an opposite-direction pan and completed pop. The recording shows the keyboard opening progressively after the screen has returned. Final builds contain no diagnostic logging.

The earlier dependency experiments and fixed-golden Detox failures are historical evidence rather than verification of this handler. The current test compares the canceled screen to its own initial state, preserving the original pixel tolerances and explicit focus/composer checks. Separate touch-driven replays verify the visible transition; final-state screenshot comparisons alone do not establish pixel-by-pixel synchronization during a gesture.

The legacy example uses screens 4.16.0. Its full-screen pan on iOS 26 can lower the keyboard even with the default animation. The guide’s version comparison uses FabricExample with screens 4.27.0.

The opt-in setting applies to one configured horizontal native-stack flow and persists until changed. `KeyboardBackSwipeGesture.swift` handles focus for `close`, and `KeyboardBackSwipeTransition.swift` coordinates layout for `none` and `interactively`.
