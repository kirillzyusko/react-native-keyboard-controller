# useKeyboardHandler

`useKeyboardHandler` is a hook that offers low-level but more powerful API in comparison to `useKeyboardAnimation`.

## Example

```tsx
useKeyboardHandler(
  {
    onStart: (e) => {
      'worklet';
    },
    onMove: (e) => {
      'worklet';
    },
    onEnd: (e) => {
      'worklet';
    },
  },
  []
);
```

:::caution Worklet directives

Don't forget to add `worklet` directive to all `onStart`/`onMove`/`onEnd` handlers. Otherwise your code will throw exception.

These handlers are not workletized by default, since it's not a part of `reanimated` package.

:::

:::info Unlock 120 FPS on iOS
Since `onMove` handler on iOS is based on `CADisplayLink` usage - you may need to add following content in `Info.plist` if you want to have your animations running at 120 FPS on devices with ProMotion displays:

```diff
+	<key>CADisableMinimumFrameDurationOnPhone</key>
+	<true/>
```
:::

### Event structure

- `height` - height of the keyboard;
- `progress` - a value between `0` (closed) and `1` (opened) indicating current relative position.

### Handlers

#### `onStart`

#### `onMove`

:::info Not precise values
There is no corresponding events in iOS for this hook. So values will not be perfectly synchronized with the keyboard.

The same is applied to Android < 11 - these OS versions don't have API for getting keyboard positions during an animation.
:::

#### `onEnd`