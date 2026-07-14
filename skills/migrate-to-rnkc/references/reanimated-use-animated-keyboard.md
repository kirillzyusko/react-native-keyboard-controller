# Migrate Reanimated useAnimatedKeyboard

Use this reference for `useAnimatedKeyboard` and `KeyboardState` imported from `react-native-reanimated`.

Current Reanimated guide: https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedKeyboard/

Reanimated 4 documents the hook as deprecated and recommends RNKC. RNKC provides a compatibility API to make the first migration stage an import change.

## Do not run both keyboard controllers

Do not keep Reanimated `useAnimatedKeyboard` mounted alongside RNKC keyboard animation hooks around the same application. Both take ownership of Android keyboard and inset behavior. Migrate the import or the architecture, then remove the old hook from that scope.

## Phase 1: compatibility import

Prefer the compatibility layer when existing code depends on positive `height` and the `KeyboardState` enum:

```diff
-import { KeyboardState, useAnimatedKeyboard } from "react-native-reanimated";
+import {
+  KeyboardState,
+  useAnimatedKeyboard,
+} from "react-native-keyboard-controller";
```

The RNKC compatibility hook returns:

- `height`: positive physical keyboard height in a Reanimated shared value;
- `state`: `UNKNOWN`, `OPENING`, `OPEN`, `CLOSING`, or `CLOSED`.

Existing expressions such as `translateY: -keyboard.height.value` should normally keep their sign in this phase.

Mount `KeyboardProvider`, verify Android soft-input ownership, and rebuild the native applications.

## Inspect options before import swapping

The RNKC compatibility hook currently takes no options. If the old hook passes options such as status-bar or navigation-bar translucency, move the intended inset policy to `KeyboardProvider`:

```tsx
<KeyboardProvider
  statusBarTranslucent
  navigationBarTranslucent
  preserveEdgeToEdge
>
  <App />
</KeyboardProvider>
```

Do not copy options mechanically. Inspect whether another edge-to-edge library already owns system bars and use the provider props that match the final app policy.

## Phase 2: use native RNKC semantics when useful

Refactor beyond the compatibility layer only when the code benefits from RNKC's native concepts.

### Height and progress animation

```tsx
const { height, progress } = useReanimatedKeyboardAnimation();

const style = useAnimatedStyle(() => ({
  opacity: progress.value,
  transform: [{ translateY: height.value }],
}));
```

Important: `useReanimatedKeyboardAnimation().height` is negative while the keyboard is open. Reanimated and RNKC compatibility `useAnimatedKeyboard().height` are positive physical heights. Convert signs intentionally:

```diff
-const keyboard = useAnimatedKeyboard();
+const { height } = useReanimatedKeyboardAnimation();

 const style = useAnimatedStyle(() => ({
-  transform: [{ translateY: -keyboard.height.value }],
+  transform: [{ translateY: height.value }],
 }));
```

### Lifecycle and per-frame work

Use `useKeyboardHandler` for `onStart`, `onMove`, `onInteractive`, and `onEnd`. Each handler must contain a `"worklet"` directive. Event `height` is a positive physical height, unlike the signed animation hook value.

```tsx
useKeyboardHandler(
  {
    onStart: (event) => {
      "worklet";
      targetHeight.value = event.height;
    },
    onMove: (event) => {
      "worklet";
      currentHeight.value = event.height;
    },
    onEnd: (event) => {
      "worklet";
      isOpen.value = event.height > 0;
    },
  },
  [],
);
```

### Render and business state

- Use `useKeyboardState((state) => state.isVisible)` for React UI that must render visibility.
- Use `KeyboardController.isVisible()` or `.state()` for values read only inside callbacks.
- Keep the compatibility `KeyboardState` enum when animation logic genuinely distinguishes opening and closing phases.

## Prefer prebuilt components

If the old hook only translates a common keyboard layout, replace the handwritten animation with the owning RNKC component:

- whole bounded layout: `KeyboardAvoidingView`;
- fixed footer: `KeyboardStickyView`;
- scrollable form: `KeyboardAwareScrollView`;
- chat: `KeyboardChatScrollView` plus `KeyboardStickyView`.

This removes per-screen keyboard math and is often the more maintainable end state.

## Android lifecycle

Reanimated's old hook changes root and inset behavior while mounted. RNKC hooks commonly set `adjustResize` on mount and restore the default on unmount. In stack navigators that keep screens mounted, use an explicit focus-scoped strategy when only the active screen should own that mode. See the Android soft-input reference.

## Validate

- Compare keyboard-open translations before and after; sign mistakes are immediately visible.
- Exercise opening, closing, interactive dismissal, and keyboard size changes.
- Verify status and navigation bar insets on Android.
- Verify navigation away from and back to mounted screens.
- Test floating and physical keyboards where supported.
- Search for all remaining Reanimated `useAnimatedKeyboard` imports before considering the migration complete.
