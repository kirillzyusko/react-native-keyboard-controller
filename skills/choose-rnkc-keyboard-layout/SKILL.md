---
name: choose-rnkc-keyboard-layout
description: Inspect a React Native screen and choose the correct React Native Keyboard Controller components, hooks, and composition. Use when deciding between KeyboardAvoidingView, KeyboardAwareScrollView, KeyboardStickyView, KeyboardChatScrollView, KeyboardToolbar, KeyboardGestureArea, OverKeyboardView, KeyboardExtender, KeyboardBackgroundView, KeyboardEffects, keyboard animation hooks, or keyboard state APIs; when keyboard handling is missing, duplicated, or structurally wrong; or when an LLM is unsure how to design a form, chat, sticky footer, accessory, overlay, interactive dismissal, or keyboard-themed experience.
license: MIT
metadata:
  author: kirillzyusko
  source: react-native-keyboard-controller
---

# Choose an RNKC Keyboard Layout

Choose the smallest composition that owns the screen's actual keyboard behavior. Inspect the app code before recommending or editing it. Do not select a component only because its name resembles an existing React Native component.

## Inspect before choosing

1. Locate the screen root, inputs, scroll owner, fixed footer or composer, navigation wrapper, safe-area handling, modal or bottom-sheet container, and current keyboard code.
2. Record whether the screen is a fixed form, scrollable form, chat, sticky action area, keyboard accessory, overlay, keyboard extension, or custom animation.
3. Determine whether the scroll owner is `ScrollView`, `FlatList`, `SectionList`, FlashList, LegendList, a bottom-sheet scrollable, or a custom native view.
4. Determine whether the product needs interactive dismissal, input navigation, multiline growth, custom panels, AI streaming space, or keyboard visual effects.
5. Check both iOS and Android expectations, the installed RNKC version, `KeyboardProvider`, Reanimated, navigation, and Android soft-input ownership.

Read [references/component-catalog.md](references/component-catalog.md) for component and hook selection. Read [references/inspection-and-validation.md](references/inspection-and-validation.md) for integration constraints and the verification matrix.

## Choose by layout ownership

- Use `KeyboardAvoidingView` when one bounded layout should resize, pad, or reposition as a unit.
- Use `KeyboardAwareScrollView` when a scrollable form must reveal the focused input or caret.
- Use `KeyboardStickyView` when only a footer, composer, action button, or toolbar should translate with the keyboard.
- Use `KeyboardChatScrollView` for chat message scrolling. Pair it with `KeyboardStickyView` for the composer. Invoke `$build-rnkc-chat-screen` for production chat work.
- Use `KeyboardToolbar` for previous, next, and done controls. It can accompany a form component; it does not replace keyboard avoidance.
- Use `KeyboardGestureArea` with an interactive scroll view when gestures must control keyboard dismissal or an iOS offset must be tied to specific inputs.
- Use `OverKeyboardView` when content must appear above the keyboard without closing it.
- Use `KeyboardExtender` when non-input content should become part of the keyboard surface.
- Use `KeyboardBackgroundView` to mirror the system keyboard background inside app UI.
- Use `KeyboardEffects` to render content behind the keyboard, including opaque or animated iOS keyboard backdrops.
- Use hooks only when prebuilt components do not own the required behavior.

## Prefer compositions over replacements

A screen often needs more than one component because each owns a different layer:

```tsx
<KeyboardGestureArea
  interpolator="ios"
  textInputNativeID="composer"
  style={{ flex: 1 }}
>
  <KeyboardChatScrollView keyboardDismissMode="interactive">
    <Messages />
  </KeyboardChatScrollView>
  <KeyboardStickyView>
    <TextInput nativeID="composer" />
  </KeyboardStickyView>
</KeyboardGestureArea>
```

Do not stack two owners for the same responsibility. Avoid combining RN `KeyboardAvoidingView`, a third-party aware scroll view, Reanimated `useAnimatedKeyboard`, and RNKC avoidance around the same content.

## Reject common mismatches

- Do not default to `KeyboardAvoidingView` for a production chat list; use the chat-specific component.
- Do not use `KeyboardAwareScrollView` only to move a fixed footer; use `KeyboardStickyView`.
- Do not place another `TextInput` inside `KeyboardExtender`.
- Do not use `OverKeyboardView` when the content should participate in layout or scroll with the screen.
- Do not use `useKeyboardState` to animate styles; use native-driven animation values.
- Do not subscribe to the complete keyboard state when one selector is enough; invoke `$prefer-rnkc-keyboard-selectors` when reviewing state usage.
- Do not add `KeyboardProvider` solely for `OverKeyboardView`; that component can operate independently. Check provider requirements for the rest of the selected composition.

## Produce an actionable answer

When the user asks for advice, return:

1. The recommended component tree.
2. The responsibility of each selected component.
3. Critical props, offsets, and refs.
4. Rejected alternatives and the concrete mismatch.
5. Platform and integration caveats.
6. A minimal implementation skeleton and a verification plan.

When the user asks for implementation, make the smallest screen-local change that establishes one clear keyboard owner. Preserve unrelated design, state, and navigation code.

## Verify the result

Test the relevant combination of keyboard open, close, focus change, multiline growth, interactive dismissal, rotation, safe areas, navigation headers, bottom tabs, modals, and physical or floating keyboards. Treat environment-only build failures separately from behavioral conclusions.
