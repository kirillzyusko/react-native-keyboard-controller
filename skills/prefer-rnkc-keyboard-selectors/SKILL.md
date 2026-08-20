---
name: prefer-rnkc-keyboard-selectors
description: Review, write, or refactor React Native Keyboard Controller state consumption so useKeyboardState uses narrow selectors and avoids unnecessary React renders. Use when code calls useKeyboardState without a selector, destructures the entire keyboard state, reads hook state only inside callbacks, drives styles from keyboard state, creates object or array selector results, or reports keyboard-related re-render and performance problems.
license: MIT
metadata:
  author: kirillzyusko
  source: react-native-keyboard-controller
---

# Prefer RNKC Keyboard Selectors

Use the smallest state subscription that matches how the value is consumed. Inspect the installed `react-native-keyboard-controller` source when behavior may differ by version.

## Audit the usage

1. Find every `useKeyboardState` call in the requested scope.
2. Classify each value as render state, event-time state, animated state, or debugging state.
3. Refactor only the keyboard-state ownership. Preserve unrelated component behavior.
4. Verify render behavior and the keyboard interaction that consumes the value.

## Apply the decision table

| Need                                                  | Use                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Render a boolean, label, theme, type, or other scalar | `useKeyboardState((state) => state.field)`                                           |
| Render a derived boolean or scalar                    | A selector returning that primitive                                                  |
| Read the latest value only when a callback runs       | `KeyboardController.isVisible()` or `KeyboardController.state()` inside the callback |
| Animate a style with keyboard position                | `useKeyboardAnimation()` or `useReanimatedKeyboardAnimation()`                       |
| Process start, move, interactive, or end frames       | `useKeyboardHandler()`                                                               |
| Display the complete state in a dedicated debug view  | `useKeyboardState()` is acceptable                                                   |

## Prefer scalar selectors

```tsx
// Avoid: every keyboard state object update reaches this component.
const { isVisible } = useKeyboardState();

// Prefer: unchanged booleans are filtered by React state equality.
const isVisible = useKeyboardState((state) => state.isVisible);
```

Return a primitive or an existing stable reference. The hook does not accept a custom equality function, so a fresh object or array is considered changed:

```tsx
// Avoid: creates a new object for every relevant keyboard event.
const keyboard = useKeyboardState((state) => ({
  isVisible: state.isVisible,
  appearance: state.appearance,
}));

// Prefer when both fields are independently rendered.
const isVisible = useKeyboardState((state) => state.isVisible);
const appearance = useKeyboardState((state) => state.appearance);

// Prefer when the UI needs only one derived result.
const showDarkBackdrop = useKeyboardState(
  (state) => state.isVisible && state.appearance === "dark",
);
```

Do not add `useMemo` around the returned value to repair an over-broad subscription; narrow the selector instead.

## Read callback-only state imperatively

```tsx
// Avoid: subscribes and re-renders only to read the value on press.
const isVisible = useKeyboardState((state) => state.isVisible);

const onPress = () => {
  if (isVisible) {
    // ...
  }
};

// Prefer: read the latest value when the callback runs.
const onPress = () => {
  if (KeyboardController.isVisible()) {
    // ...
  }
};
```

Use `KeyboardController.state()` for event-time `height`, `duration`, `timestamp`, `target`, `type`, or `appearance` values.

## Keep animations off the React render path

Do not update ordinary React styles from `useKeyboardState().height`. Use native-driven values:

```tsx
const { height } = useReanimatedKeyboardAnimation();

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: height.value }],
}));
```

`useReanimatedKeyboardAnimation().height` is a signed translation value and is negative while the keyboard is open. Do not negate it unless the intended movement requires the opposite direction. The compatibility `useAnimatedKeyboard()` API exposes a positive keyboard height, so verify which hook the code uses before changing signs.

## Keep selectors pure and stable in meaning

The current hook installs its event subscriptions once. Avoid selectors whose meaning depends on changing props or mutable values:

```tsx
// Avoid: expectedType can change while the subscribed selector still captures an old value.
const matches = useKeyboardState((state) => state.type === expectedType);

// Prefer: subscribe to package state, then combine with component state.
const keyboardType = useKeyboardState((state) => state.type);
const matches = keyboardType === expectedType;
```

Place the subscription in the lowest component that renders the value. Do not lift keyboard state to a navigator or app root unless that layer actually owns the decision.

## Verify the refactor

- Confirm no selector returns a fresh object or array without a deliberate reason.
- Confirm callback-only reads no longer create subscriptions.
- Confirm keyboard-driven styles use Animated, Reanimated, or worklet handlers.
- Exercise keyboard show, hide, type, and appearance changes used by the component.
- Use React Profiler or a temporary render counter when the task is specifically about re-renders.
