# Interactive Keyboard

This guide focuses on adding an ability to dismiss keyboard interactively. Below you can see a step by step guide which will explain how different pieces of the code work together.

<!-- -->

## Android[​](/react-native-keyboard-controller/docs/guides/interactive-keyboard.md#android "Direct link to Android")

### Start point[​](/react-native-keyboard-controller/docs/guides/interactive-keyboard.md#start-point "Direct link to Start point")

First of all let's consider a simple example and layout for typical chat application. Of course in real-application layout will be much more complex, but since it's a guide we will consider an over-simplified example to get a main idea.

```
<ScrollView>
  <Messages />
</ScrollView>
```

### Adding `KeyboardGestureArea`[​](/react-native-keyboard-controller/docs/guides/interactive-keyboard.md#adding-keyboardgesturearea "Direct link to adding-keyboardgesturearea")

To make interactive dismissing work on Android we need to add `KeyboardGestureArea` view. This view will track all gestures and will control the keyboard positioning. To customize the way how the keyboard will be dismissed you can specify `interpolator` [prop](/react-native-keyboard-controller/docs/api/views/keyboard-gesture-area.md#interpolator-).

In order to recognize all gestures on a `ScrollView` we need to wrap a `ScrollView` within `KeyboardGestureArea`:

```
<KeyboardGestureArea interpolator="ios">
  <ScrollView>
    <Messages />
  </ScrollView>
</KeyboardGestureArea>
```

### Reacting on keyboard movement[​](/react-native-keyboard-controller/docs/guides/interactive-keyboard.md#reacting-on-keyboard-movement "Direct link to Reacting on keyboard movement")

Basically `useKeyboardAnimation`/`useReanimatedKeyboardAnimation` will update animated values as keyboard moves. But if you want to differ plain keyboard movements (when it shows/hides because of `TextInput` gets focused/unfocused) and interactive keyboard movement, then you can use `useKeyboardHandler` hook and specify [`onInteractive`](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler.md#oninteractive) handler as shown below:

```
useKeyboardHandler(
  {
    onInteractive: (e) => {
      "worklet";
      // your handler for interactive keyboard movement
    },
  },
  [],
);
```

## iOS[​](/react-native-keyboard-controller/docs/guides/interactive-keyboard.md#ios "Direct link to iOS")

The interactive keyboard dismissing works well out-of-box in `react-native` using `InputAccessoryView`. However if you are not satisfied with the usage of `InputAccessoryView` - you can try to utilize the functionality of this library.

For that you'll need to follow a pattern from above and add [`onInteractive`](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler.md#oninteractive) handler if you are using `useKeyboardHandler` hook. If you are using `useKeyboardAnimation` or `useReanimatedKeyboardAnimation` hooks then no extra actions are required - these hooks will update its values automatically, when keyboard gets moved because of interactive dismissal.

## Full examples[​](/react-native-keyboard-controller/docs/guides/interactive-keyboard.md#full-examples "Direct link to Full examples")

To see full examples of interactive keyboard handling you may have a look on corresponding [android](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/main/example/src/screens/Examples/InteractiveKeyboard/index.tsx) and [ios](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/main/example/src/screens/Examples/InteractiveKeyboardIOS/index.tsx) example apps.
