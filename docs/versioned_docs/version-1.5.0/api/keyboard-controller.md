---
sidebar_position: 5
---

# KeyboardController

`KeyboardController` is an object which has two functions:
- `setInputMode` - used to change `windowSoftInputMode` in runtime;
- `setDefaultMode` - used to restore default `windowSoftInputMode` (which is declared in `AndroidManifest.xml`);

## Example

```ts
import {
  KeyboardController,
  AndroidSoftInputModes,
} from "react-native-keyboard-controller";

export const useResizeMode = () => {
  useEffect(() => {
    KeyboardController.setInputMode(
      AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE
    );

    return () => KeyboardController.setDefaultMode();
  }, []);
};
```