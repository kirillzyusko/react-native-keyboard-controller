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

## [`OverKeyboardView`](/react-native-keyboard-controller/docs/api/views/over-keyboard-view.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#overkeyboardview "Direct link to overkeyboardview")

`OverKeyboardView` offers a unique capability: it allows you to render any React Native view *on top* of both your application UI *and* the virtual keyboard, crucially *without* causing the keyboard to be dismissed. This is ideal for creating experiences where supplementary UI elements, like context menu can appear.

Its key difference from a standard `Modal` is precisely this ability to keep the keyboard open and active, enabling more seamless keyboard-centric interactions. Its usage is straightforward, primarily controlled via the `visible` boolean prop.

## [`KeyboardExtender`](/react-native-keyboard-controller/docs/api/views/keyboard-extender.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#keyboardextender "Direct link to keyboardextender")

`KeyboardExtender` allows you to render custom content *inside* the keyboard area — literally extending the keyboard with your own UI. Unlike views that float or move with the keyboard, this component integrates visually and functionally *as part of the keyboard itself*.

It's perfect for adding quick action buttons or other custom input helpers directly above the system keyboard. The extender matches the native keyboard animation and hides automatically when the keyboard dismisses.

Use the `enabled` prop to toggle its activation based on `TextInput` focus, and note that it **cannot contain other `TextInput`s** inside.

## [`KeyboardBackgroundView`](/react-native-keyboard-controller/docs/api/views/keyboard-background-view.md)[​](/react-native-keyboard-controller/docs/guides/components-overview.md#keyboardbackgroundview "Direct link to keyboardbackgroundview")

`KeyboardBackgroundView` is a low-level utility component that replicates the **visual background of the system keyboard**. It doesn’t extend behind the keyboard or modify layout — instead, it lets you **match your UI’s design to the keyboard’s background**, making transitions feel more native and polished.

This component is particularly useful when you want to:

* **Blend your UI with the system keyboard’s look**, ensuring color and tone consistency across transitions.
* Create **smooth visual experiences**, like a toolbar or floating panel that appears visually anchored to the keyboard.
* Implement designs with **shared visual surfaces**, such as search interfaces or context panels, that remain visually connected during keyboard presentation.

`KeyboardBackgroundView` is typically used alongside components like `KeyboardStickyView`, where keeping a consistent background color between your UI and the keyboard enhances the illusion of a single continuous surface.

It’s not meant to manage layout, respond to keyboard events, or overlay content — its sole purpose is **visual alignment**.

tip

Use this when you want your UI to feel like it shares the same visual space as the system keyboard — particularly helpful for sticky toolbars, soft shadows, or themed transitions.

## Quick Reference Table[​](/react-native-keyboard-controller/docs/guides/components-overview.md#quick-reference-table "Direct link to Quick Reference Table")

| Component                 | Primary Action When Keyboard Appears       | Container Resizes/Adjusts? | Typical Use Case             | Key Distinction vs. Others                                |
| ------------------------- | ------------------------------------------ | -------------------------- | ---------------------------- | --------------------------------------------------------- |
| `KeyboardAvoidingView`    | Adjusts layout (padding, position, height) | ✅                         | Small Forms, Chat Screens    | Consistent cross-platform avoidance, layout adjustment    |
| `KeyboardStickyView`      | Moves/Translates view with keyboard        | ❌ (moves child only)      | Sticky Footer/Toolbar        | Moves element without resizing layout                     |
| `KeyboardAwareScrollView` | Scrolls content to focused input           | ✅ (scroll position)       | Large Scrollable Forms/Lists | Auto-scrolls within ScrollView, respects native animation |
| `KeyboardToolbar`         | Adds Nav/Done buttons, sticks to keyboard  | ❌ (it's sticky)           | Multi-Input Forms            | Provides UI + native logic for input navigation/dismissal |
| `OverKeyboardView`        | Displays content *over* the keyboard       | ❌ (overlays content)      | Menus, Modals over keyboard  | Keeps keyboard open while showing overlay content         |
| `KeyboardExtender`        | Displays the content inside the keyboard   | ❌ (moves with keyboard)   | Quick actions, shortcuts     | Appears as part of keyboard, matches animation & style    |
| `KeyboardBackgroundView`  | Matches keyboard background color          | ❌ (visual only)           | Visual Blending/Transitions  | Synchronizes color with keyboard for seamless UI effects  |

## Which Component Should You Use?[​](/react-native-keyboard-controller/docs/guides/components-overview.md#which-component-should-you-use "Direct link to Which Component Should You Use?")

Here's a simple guide to choosing:

* If your primary goal is to **prevent the keyboard from hiding inputs** on a standard screen, start with `KeyboardAvoidingView`.
* If you need a specific element like a **footer or toolbar to move smoothly with the keyboard**, `KeyboardStickyView` is designed for that task.
* For **scrollable screens containing multiple inputs** (like forms or long lists), `KeyboardAwareScrollView` will handle keeping the focused input visible automatically.
* To add standard **"Previous/Next/Done" navigation buttons** to your forms, `KeyboardToolbar` offers a convenient and customizable solution.
* When you need to display **contextual content like suggestions or menus over an active keyboard** without dismissing it, `OverKeyboardView` provides this unique capability.
* If you want to **extend the keyboard with your own UI**, such as quick actions or input helpers that appear *inside* the keyboard area, use `KeyboardExtender`.
* If you're aiming for **visual consistency between your UI and the keyboard background** — for example, to blend a panel into the keyboard area — `KeyboardBackgroundView` helps match system colors for a polished, seamless effect.

This library offers specialized tools for common keyboard challenges in React Native. Choose the one that best fits your UI need.
