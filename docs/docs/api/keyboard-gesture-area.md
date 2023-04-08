---
sidebar_position: 4
---

# KeyboardGestureArea

`KeyboardGestureArea` allows you to define a region on the screen, where gestures will control the keyboard position.

:::info Platform availability
This component is available only for Android >= 11. For iOS and Android < 11 it will render `React.Fragment`.
:::

## Props

#### `interpolator`

String with possible values `linear` and `ios`:

- **ios** - interactive keyboard dismissing will work as in iOS: swipes in non-keyboard area will not affect keyboard positioning, but if your swipe touches keyboard - keyboard will follow finger position.
- **linear** - gestures inside the component will linearly affect the position of the keyboard, i.e. if the user swipes down by 20 pixels, then the keyboard will also be moved down by 20 pixels, even if the gesture was not made over the keyboard area.

#### `allowToShowKeyboardFromHiddenStateBySwipeUp`

A boolean prop which allows to customize interactive keyboard behavior. If set to `true` then it allows to show keyboard (if it's already closed) by swipe up gesture. `false` by default.

#### `allowToDragKeyboardFromShownStateBySwipes`

A boolean prop which allows to customize interactive keyboard behavior. If set to `false`, then any gesture will not affect keyboard position if the keyboard is shown. `true` by default.

## Example

```tsx
<KeyboardGestureArea interpolator="ios">
  <ScrollView>
    {/* other components in your tree */}
  </ScrollView>
</KeyboardGestureArea>
```
