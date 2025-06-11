# Building own hook

Default hooks may not perfectly fit in your app, because it changes/restores `softInputMode` on mount/unmount of the component where it's used.

info

This is `useResizeMode` hook behavior - it changes `softInputMode` on mount to `adjustResize` and to default `softInput` on unmount. You may want to [read](/react-native-keyboard-controller/docs/recipes/platform-differences.md#android) why it's crucial to change `softInputMode` to `adjustResize` before using this library.

If you have `android:windowSoftInputMode="adjustResize"` declared in `AndroidManifest.xml` - then you can skip this step at all and forget about changing `softInputMode` in runtime (however you still may want to create your own version of hook without calls to `KeyboardController.*`) 😎.

Sometimes in deep stacks it may be important to have different `softInputMode` per screen, but by default `react-navigation` keeps previous screens mounted, so if you are using default `useKeyboardAnimation` hook, then all following screens will have `softInputMode=adjustResize`.

To prevent such behavior you can write own hook based on primitives from this library. The implementation may look like:

```
import { useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  KeyboardController,
  AndroidSoftInputModes,
  useKeyboardContext,
} from "react-native-keyboard-controller";

function useKeyboardAnimation() {
  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(
        AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
      );

      return () => KeyboardController.setDefaultMode();
    }, []),
  );

  const context = useKeyboardContext();

  return context.animated;
}
```

In this case when screen becomes invisible hook will restore default `softInputMode`, and `softInputMode` will be set to `adjustResize` only on the screen where it's used.
