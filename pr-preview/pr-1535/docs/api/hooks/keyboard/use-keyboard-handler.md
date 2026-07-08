# useKeyboardHandler

`useKeyboardHandler` is a hook that offers low-level but more powerful API in comparison to `useKeyboardAnimation`. Using this hook you are getting an access to keyboard lifecycle events and you can easily determine the moment of the beginning animation, the end of the animation and get keyboard position in every frame of the animation.

## Example[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#example "Direct link to Example")

```
useKeyboardHandler(
  {
    onStart: (e) => {
      "worklet";
    },
    onMove: (e) => {
      "worklet";
    },
    onInteractive: (e) => {
      "worklet";
    },
    onEnd: (e) => {
      "worklet";
    },
  },
  [],
);
```

Worklet directives

Don't forget to add `worklet` directive to all `onStart`/`onMove`/`onInteractive`/`onEnd` handlers. Otherwise your code will throw exception.

These handlers are not workletized by default, since it's not a part of `reanimated` package.

Unlock 120 FPS on iOS

Since `onMove` handler on iOS is based on `CADisplayLink` usage - you may need to add following content in `Info.plist` if you want to have your animations running at 120 FPS on devices with ProMotion displays:

```
+	<key>CADisableMinimumFrameDurationOnPhone</key>
+	<true/>
```

### Event structure[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#event-structure "Direct link to Event structure")

* `height` - height of the keyboard;
* `progress` - a value between `0` (closed) and `1` (opened) indicating relative keyboard position;
* `duration` - duration of the animation;
* `target` - tag of the focused `TextInput` (or `-1` if the tag is not found).

### Handlers[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#handlers "Direct link to Handlers")

#### `onStart`[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#onstart "Direct link to onstart")

<!-- -->

This function is called before the keyboard movement starts.<!-- --> <!-- -->`height` and `progress` values will have<!-- --> <!-- -->**destination** values, i. e. if keyboard was closed but will appear - these values will have a values like "keyboard is already opened" (`progress` will be equal to `1` and<!-- --> <!-- -->`height` will have non-zero value).

```
useKeyboardHandler(
  {
    onStart: (e) => {
      'worklet';
      const willKeyboardAppear = e.progress === 1;
    }
  },
  []
);
```

![](/react-native-keyboard-controller/pr-preview/pr-1535/assets/images/start-e9547e4ebde59f57b7a82bc5f795776e.png)

```
useKeyboardHandler(
  {
    onStart: (e) => {
      'worklet';
      const willKeyboardAppear = e.progress === 1;
    }
  },
  []
);
```

#### `onMove`[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#onmove "Direct link to onmove")

<!-- -->

This function will be called every frame when the keyboard changes its position.

```
useKeyboardHandler(
  {
    onMove: (e) => {
      'worklet';
      progress.value = e.progress;
      height.value = e.height;
    }
  },
  []
);
```

![](/react-native-keyboard-controller/pr-preview/pr-1535/assets/images/move-4064dba38cb1f124cf19649ae3688272.png)

```
useKeyboardHandler(
  {
    onMove: (e) => {
      'worklet';
      progress.value = e.progress;
      height.value = e.height;
    }
  },
  []
);
```

#### `onInteractive`[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#oninteractive "Direct link to oninteractive")

<!-- -->

This function will be called every frame when user changes position of the keyboard by the drag.

If finger is released and keyboard animates to its final destination, then the standard `onStart`/`onMove`/`onEnd` <!-- -->life cycles will be triggered.

```
useKeyboardHandler(
  {
    onInteractive: (e) => {
      'worklet';
      progress.value = e.progress;
      height.value = e.height;
    }
  },
  []
);
```

![](/react-native-keyboard-controller/pr-preview/pr-1535/assets/images/interactive-4ae892e92a3e62eb8241cb48a0105b76.png)

```
useKeyboardHandler(
  {
    onInteractive: (e) => {
      'worklet';
      progress.value = e.progress;
      height.value = e.height;
    }
  },
  []
);
```

Event availability

This event is available only on Android >= 11. To receive it you need to use [KeyboardGestureArea](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/views/keyboard-gesture-area.md).

On iOS you need to specify `keyboardDismissMode="interactive"` on your `ScrollView`.

#### `onEnd`[​](/react-native-keyboard-controller/pr-preview/pr-1535/docs/api/hooks/keyboard/use-keyboard-handler.md#onend "Direct link to onend")

<!-- -->

This function will be called when the keyboard has completed its movement. The event will contain **current** keyboard metrics.

```
useKeyboardHandler(
  {
    onEnd: (e) => {
      'worklet';
      progress.value = e.progress;
      height.value = e.height;
    }
  },
  []
);
```

![](/react-native-keyboard-controller/pr-preview/pr-1535/assets/images/end-d0b0fe8a04f1e3b17d238f711ae01423.png)

```
useKeyboardHandler(
  {
    onEnd: (e) => {
      'worklet';
      progress.value = e.progress;
      height.value = e.height;
    }
  },
  []
);
```
