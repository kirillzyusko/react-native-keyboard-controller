# Migrate Keyboard.addListener and Manual Keyboard State

Use this reference for React Native `Keyboard.addListener`, `Keyboard.metrics`, `Keyboard.isVisible`, `Keyboard.scheduleLayoutAnimation`, manual keyboard-height state, and event-driven padding or translations.

Upstream API: https://reactnative.dev/docs/keyboard.html

RNKC events: https://kirillzyusko.github.io/react-native-keyboard-controller/docs/api/keyboard-events

## Classify each listener by intent

Do not map all listeners to `KeyboardEvents`. Choose the narrowest API:

| Intent                                                            | RNKC API                                                   |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Business side effect at show or hide boundary                     | `KeyboardEvents.addListener`                               |
| Render visibility, appearance, type, or another scalar            | `useKeyboardState(selector)`                               |
| Read latest values only when a callback runs                      | `KeyboardController.isVisible()` or `.state()`             |
| Animate a common layout                                           | Prebuilt RNKC component                                    |
| Drive Animated or Reanimated styles                               | `useKeyboardAnimation` or `useReanimatedKeyboardAnimation` |
| Handle start, movement, interactive movement, or end on UI thread | `useKeyboardHandler`                                       |
| Dismiss and optionally await completion                           | `KeyboardController.dismiss()`                             |

## Map show and hide events

RNKC exposes these four events on both platforms:

- `keyboardWillShow`
- `keyboardDidShow`
- `keyboardWillHide`
- `keyboardDidHide`

```tsx
useEffect(() => {
  const subscription = KeyboardEvents.addListener(
    "keyboardDidHide",
    onKeyboardDidHide,
  );

  return () => subscription.remove();
}, [onKeyboardDidHide]);
```

Always remove subscriptions. Preserve callback dependencies and avoid duplicate global listeners after migration.

## Handle unsupported frame-change event names

React Native also exposes `keyboardWillChangeFrame` and `keyboardDidChangeFrame`; RNKC `KeyboardEvents` does not expose those names. Determine the actual need:

- If code needs per-frame position, use `useKeyboardHandler.onMove` or `onInteractive`.
- If code needs destination metrics before movement, use `onStart`.
- If code needs final metrics, use `onEnd`.
- If code only used change-frame events as an iOS workaround for show/hide, replace them with the cross-platform RNKC will/did events and verify.

Do not silently drop frame-change behavior.

## Remove React state from per-frame UI

Avoid this pattern:

```tsx
const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
  const show = Keyboard.addListener("keyboardWillShow", (event) => {
    setKeyboardHeight(event.endCoordinates.height);
  });
  const hide = Keyboard.addListener("keyboardWillHide", () => {
    setKeyboardHeight(0);
  });

  return () => {
    show.remove();
    hide.remove();
  };
}, []);
```

Choose the owner instead:

- `KeyboardStickyView` for a footer;
- `KeyboardAvoidingView` for a bounded screen;
- `KeyboardAwareScrollView` for a form;
- `KeyboardChatScrollView` for chat;
- animation hooks for genuinely custom UI.

## Replace callback-only subscriptions

When a listener or hook exists only so a button callback can inspect keyboard state, remove the subscription:

```tsx
const onContinue = () => {
  if (KeyboardController.isVisible()) {
    // ...
  }
};
```

Use `KeyboardController.state()` for the latest `height`, `duration`, `timestamp`, `target`, `type`, and `appearance`.

## Replace layout animation scheduling

Do not mechanically reproduce `Keyboard.scheduleLayoutAnimation(event)` with JS timers or `LayoutAnimation`. Prefer a native-driven RNKC component or animation value. If the old code animates a non-UI property and needs intermediate iOS frames, use `useKeyboardHandler` rather than relying only on the high-level progress shared value.

## Dismissal

`KeyboardController.dismiss()` removes focus by default and resolves when the keyboard is hidden. It also supports:

```tsx
await KeyboardController.dismiss({ keepFocus: true });
await KeyboardController.dismiss({ animated: false });
```

Do not replace `Keyboard.dismiss()` everywhere without a reason. Prefer the controller when the code needs custom-input support, completion awaiting, focus retention, or non-animated dismissal.

## Event data differences

RNKC event data exposes `height` directly rather than React Native's `endCoordinates.height`, and also includes `duration`, `timestamp`, `target`, `type`, and `appearance`. Update consumer code explicitly and verify units and timing.

## Validate

- Verify each side effect fires once at the intended will or did boundary.
- Verify listener cleanup on unmount and navigation changes.
- Verify no React render loop occurs during keyboard movement.
- Verify custom animations remain synchronized during interactive dismissal.
- Verify Android will events now exposed by RNKC do not trigger logic twice through an existing fallback.
- Verify dismissal, focus, and awaited completion semantics.
