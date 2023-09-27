---
keywords: [react-native-keyboard-controller, useKeyboardController, enabled, disabled, setEnabled]
---

# useKeyboardController

`useKeyboardController` is a hook which gives an access to the state of the `react-native-keyboard-controller` library. It return two values:

- `enabled` - boolean value which indicates whether the library is enabled in app;
- `setEnabled` - function that changes state of `enabled` property.

This hook can be handy in situations when your app is relying on default window resizing behavior on Android. Once the module is enabled - it moves the app in [edge-to-edge](https://developer.android.com/training/gestures/edge-to-edge) and prevents window from being resized (works as iOS). However if you need default Android behavior you can disable this module where needed and make a gradual integration of this library into your application.

:::caution Use it only when you really need it
Nonetheless that you can fallback to default Android behavior I still strongly recommend you not to go with this approach just because you'll loose all attractiveness of smooth animated keyboard transitions and your app will not look as great as it possibly can.

Consider to use [KeyboardAvoidingView](../../components/keyboard-avoiding-view.mdx) which also resize the window, but does it with beautiful animated transitions that makes your interactions with app smooth and pleasant.
:::

## Example

```tsx
import { useKeyboardController } from "react-native-keyboard-controller";

const { enabled, setEnabled } = useKeyboardController();

setEnabled(false);
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.

## Using with class component

```tsx
import {
  KeyboardController,
  KeyboardContext,
  AndroidSoftInputModes,
} from "react-native-keyboard-controller";

class KeyboardAnimation extends React.PureComponent {
  // 1. use context value
  static contextType = KeyboardContext;

  componentDidMount() {
    // 2. get an access to `enabled` and `setEnabled` props
    const { enabled, setEnabled } = this.context;

    // 3. disable a module on demand in your app
    setEnabled(false);
  }
}
```
