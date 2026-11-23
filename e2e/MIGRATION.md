# Migration to e2e

Source: Detox, `e2e/kit/**/*.e2e.ts` (guide: https://e2e.com/docs/migrate/detox.md, engine: https://e2e.com/docs/mobile.md)
e2e: `e2e/e2e.config.ts`, tests `e2e/tests/**/*.e2e.ts`
Build: `yarn build-example:android` / `yarn build-example:ios` in `e2e/` (plain release builds; no Detox framework)
Run old: removed (Detox is retired in the same change)
Run new: `yarn test-example:<target>` in `e2e/`, targets `android-28`, `android-31`, `ios-15`, `ios-16`, `ios-17`, `ios-18`, `ios-26`, `ios-26e` (Node 24.8+ or 22.22.3+)
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
7 of 17 files pass and 10 are blocked as noted per row.

Stored screenshots exist for `android-31` (emulator, API 31, Google APIs,
arm64, Pixel 2 profile) and `ios-26` (iPhone 17 Pro, iOS 26.2, Xcode 27),
both written on macOS. Of the 62 Android screenshots, 55 match Detox's CI
baselines for `e2e_emulator_31` within 0.1%, six differ only in the masked
Password field, and one by a gesture offset; see Gaps.

| Source                                            | e2e                                             | Status  | Assertions (source → e2e) | Passing              | Notes                                                                                                                                                                     |
| ------------------------------------------------- | ----------------------------------------------- | ------- | ------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| kit/001-keyboard-animation.e2e.ts                 | tests/keyboard-animation.e2e.ts                 | retired | 4 → 4                     | android 3/3, ios 0/1 | iOS: input hidden from the accessibility tree                                                                                                                             |
| kit/002-enabled-disabled.e2e.ts                   | tests/enabled-disabled.e2e.ts                   | retired | 5 → 5                     | android 3/3, ios 0/1 | iOS: same                                                                                                                                                                 |
| kit/003-input-handlers.e2e.ts                     | tests/input-handlers.e2e.ts                     | retired | 19 → 19                   | android 3/3, ios 1/1 | Android: the keyboard is hidden (Back) before reading `original_selection_text_start_end`, which sits under it                                                            |
| kit/004-aware-scroll-view.e2e.ts                  | tests/aware-scroll-view.e2e.ts                  | retired | 13 → 15                   | android 3/3, ios 0/1 | iOS: tests 1-6 pass; 7-8 need the bottom sheet's buttons (see Gaps). Detox failed 5/8 locally                                                                             |
| kit/005-keyboard-toolbar.e2e.ts                   | tests/keyboard-toolbar.e2e.ts                   | retired | 19 → 19                   | android 3/3, ios 0/1 | iOS: `TextInput#1` not focused after the AutoFill sheet closes (unexplained)                                                                                              |
| kit/006-interactive-keyboard.e2e.ts               | tests/interactive-keyboard.e2e.ts               | retired | 3 → 3                     | android 3/3, ios 1/1 |                                                                                                                                                                           |
| kit/007-keyboard-avoiding-view.e2e.ts             | tests/keyboard-avoiding-view.e2e.ts             | retired | 7 → 7                     | android 3/3, ios 1/1 | secure field masked in screenshots                                                                                                                                        |
| kit/008-modal.e2e.ts                              | tests/modal.e2e.ts                              | retired | 9 → 9                     | android 3/3, ios 0/1 | iOS: input hidden from the accessibility tree                                                                                                                             |
| kit/009-native-stack.e2e.ts                       | tests/native-stack.e2e.ts                       | retired | 4 → 4                     | android 3/3, ios 0/1 | iOS: same                                                                                                                                                                 |
| kit/010-bottom-tab-bar-rotation.e2e.ts            | tests/bottom-tab-bar-rotation.e2e.ts            | retired | 6 → 6                     | android 3/3, ios 0/1 | iOS: same                                                                                                                                                                 |
| kit/011-over-keyboard-view.e2e.ts                 | tests/over-keyboard-view.e2e.ts                 | retired | 6 → 6                     | android 3/3, ios 1/1 |                                                                                                                                                                           |
| kit/012-close-keyboard.e2e.ts                     | tests/close-keyboard.e2e.ts                     | retired | 11 → 11                   | android 3/3, ios 1/1 |                                                                                                                                                                           |
| kit/013-chat-flat-list.e2e.ts                     | tests/chat-flat-list.e2e.ts                     | retired | 4 → 4                     | android 3/3, ios 1/1 |                                                                                                                                                                           |
| kit/014-keyboard-background-view.e2e.ts           | tests/keyboard-background-view.e2e.ts           | retired | 3 → 3                     | android 3/3, ios 1/1 |                                                                                                                                                                           |
| kit/015-keyboard-extender.e2e.ts                  | tests/keyboard-extender.e2e.ts                  | retired | 6 → 6                     | android 3/3, ios 0/1 | iOS: inputs hidden from the accessibility tree                                                                                                                            |
| kit/016-aware-scroll-view-with-sticky-view.e2e.ts | tests/aware-scroll-view-with-sticky-view.e2e.ts | retired | 4 → 4                     | android 3/3, ios 0/1 | iOS: tests 1-2 pass; test 3 blocked (see Gaps, rows under the keyboard), test 4 follows it                                                                                |
| kit/017-keyboard-chat-scroll-view.e2e.ts          | tests/keyboard-chat-scroll-view.e2e.ts          | retired | 10 → 10                   | android 0/3, ios 0/1 | Android: the last screenshot differs on every run (see Gaps). iOS: bottom sheet's buttons hidden from the accessibility tree. `it.todo` is a `test.skip` in its own group |

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
  one "Bottom Sheet" element: 004 tests 7-8, 017). Proposed app change, not
  made: `accessible={false}` on those wrappers.
- **Secure fields** are masked in every screenshot (007's Password field).
- **Gesture precision.** One Android checkpoint
  (`KeyboardChatScrollViewAlwaysClosed`) sits ~21 px (Android's touch slop)
  from Detox's after a slow 10% swipe; later checkpoints in the file match.
- **`KeyboardChatScrollViewAlwaysInputGrown` is not stable on Android.**
  Since the chat playground changed on `main`, the list ends tens of pixels
  apart from run to run after four Enter presses grow the input. The stored
  screenshot is the one two runs agreed on, which is also Detox's. Waiting for the input's bounds between presses did not
  help; the cause is not known.
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
- **Untested targets.** Only `android-31` and `ios-26` ran. `android-28`
  uses the AOSP keyboard, where `keyboardTop()` (Gboard's view ids) falls
  back to the screen bottom.
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
- Decide on the `accessible={false}` app change to unblock iOS.
