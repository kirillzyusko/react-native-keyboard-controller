# useKeyboardHandler

`useKeyboardHandler` is a hook that offers low-level but more powerful API in comparison to `useKeyboardAnimation`. Using this hook you are getting an access to keyboard lifecycle events and you can easily determine the moment of the beginning animation, the end of the animation and get keyboard position in every frame of the animation.

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
- `progress` - a value between `0` (closed) and `1` (opened) indicating relative keyboard position.

### Handlers

#### `onStart`

This function is called before the keyboard movement starts. `height` and `progress` values will have **destination** values, i. e. if keyboard was closed but will appear - these values will have a values like "keyboard is already opened" (`progress` will be equal to `1` and `height` will have non-zero value).

```ts
onStart: (e) => {
  'worklet';

  const isKeyboardAppear = e.progress === 1;
},
```

#### `onMove`

This function will be called every frame when the keyboard changes its position.

:::info Not precise values
There is no corresponding events in iOS for this hook. So values will not be perfectly synchronized with the keyboard.

The same is applied to Android < 11 - these OS versions don't have API for getting keyboard positions during an animation.
:::

#### `onEnd`

This function will be called when the keyboard has completed its movement. The event will contain current keyboard metrics.