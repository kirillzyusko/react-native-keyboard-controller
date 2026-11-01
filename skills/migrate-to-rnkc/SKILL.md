---
name: migrate-to-rnkc
description: Audit and migrate React Native keyboard handling to react-native-keyboard-controller while preserving layout, focus, animation, events, insets, navigation lifecycle, and platform behavior. Use when replacing React Native KeyboardAvoidingView, react-native-keyboard-aware-scroll-view, Reanimated useAnimatedKeyboard, InputAccessoryView, Keyboard.addListener logic, manual keyboard-height state, Android windowSoftInputMode or softwareKeyboardLayoutMode handling, or a mixture of competing keyboard solutions; also use when an LLM should make RNKC the default architecture for a keyboard-heavy screen.
license: MIT
metadata:
  author: kirillzyusko
  source: react-native-keyboard-controller
---

# Migrate to React Native Keyboard Controller

Migrate one keyboard responsibility at a time. Establish the current behavior before removing it, then choose the RNKC API that directly owns that behavior. Inspect the installed package source and types when the application version differs from current documentation.

## Route to the relevant references

Always read [references/setup-and-strategy.md](references/setup-and-strategy.md). Then read only the references matching code found in the application:

- React Native `KeyboardAvoidingView`: [references/keyboard-avoiding-view.md](references/keyboard-avoiding-view.md)
- `react-native-keyboard-aware-scroll-view`: [references/keyboard-aware-scroll-view.md](references/keyboard-aware-scroll-view.md)
- Reanimated `useAnimatedKeyboard`: [references/reanimated-use-animated-keyboard.md](references/reanimated-use-animated-keyboard.md)
- React Native `InputAccessoryView`: [references/input-accessory-view.md](references/input-accessory-view.md)
- React Native `Keyboard.addListener` or manual keyboard state: [references/keyboard-events.md](references/keyboard-events.md)
- Android manifest, Expo `softwareKeyboardLayoutMode`, or imperative soft-input changes: [references/android-soft-input-mode.md](references/android-soft-input-mode.md)

Invoke `$choose-rnkc-keyboard-layout` when the correct target architecture is unclear. Invoke `$build-rnkc-chat-screen` for a chat viewport and `$prefer-rnkc-keyboard-selectors` when the migration introduces or reviews `useKeyboardState`.

## Inventory the existing behavior

Search imports, wrappers, hooks, manifests, Expo config, navigation lifecycle, and list adapters. Record:

- which layer changes layout;
- which layer owns scrolling;
- which layer translates a footer or composer;
- whether keyboard events drive business logic or per-frame UI;
- whether the implementation changes window insets or soft-input mode;
- whether keyboard handling is global, screen-scoped, or focus-scoped;
- what iOS and Android currently do differently;
- which known workaround or product invariant each unusual prop preserves.

Do not infer behavior from an import alone. Read wrapper implementations and prop spreads.

## Choose the RNKC target

Prefer prebuilt components before low-level hooks:

1. Scrollable form: `KeyboardAwareScrollView`.
2. Bounded form or panel: RNKC `KeyboardAvoidingView`.
3. Fixed footer or composer: `KeyboardStickyView`.
4. Chat: `KeyboardChatScrollView` plus `KeyboardStickyView`.
5. Previous, next, and done controls: `KeyboardToolbar`.
6. Interactive dismissal: `KeyboardGestureArea` plus an interactive scroll owner.
7. Keyboard accessory content: choose `KeyboardToolbar`, `KeyboardStickyView`, `KeyboardExtender`, or `OverKeyboardView` by ownership.
8. Reanimated compatibility: RNKC `useAnimatedKeyboard` first; native RNKC hooks when intentionally refactoring semantics.
9. Render state: `useKeyboardState` with a selector.
10. Event-time state: `KeyboardController.state()` or `.isVisible()`.
11. Per-frame UI: `useKeyboardAnimation`, `useReanimatedKeyboardAnimation`, or `useKeyboardHandler`.

## Sequence the migration

1. Add and verify the RNKC installation and provider boundary.
2. Establish Android soft-input ownership.
3. Migrate one screen or shared primitive.
4. Remove the replaced keyboard owner from that scope.
5. Run type checks and focused behavior tests on iOS and Android.
6. Repeat for the next scope.
7. Remove the old dependency only after no imports, wrappers, native config, patches, or test assumptions remain.

Avoid running RNKC and Reanimated `useAnimatedKeyboard`, two avoiding views, or two keyboard-aware scroll owners around the same screen during the final state.

## Preserve behavior, not obsolete mechanics

Map the product intent rather than mechanically copying every workaround. For example:

- Preserve “focused input stays 24 px above the keyboard,” not an old delay timer that approximated it.
- Preserve “chat remains still when opening emoji picker,” using `freeze`, not a chain of keyboard event state updates.
- Preserve “only the focused screen owns `adjustResize`,” using navigation focus lifecycle, not mount lifecycle in a stack that keeps screens mounted.
- Preserve “toolbar callback tracks and then moves focus,” without adding `preventDefault()`.

Document any old behavior that has no direct RNKC equivalent and implement an explicit application-level replacement only if the product still needs it.

## Validate the final owner graph

At completion, be able to name exactly one owner for each responsibility: screen avoidance, focused-input scrolling, composer translation, chat repositioning, keyboard events, animation values, and Android soft-input mode. Verify show, hide, focus changes, navigation, rotation, multiline input, interactive dismissal, safe areas, bottom tabs, modals, and relevant keyboard variants.

Report removed dependencies and configuration separately from behavioral changes. Do not claim parity when only one platform was exercised.
