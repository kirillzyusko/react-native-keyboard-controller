---
keywords: [react-native-keyboard-controller, useKeyboardController, enabled, disabled, setEnabled]
---

# useKeyboardController

`useKeyboardController` is a hook which gives an access to the state of the `react-native-keyboard-controller` library. It return two values:

- `enabled` - boolean value which indicates whether the library is enabled in app;
- `setEnabled` - function that changes state of `enabled` property.

## Example

```tsx
import { useKeyboardController } from "react-native-keyboard-controller";

const { enabled, setEnabled } = useKeyboardController();
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
  }
}
```
