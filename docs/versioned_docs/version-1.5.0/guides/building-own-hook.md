---
sidebar_position: 2
keywords: [react-native-keyboard-controller, react-native keyboard, react hook]
---

# Building own hook

Default hooks may not perfectly fit in your app, because it changes/restores `softInputMode` on mount/unmount of the component where it's used. Though in deep stacks sometimes it may be important to have different `softInputMode` per screen, but by default `react-navigation` keeps previous screens mounted, so if you are using default `useKeyboardAnimation` hook, then all following screens will have `softInputMode=adjustResize`.

To prevent such behavior you can write own hook based on primitives from this library. The implementation may look like:

```ts
import { useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  KeyboardContext,
  KeyboardController,
  AndroidSoftInputModes,
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

  const context = useContext(KeyboardContext);

  return context.animated;
}
```

In this case when screen becomes invisible hook will restore default `softInputMode`, and `softInputMode` will be set to `adjustResize` only on the screen where it's used.
