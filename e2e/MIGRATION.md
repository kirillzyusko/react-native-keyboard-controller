# Migration to e2e

Source: Detox, `e2e/kit/**/*.e2e.ts` (guide: https://e2e.com/docs/migrate/detox.md, engine: https://e2e.com/docs/mobile.md)
e2e: `e2e/e2e.config.ts`, tests `e2e/tests/**/*.e2e.ts`
Build: `yarn build-example:android` / `yarn build-example:ios` in `e2e/` (plain release builds; no Detox framework)
Run old: removed (Detox is retired in the same change)
Run new: `yarn test-example:<target>` in `e2e/`, targets `android-28`, `android-31`, `ios-16`, `ios-17`, `ios-18`, `ios-26`, `ios-26e` (Node 24.8+ or 22.22.3+)
Harness: done, smoke `tests/keyboard-animation.e2e.ts` on android-31
Defect check: off

Every Detox file is ported literally into one `describe(..., { serial: true })`:
the Detox `it` blocks share one screen and run in order, and Detox retried a
whole file; a serial group is e2e's ordered retry unit with shared app state.
Test titles, order, and assertions match the source one to one (105 tests).

Last proof run, on the example app after its move to the native stack:
`android-31` whole suite three times with no retries and `SOFT_CHECK=true`
(as CI sets it for API 31), 309 runs passed, 3 failed (one screenshot in 017,
see Gaps), 1 skipped (the `it.todo` placeholder); `ios-26` whole suite once,
11 of 17 files pass and 6 fail as noted per row. `android-28` (local
emulator, AOSP keyboard) whole suite once: 16 of 17 files pass, the same
screenshot in 017 fails.

Stored screenshots exist for `android-28`, `android-31` (emulators, arm64,
Pixel 2 profile) and `ios-26` (iPhone 17 Pro, iOS 26.2, Xcode 27), all
written on macOS. Of the 62 Android screenshots, 55 match Detox's CI
baselines for `e2e_emulator_31` within 0.1%, six differ only in the masked
Password field, and one by a gesture offset; see Gaps. For API 28 it is 56 of 64 against
`e2e_emulator_28`, with the same exceptions and the unstable one in 017.

| Source                                            | e2e                                             | Status  | Assertions (source → e2e) | Passing              | Notes                                                                                                                                                                                   |
| ------------------------------------------------- | ----------------------------------------------- | ------- | ------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| kit/001-keyboard-animation.e2e.ts                 | tests/keyboard-animation.e2e.ts                 | retired | 4 → 4                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/002-enabled-disabled.e2e.ts                   | tests/enabled-disabled.e2e.ts                   | retired | 5 → 5                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/003-input-handlers.e2e.ts                     | tests/input-handlers.e2e.ts                     | retired | 19 → 19                   | android 3/3, ios 1/1 | Android: the keyboard is hidden (Back) before reading the selection labels, which can sit under it                                                                                      |
| kit/004-aware-scroll-view.e2e.ts                  | tests/aware-scroll-view.e2e.ts                  | retired | 13 → 15                   | android 3/3, ios 1/1 | Android: Backspace deletes the selection before `clear()`, because API 28 lists only the selection toolbar while it shows                                                               |
| kit/005-keyboard-toolbar.e2e.ts                   | tests/keyboard-toolbar.e2e.ts                   | retired | 19 → 19                   | android 3/3, ios 0/1 | iOS: `TextInput#1` not focused after the AutoFill sheet closes (unexplained)                                                                                                            |
| kit/006-interactive-keyboard.e2e.ts               | tests/interactive-keyboard.e2e.ts               | retired | 3 → 3                     | android 3/3, ios 0/1 | iOS: the drag that closes the keyboard cannot run (see Gaps, drags into the keyboard)                                                                                                   |
| kit/007-keyboard-avoiding-view.e2e.ts             | tests/keyboard-avoiding-view.e2e.ts             | retired | 7 → 7                     | android 3/3, ios 1/1 | secure field masked in screenshots                                                                                                                                                      |
| kit/008-modal.e2e.ts                              | tests/modal.e2e.ts                              | retired | 9 → 9                     | android 3/3, ios 0/1 | iOS: unstable; one run stored `ModalKeyboardOpened` without a keyboard (removed)                                                                                                        |
| kit/009-native-stack.e2e.ts                       | tests/native-stack.e2e.ts                       | retired | 4 → 4                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/010-bottom-tab-bar-rotation.e2e.ts            | tests/bottom-tab-bar-rotation.e2e.ts            | retired | 6 → 6                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/011-over-keyboard-view.e2e.ts                 | tests/over-keyboard-view.e2e.ts                 | retired | 6 → 6                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/012-close-keyboard.e2e.ts                     | tests/close-keyboard.e2e.ts                     | retired | 11 → 11                   | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/013-chat-flat-list.e2e.ts                     | tests/chat-flat-list.e2e.ts                     | retired | 4 → 4                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/014-keyboard-background-view.e2e.ts           | tests/keyboard-background-view.e2e.ts           | retired | 3 → 3                     | android 3/3, ios 1/1 |                                                                                                                                                                                         |
| kit/015-keyboard-extender.e2e.ts                  | tests/keyboard-extender.e2e.ts                  | retired | 6 → 6                     | android 3/3, ios 0/1 | iOS: `KeyboardExtenderIsAttached` differed by 0.45% on the run after it was written                                                                                                     |
| kit/016-aware-scroll-view-with-sticky-view.e2e.ts | tests/aware-scroll-view-with-sticky-view.e2e.ts | retired | 4 → 4                     | android 3/3, ios 0/1 | iOS: tests 1-2 pass; test 3 blocked (see Gaps, rows under the keyboard), test 4 follows it                                                                                              |
| kit/017-keyboard-chat-scroll-view.e2e.ts          | tests/keyboard-chat-scroll-view.e2e.ts          | retired | 10 → 10                   | android 0/3, ios 0/1 | Android: the last screenshot differs on every run (see Gaps). iOS: the drag in "should close keyboard interactively" cannot run (see Gaps). `it.todo` is a `test.skip` in its own group |

## Shared helpers (`tests/support/kit.ts`)

| Source                                                                       | e2e                                                                                                                                                     |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| setup-jest.ts `device.launchApp()`                                           | `openHome()`                                                                                                                                            |
| `scrollDownUntilElementIsVisible("main_scroll_view", id)` + `waitAndTap(id)` | `openExample()`                                                                                                                                         |
| `closeKeyboard(id)`                                                          | `closeKeyboard()`                                                                                                                                       |
| `switchToEmojiKeyboard()`                                                    | `switchToEmojiKeyboard()`: the keyboard's Emoji key by label on both platforms; skipped on Android API 28 and below, as Detox did for `e2e_emulator_28` |
| `selectText(id)`                                                             | `selectText()`: iOS double tap; Android a one-second hold through adb                                                                                   |
| `scrollUpUntilElementIsBarelyVisible()`                                      | same name, Detox's stop conditions measured against the keyboard's top                                                                                  |
| element `swipe()` / `scroll()`                                               | `swipeElement()` / `scrollElement()`: Detox's geometry (SwipeHelper.kt) as path swipes                                                                  |
| `typeText` / `replaceText`                                                   | `typeText()` (iOS `pressSequentially`, Android `adb shell input text`, `\n` as Enter) / `replaceText()` (`fill`)                                        |
| `tapBackspaceKey()`                                                          | `tapBackspaceKey()`: Android the DEL key event (as Detox sent), iOS the keyboard's delete key                                                           |
| (new)                                                                        | `hideAndroidKeyboard()`: Back when a keyboard shows, to read a view under it                                                                            |
| asserts `expectBitmapsToBeEqual` / `expectElementBitmapsToBeEqual`           | `expectScreen()` / `expectElement()`: `toHaveScreenshot`, pixelmatch threshold 0.1, same allowed diff                                                   |
| `setDemoMode()`                                                              | none: `toHaveScreenshot` holds the status bar fixed                                                                                                     |
| (new)                                                                        | `tapAtCentre()`: point tap for views agent-device reads as covered                                                                                      |

## Gaps

- **Android test IME.** agent-device switches an emulator to its own headless
  keyboard on every `app.open()` (its `testIme` option, on by default for
  emulators). It draws nothing, so keyboard screenshots lose the keyboard.
  e2e 0.23 does not expose the option; `openHome()` switches back to the
  system keyboard with `adb shell ime set`. With the system keyboard active,
  `pressSequentially` drops keys, so Android typing goes through
  `adb shell input text`.
- **Covered nodes.** agent-device refuses locator taps on nodes it reads as
  covered: views this library draws in or over the keyboard
  (`KeyboardExtender`, `OverKeyboardView`, sticky footers, bottom sheets over
  the keyboard). `tapAtCentre()` taps the point instead.
- **Rows under the keyboard.** A view under the keyboard leaves the
  accessibility tree on both platforms. Android 003 hides the keyboard to
  read one label. iOS 016 test 3 cannot be ported as is: Detox saw
  `TextInput#9` under the keyboard, did not scroll, and compared with the
  first-focus screenshot; e2e cannot see the row, scrolls for it, and the
  focused input then ends at the top of the list, not above the footer.
  That may be library behavior Detox never exercised on this device.
- **iOS accessibility tree.** e2e reads the accessibility tree; Detox read
  the view hierarchy. Accessible wrappers hide their children:
  `example/src/components/KeyboardAnimation/index.tsx` (`TouchableOpacity`:
  001, 002, 008, 009, 010), the Keyboard Extender screen
  (`keyboard_extender.dismiss`: 015), and the bottom sheet modal (exposed as
  one "Bottom Sheet" element: 004 tests 7-8, 017). Those wrappers now have
  `accessible={false}` in the example app.
- **Drags into the keyboard on iOS.** agent-device keeps a gesture above the
  keyboard: its viewport ends at the keyboard's top edge
  (`frameAvoidingKeyboard`), and a path that reaches the keyboard is refused
  ("Gesture trajectory does not fit inside the viewport"). Closing the
  keyboard interactively needs exactly that drag, so 006 tests 3-4 and 017
  from "should close keyboard interactively" on cannot run on iOS. 006 used
  to pass there by accident: Detox's `safeSwipe` swallows errors, and the
  stored screenshot showed the keyboard still open. The helper now rethrows
  on iOS and those screenshots are removed.
- **iOS screenshots were checked by eye** against Detox's iPhone 17 Pro
  baselines (scaled down; the build differs in navigation bar and keyboard
  style, so pixels cannot be compared): 53 of 56 show the same state, and the
  three that did not are removed.
- **Secure fields** are masked in every screenshot (007's Password field).
- **Gesture precision.** One Android checkpoint
  (`KeyboardChatScrollViewAlwaysClosed`) sits ~21 px (Android's touch slop)
  from Detox's after a slow 10% swipe; later checkpoints in the file match.
- **`KeyboardChatScrollViewAlwaysInputGrown` is not stable on Android.**
  After four Enter presses grow the input, the list ends short of where
  Detox's screenshot has it, by a different amount each run. It is not the
  test runner: with e2e detached and the keys sent by
  `adb shell input keyevent KEYCODE_ENTER` alone, four rounds ended 2, 7, 2
  and 5 px short (1.5 s between keys) and one batch of four keys 36 px
  short; inside an e2e session the same batch ended 45 to 113 px short. The
  screen before the first key is identical every time. The list is never
  ahead, only behind, which is the limitation the comment in
  `src/components/KeyboardChatScrollView/useExtraContentPadding/index.ts`
  describes: a scroll event that arrives late leaves the list behind. Detox
  waits for the app to idle around every key and matched at 0.01%. The check
  passed before the example app moved to the native stack. The stored
  screenshot is the one that matches Detox's.
- **`SOFT_CHECK`.** CI sets it for API 31, and 004 then skips two pixel
  checks, so `AwareScrollViewInputChanged` and `AwareScrollViewKeyboardClosed`
  have no `android-31` screenshot. Run that target with `SOFT_CHECK=true`.
- **Screenshot size on iOS.** e2e stores iOS screenshots in points
  (402x874 for iPhone 17 Pro); Detox stored device pixels (1206x2622), so a
  shift of one device pixel no longer shows.
- **`--update-snapshots` can store a frame in flight.** It writes once two
  screenshots in a row match; 016 test 1 on iOS stored a state the app holds
  for under a second. After writing screenshots, run once more without the
  flag and look at any mismatch.
- **iOS 15 is dropped.** Detox ran an iPhone 13 Pro on iOS 15.5. On CI
  agent-device's XCUITest runner fails to build for that simulator
  (`xcodebuild build-for-testing failed`); its deployment target is iOS 15.6
  and the newest iOS 15 simulator is 15.5. The oldest iOS target is now 16.4
  on `main` and 17.5 on pull requests.
- **Untested targets.** `android-28`, `android-31` and `ios-26` ran
  locally; `ios-16`, `ios-17`, `ios-18` and `ios-26e` have not.
- **Android keyboard.** Its top edge comes from the window manager
  (`dumpsys`), so it holds for Gboard (API 31) and the AOSP keyboard (API 28).
- **Screenshots per target and host OS** (`<name>-<target>-<os>.png`). CI
  renders Android on Linux and other iOS versions on other devices, so CI
  needs its own screenshots: run `yarn test-example:<target> --update-snapshots`
  once per CI job, review the images, and commit them.
- **iOS simulator keyboard.** Xcode 27 replaced Simulator.app with DeviceHub;
  `defaults write com.apple.dt.Devices alwaysSimulateHardwareKeyboard -bool NO`
  is needed for a software keyboard (older Xcode:
  `com.apple.iphonesimulator ConnectHardwareKeyboard`, as CI does).

## Next

- Generate CI screenshots for every target in the workflows' matrix.
- iOS: the five failing files.
- Android: the unstable screenshot in 017.
