# useReanimatedKeyboardAnimation

`useReanimatedKeyboardAnimation` is a hook which gives access to two reanimated values:

* `height` - value which changes between **0** and **keyboardHeight**;
* `progress` - value which changes between **0** (keyboard closed) and **1** (keyboard opened).

## Example[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-reanimated-keyboard-animation.md#example "Direct link to Example")

```
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";

const { height, progress } = useReanimatedKeyboardAnimation();
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.

## Using with class component[​](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-reanimated-keyboard-animation.md#using-with-class-component "Direct link to Using with class component")

```
import {
  KeyboardController,
  KeyboardContext,
  AndroidSoftInputModes,
} from "react-native-keyboard-controller";

class KeyboardAnimation extends React.PureComponent {
  // 1. use context value
  static contextType = KeyboardContext;

  componentDidMount() {
    // 2. set input mode for android to `adjustResize`
    // (can be omitted if you already have `adjustResize` in `AndroidManifest.xml`)
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
    );
  }

  componentWillUnmount() {
    // 2. return to default input mode (for Android)
    // in order not to break other part of your app
    KeyboardController.setDefaultMode();
  }

  render() {
    // 3. consume reanimated values 😊
    const { reanimated } = this.context;
  }
}
```
