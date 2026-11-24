# Migrate React Native KeyboardAvoidingView

Use this reference for `KeyboardAvoidingView` imported from `react-native`. The RNKC component intentionally keeps the familiar core API and adds cross-platform animation behavior, `translate-with-padding`, and `automaticOffset`.

Upstream API: https://reactnative.dev/docs/keyboardavoidingview

RNKC API: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view

## Decide whether avoidance is still the right architecture

Do not perform an import swap before classifying the screen:

- Keep `KeyboardAvoidingView` for a bounded screen or panel whose layout should resize, pad, or reposition as a unit.
- Choose `KeyboardAwareScrollView` for a long form where the focused input must be scrolled into view.
- Choose `KeyboardStickyView` when only a footer or composer should move.
- Choose `KeyboardChatScrollView` plus `KeyboardStickyView` for a production chat screen.

If the existing core component wraps a `FlatList`, FlashList, LegendList, or complex chat, migration is an opportunity to select the correct owner rather than preserve a mismatched wrapper.

## Direct API mapping

These props can normally be preserved during an import migration:

| React Native prop             | RNKC prop       | Notes                                              |
| ----------------------------- | --------------- | -------------------------------------------------- |
| `behavior="height"`           | Same            | RNKC animates cross-platform                       |
| `behavior="position"`         | Same            | Preserve `contentContainerStyle`                   |
| `behavior="padding"`          | Same            | Verify nested scroll and flex behavior             |
| `contentContainerStyle`       | Same            | Only applies to `position` behavior                |
| `enabled`                     | Same            | Reassess old platform conditionals after testing   |
| `keyboardVerticalOffset`      | Same by default | Semantics change when `automaticOffset` is enabled |
| `style`, children, View props | Same            | Preserve layout ownership                          |

Basic migration:

```diff
-import { KeyboardAvoidingView } from "react-native";
+import { KeyboardAvoidingView } from "react-native-keyboard-controller";
```

Ensure `KeyboardProvider` is mounted before relying on the component.

## Preserve behavior first

Keep the existing `behavior`, `keyboardVerticalOffset`, structure, and platform conditionals in the first migration pass unless they are the known source of the problem. Verify parity, then simplify obsolete workarounds separately.

For example, do not immediately replace this:

```tsx
behavior={Platform.OS === "ios" ? "padding" : undefined}
```

with unconditional behavior merely because RNKC supports Android. First record why Android was excluded and test the intended RNKC behavior there.

## Adopt `automaticOffset` deliberately

Without `automaticOffset`, `keyboardVerticalOffset` compensates for the component's parent-relative layout, commonly with a navigation header height.

With `automaticOffset`, RNKC measures the actual screen position. `keyboardVerticalOffset` becomes additional spacing rather than header compensation:

```tsx
<KeyboardAvoidingView
  automaticOffset
  behavior="padding"
  keyboardVerticalOffset={12}
  style={{ flex: 1 }}
>
  {/* content */}
</KeyboardAvoidingView>
```

Do not enable it while retaining a full header-height offset without recalculating the desired result; that can double the spacing.

## Choose behavior by layout intent

- `padding`: preserve container size and add bottom padding. Verify content that already has bottom padding or a safe-area inset.
- `height`: shrink the container. Verify `flex`, minimum height, and nested list behavior.
- `position`: move the inner container. Preserve `contentContainerStyle` separately from the outer `style`.
- `translate-with-padding`: use only when its translation model matches the design. It is RNKC-specific and can perform well, but a chat list still needs chat-specific scroll ownership.

## Remove duplicate keyboard ownership

After the RNKC component is verified, remove from the same screen:

- manual keyboard-height padding derived from listeners;
- an outer Reanimated `useAnimatedKeyboard` translation;
- Android-only layout movement that duplicates RNKC;
- a second avoiding view around the same content.

Keep unrelated business listeners and dismissal logic until migrated by their corresponding references.

## Test the migration

- Focus inputs near the top and bottom.
- Open and close with content shorter and taller than the viewport.
- Verify navigation headers, modals, safe areas, and bottom tabs.
- Verify iOS and Android with each preserved behavior.
- Rotate while closed and open.
- Grow a multiline input and switch keyboard types.
- Check navigation away and back when screens stay mounted.

On iOS New Architecture, a React state update immediately before the keyboard event can interfere with Reanimated commits. Check current RNKC troubleshooting and Reanimated feature-flag guidance rather than compensating with timers.
