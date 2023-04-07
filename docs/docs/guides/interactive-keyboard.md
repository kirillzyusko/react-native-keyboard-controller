---
sidebar_position: 3
---

# Interactive Keyboard

This guide focuses on adding an ability to dismiss keyboard interactively. Below you can see a step by step guide which will explain how different pieces of the code work together.

## Android

### Start point

First of all let's consider a simple example and layout for typical chat application.

```tsx
<ScrollView>
  <Messages />
</ScrollView>
```

### Adding `KeyboardGestureArea`

To make interactive dismissing work on Android we need to add `KeyboardGestureArea` view. This view will track all gestures and will control the keyboard positioning. To customize the way how the keyboard will be dismissed you can specify `interpolator` [prop](../api/keyboard-gesture-area.md#interpolator).

In order to recognize all gestures on a `ScrollView` we need to wrap a `ScrollView` within `KeyboardGestureArea`:

```tsx
// add-new-code
<KeyboardGestureArea interpolator="ios">
  <ScrollView>
    <Messages />
  </ScrollView>
// add-new-code
</KeyboardGestureArea>
```

### Reacting on keyboard movement

Basically `useKeyboardAnimation`/`useReanimatedKeyboardAnimation` will update animated values as keyboard moves. But if you want to differ plain keyboard movements (when it shows/hides because of `TextInput` gets focused/unfocused) and interactive keyboard movement, then you can use `useKeyboardHandler` hook and specify [`onInteractive`](../api/hooks/use-keyboard-handler/index.mdx#oninteractive) handler as shown below:

```tsx
useKeyboardHandler(
  {
    onInteractive: (e) => {
      'worklet';
      // your handler for interactive keyboard movement
    }
  },
  []
);
```

## iOS

The interactive keyboard dismissing works well out-of-box in react-native using `InputAccessoryView`, however if you are not satisfied with the usage of `InputAccessoryView` - you can try to utilize the functionality of this library.

## Full example

To see full example of interactive keyboard handling you may have a look on corresponding [android](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/main/example/src/screens/Examples/InteractiveKeyboard/index.tsx) and [ios](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/main/example/src/screens/Examples/InteractiveKeyboardIOS/index.tsx) example apps.
