# KeyboardEvents

This library exposes 4 events which are available on all platforms:

* `keyboardWillShow` - emitted when the keyboard is about to appear.
* `keyboardWillHide` - emitted when the keyboard is about to disappear.
* `keyboardDidShow` - emitted when the keyboard has completed its animation and is fully visible on the screen.
* `keyboardDidHide` - emitted when the keyboard has completed its animation and is fully hidden.

## Event structure[​](/react-native-keyboard-controller/docs/api/keyboard-events.md#event-structure "Direct link to Event structure")

All events have following properties:

```
type KeyboardEventData = {
  height: number; // height of the keyboard
  duration: number; // duration of the animation
  timestamp: number; // timestamp of the event from native thread
  target: number; // tag of the focused TextInput
  type: string; // `keyboardType` property from focused `TextInput`
  appearance: string; // `keyboardAppearance` property from focused `TextInput`
};
```

## Example[​](/react-native-keyboard-controller/docs/api/keyboard-events.md#example "Direct link to Example")

```
import { KeyboardEvents } from "react-native-keyboard-controller";

useEffect(() => {
  const show = KeyboardEvents.addListener("keyboardWillShow", (e) => {
    // place your code here
  });

  return () => {
    show.remove();
  };
}, []);
```

Also have a look on [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app for more comprehensive usage.
