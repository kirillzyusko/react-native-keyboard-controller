# Components Overview

This guide provides a concise overview of the main UI components in `react-native-keyboard-controller`. Choose the right component to handle keyboard interactions smoothly and consistently across platforms.

## [`KeyboardAvoidingView`](/react-native-keyboard-controller/docs/api/components/keyboard-avoiding-view.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#keyboardavoidingview "Direct link to keyboardavoidingview")

<!-- -->

<!-- -->

<!-- -->

Use `KeyboardAvoidingView` when you need to prevent the keyboard from hiding important UI elements, especially `TextInput` components. It automatically adjusts its layout—by changing its height, position, or padding—when the keyboard appears. A key advantage over the standard React Native component is its focus on *consistent behavior and smoother animations* across both iOS and Android, simplifying cross-platform development. It's ideal for general screens like forms or chat interfaces.

You can control how it adjusts using the `behavior` prop (`padding`, `height`, `position`, `translate-with-padding`), and remember to set `keyboardVerticalOffset` if your view is positioned below a header or navigation bar.

## [`KeyboardStickyView`](/react-native-keyboard-controller/docs/api/components/keyboard-sticky-view.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#keyboardstickyview "Direct link to keyboardstickyview")

`KeyboardStickyView` is designed specifically to make a view "sticky" to the top edge of the keyboard, moving perfectly in sync with it as it animates.

<!-- -->

|                                                                           |                                                                |
| ------------------------------------------------------------------------- | -------------------------------------------------------------- |
|                                                                           |                                                                |
| *`KeyboardStickyView` - only footer is moving (container is not resized)* | *`KeyboardAvoidingView` - entire container is getting resized* |

Unlike `KeyboardAvoidingView`, it achieves this using only *vertical translation*, meaning it moves the child view up and down without resizing the surrounding layout. This makes it the perfect choice for elements like custom input toolbars, action buttons, or footers that need to remain visually attached just above the keyboard during text input.

You can use the `offset` prop to fine-tune its vertical position relative to the keyboard's edge.

## [`KeyboardAwareScrollView`](/react-native-keyboard-controller/docs/api/components/keyboard-aware-scroll-view.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#keyboardawarescrollview "Direct link to keyboardawarescrollview")

For screens with scrollable content and multiple inputs, such as forms or long lists, `KeyboardAwareScrollView` is the component to use. It's a specialized `ScrollView` that automatically scrolls its content to ensure the currently focused `TextInput` remains visible and isn't hidden by the keyboard. It stands out by providing smoother scrolling that respects native keyboard animations on both platforms and reacting reliably to layout changes, often proving more robust than older libraries or manual setups.

Key props like `bottomOffset` help control the spacing below the focused input, while `extraKeyboardSpace` can add padding at the bottom when needed.

## [`KeyboardToolbar`](/react-native-keyboard-controller/docs/api/components/keyboard-toolbar.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#keyboardtoolbar "Direct link to keyboardtoolbar")

To enhance the usability of forms with multiple `TextInput` fields, consider `KeyboardToolbar`. It provides a ready-made, customizable toolbar designed to stick to the top of the keyboard, typically featuring "Previous" and "Next" buttons for easy input navigation, and a "Done" button for dismissing the keyboard.

A major benefit is its use of the library's native focus control logic (`KeyboardController.setFocusTo`), simplifying development by handling the complexities of switching focus between inputs for you. It's highly customizable in appearance and behavior, allowing seamless integration into your app's design.

## [`OverKeyboardView`](/react-native-keyboard-controller/docs/api/over-keyboard-view.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#overkeyboardview "Direct link to overkeyboardview")

`OverKeyboardView` offers a unique capability: it allows you to render any React Native view *on top* of both your application UI *and* the virtual keyboard, crucially *without* causing the keyboard to be dismissed. This is ideal for creating experiences where supplementary UI elements, like context menu can appear.

Its key difference from a standard `Modal` is precisely this ability to keep the keyboard open and active, enabling more seamless keyboard-centric interactions. Its usage is straightforward, primarily controlled via the `visible` boolean prop.

## Quick Reference Table[​](/react-native-keyboard-controller/docs/guides/components-overview.md#quick-reference-table "Direct link to Quick Reference Table")

| Component                 | Primary Action When Keyboard Appears       | Container Resizes/Adjusts? | Typical Use Case             | Key Distinction vs. Others                                |
| ------------------------- | ------------------------------------------ | -------------------------- | ---------------------------- | --------------------------------------------------------- |
| `KeyboardAvoidingView`    | Adjusts layout (padding, position, height) | ✅                         | Small Forms, Chat Screens    | Consistent cross-platform avoidance, layout adjustment    |
| `KeyboardStickyView`      | Moves/Translates view with keyboard        | ❌ (moves child only)      | Sticky Footer/Toolbar        | Moves element without resizing layout                     |
| `KeyboardAwareScrollView` | Scrolls content to focused input           | ✅ (scroll position)       | Large Scrollable Forms/Lists | Auto-scrolls within ScrollView, respects native animation |
| `KeyboardToolbar`         | Adds Nav/Done buttons, sticks to keyboard  | ❌ (it's sticky)           | Multi-Input Forms            | Provides UI + native logic for input navigation/dismissal |
| `OverKeyboardView`        | Displays content *over* the keyboard       | ❌ (overlays content)      | Menus, Modals over keyboard  | Keeps keyboard open while showing overlay content         |

## Which Component Should You Use?[​](/react-native-keyboard-controller/docs/guides/components-overview.md#which-component-should-you-use "Direct link to Which Component Should You Use?")

Here's a simple guide to choosing:

* If your primary goal is to **prevent the keyboard from hiding inputs** on a standard screen, start with `KeyboardAvoidingView`.
* If you need a specific element like a **footer or toolbar to move smoothly with the keyboard**, `KeyboardStickyView` is designed for that task.
* For **scrollable screens containing multiple inputs** (like forms or long lists), `KeyboardAwareScrollView` will handle keeping the focused input visible automatically.
* To add standard **"Previous/Next/Done" navigation buttons** to your forms, `KeyboardToolbar` offers a convenient and customizable solution.
* When you need to display **contextual content like suggestions or menus over an active keyboard** without dismissing it, `OverKeyboardView` provides this unique capability.

This library offers specialized tools for common keyboard challenges in React Native. Choose the one that best fits your UI need.
