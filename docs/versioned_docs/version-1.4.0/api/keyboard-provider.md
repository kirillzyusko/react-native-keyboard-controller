# KeyboardProvider

`KeyboardProvider` should wrap your app. Under the hood it works with `KeyboardControllerView` to receive events during keyboard movements, maps these events to `Animated`/`Reanimated` values and store them in `context`.

## Props

### `statusBarTranslucent` <div className="label android"></div>

A boolean prop to indicate whether `StatusBar` should be translucent on `Android` or not.

:::caution Important defaults
By default this library stretches to full screen (`edge-to-edge` mode) and status bar becomes translucent. But the library tries to use standard RN app behavior and automatically applies padding from top to look like a standard RN app. If you use `translucent` prop for `StatusBar` component - it will not work anymore. You'll need to specify it on provider level. For more info [see](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/30) this PR.
:::

### `navigationBarTranslucent` <div className="label android"></div>

A boolean prop to indicate whether [NavigationBar](https://m2.material.io/design/platform-guidance/android-bars.html#android-navigation-bar) should be translucent on `Android` or not.

## Example

```tsx
import { KeyboardProvider } from "react-native-keyboard-controller";

const App = () => {
  return (
    <KeyboardProvider>
      {/* The other components in your tree */}
    </KeyboardProvider>
  );
};
```
