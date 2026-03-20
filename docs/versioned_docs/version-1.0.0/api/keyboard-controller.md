# KeyboardController

`KeyboardController` is an object which has two functions:

- `setInputMode` - used to change `windowSoftInputMode` in runtime;
- `setDefaultMode` - used to restore default `windowSoftInputMode` (which is declared in `AndroidManifest.xml`);

:::tip Understanding how different modes works
To understand the difference between `adjustResize`/`adjustPan`/`adjustNothing` behavior you can look into this [post](https://stackoverflow.com/a/71301500/9272042).
:::

:::info
A combination of `adjustResize` + `edge-to-edge` mode will result in behavior similar to `adjustNothing` - in this case window is not resized automatically and content is not moved along with the keyboard position. And it becomes a responsibility of developer to handle keyboard appearance (thus it'll match iOS behavior).
:::

## Example

```ts
import {
  KeyboardController,
  AndroidSoftInputModes,
} from "react-native-keyboard-controller";

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};
```
