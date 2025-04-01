---
keywords: [react-native-keyboard-controller, useKeyboardState, react hook]
sidebar_position: 4
---

# useKeyboardState

`useKeyboardState` is a hook which gives an access to current keyboard state.

:::warning
Use this hook only when you need to change props of views that you return from render. If you need to read keyboard state in callbacks/event handlers consider to use [KeyboardController.state()](../../keyboard-controller.md#state) method to get values on demand and avoid unnecessary re-renders.

<div class="code-grid">
<div class="code-block">
```tsx title="✅ Recommended 👍"
<Button
  onPress={() => {
    const state = KeyboardController.state();
    if (state?.height > 0) {
      // ...
    }
  }}
>
  Go to Next Page
</Button>
```
</div>
<div class="code-block">
```tsx title="❌ Not recommended 🙅‍♂️"
const {height} = useKeyboardState();
<Button
  onPress={() => {
    // don't consume `height` from hook
    if (height > 0) {
      // ...
    }
  }}
>
  Go to next Page
</Button>
```
</div>
</div>

:::

## Data structure

## Example

```tsx
import { useKeyboardAnimation } from "react-native-keyboard-controller";

const { height, progress } = useKeyboardAnimation();
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.
