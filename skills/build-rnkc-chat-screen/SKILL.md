---
name: build-rnkc-chat-screen
description: Build, migrate, or review production React Native chat keyboard layouts with React Native Keyboard Controller. Use when implementing KeyboardChatScrollView, KeyboardStickyView composers, KeyboardGestureArea interactive dismissal, FlatList, FlashList, LegendList or custom virtualized-list adapters, inverted chats, safe-area or tab offsets, growing multiline inputs, emoji or bottom-sheet transitions, freeze behavior, keyboardLiftBehavior, jump-to-latest UI, AI streaming blankSpace, keyboard translucency, or chat keyboard troubleshooting and performance.
license: MIT
metadata:
  author: kirillzyusko
  source: react-native-keyboard-controller
---

# Build an RNKC Chat Screen

Treat chat as a coordinated scroll, composer, gesture, and keyboard system. Do not assemble it from a general-purpose avoiding view plus ad hoc event listeners.

## Inspect the product and existing screen

1. Identify the message list implementation and its ref contract.
2. Determine whether the list is inverted and how it maintains the latest-message position.
3. Locate the composer, safe-area ownership, bottom tabs, fixed margins, and multiline height behavior.
4. Define interactive dismissal behavior on iOS and Android.
5. Choose how messages should lift when the keyboard opens.
6. Identify emoji pickers, attachment sheets, voice panels, or other keyboard replacements.
7. Identify AI streaming or anchor-to-top behavior.
8. Record Reanimated, React Native, and architecture versions before applying troubleshooting flags.

## Read the relevant references

- Start with [references/layout-recipes.md](references/layout-recipes.md) for the base component tree, offsets, and lift behavior.
- Read [references/virtualized-lists.md](references/virtualized-lists.md) for `FlatList`, FlashList, LegendList, inversion, stable wrappers, and refs.
- Read [references/advanced-behaviors.md](references/advanced-behaviors.md) for multiline composers, custom panels, AI streaming, jump-to-latest, and visual keyboard treatment.
- Read [references/troubleshooting-and-validation.md](references/troubleshooting-and-validation.md) before applying feature flags, runtime workarounds, or declaring completion.

## Establish one owner per layer

Use this default architecture:

```text
KeyboardGestureArea        owns interactive keyboard gestures and optional input offset
  KeyboardChatScrollView   owns message scroll range and keyboard-driven repositioning
  KeyboardStickyView       owns composer translation
    TextInput              owns focus and text entry
```

The list may render through `KeyboardChatScrollView` as a custom scroll component, but it remains the virtualization owner. `KeyboardChatScrollView` owns keyboard-related inset and position changes.

## Choose product semantics explicitly

Select `keyboardLiftBehavior` from product behavior, not personal preference:

- `always`: keep bottom content visible regardless of current position.
- `whenAtEnd`: lift only when latest content is visible.
- `persistent`: lift on open and keep the resulting position after close.
- `never`: allow the keyboard to overlap without moving messages.

Choose and document the reason. Preserve an existing chat's scroll semantics during migration.

## Add complexity only when required

- Add `KeyboardGestureArea` for interactive dismissal or associated input offset.
- Add `extraContentPadding` only when external content such as a multiline composer changes height.
- Add `freeze` only for transitions where keyboard-driven layout must pause.
- Add `blankSpace` only for a minimum scroll-space floor such as AI response streaming.
- Add `onEndVisible` for jump-to-latest or UI-thread end-state effects.
- Add `onContentInsetChange` when a list needs RNKC's effective Android inset for its own calculations.
- Add `applyWorkaroundForContentInsetHitTestBug` only when the specific upstream iOS issue is reproduced.

## Reject common chat mistakes

- Do not wrap the chat list in `KeyboardAvoidingView` or `KeyboardAwareScrollView` as the primary keyboard owner.
- Do not apply keyboard height as React state padding while `KeyboardChatScrollView` also manages insets.
- Do not let iOS automatic content inset adjustment compete with the chat scroll component.
- Do not forget to propagate `inverted` to both the list and `KeyboardChatScrollView`.
- Do not create a new `renderScrollComponent` function every render.
- Do not call the list's `scrollToEnd` when its calculation ignores RNKC's active inset; use the underlying chat scroll ref when affected.
- Do not enable Reanimated flags or Objective-C runtime workarounds without matching the documented version and symptom.

## Implement in layers

1. Make the simplest non-virtualized or existing-list chat work with a sticky composer.
2. Add interactive dismissal and correct ID wiring.
3. Add safe-area and fixed-element offsets.
4. Add the virtualized-list adapter and ref ownership.
5. Add multiline padding, custom-panel freeze, or AI blank space as required.
6. Add visual effects after layout behavior is stable.
7. Test iOS and Android throughout; do not defer all validation until the complete composition exists.

## Deliver an explainable result

When advising, return the component tree, list adapter, offset formula, lift behavior, advanced props, platform caveats, and test plan. When implementing, preserve application-specific message state, rendering, send logic, styling, and navigation unless they block the keyboard architecture.
