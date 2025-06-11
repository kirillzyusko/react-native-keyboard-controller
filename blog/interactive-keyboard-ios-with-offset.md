# Interactive keyboard on iOS with offset 🔥

January 27, 2025 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

Say hello to the first release of the year for `react-native-keyboard-controller` version `1.16.0`! 🎉

This update is packed with new features, critical bug fixes, crash resolutions, and performance optimizations. Let’s dive in and explore what’s new! 👇

<!-- -->

[](/react-native-keyboard-controller/video/ios-offset-demo.mp4)

## `KeyboardGestureArea` with `offset` on iOS 🔥[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#keyboardgesturearea-with-offset-on-ios- "Direct link to keyboardgesturearea-with-offset-on-ios-")

The cherry on the cake of this release is making `KeyboardGestureArea` available on iOS 🍒

Previously, react-native developers relied on `InputAccessoryView` to extend the keyboard area, but it had several limitations:

* Multiline `TextInput` fields couldn't [expand dynamically](https://github.com/facebook/react-native/issues/18997);
* Conditional positioning and padding weren't [fully customizable](https://github.com/facebook/react-native/issues/20157);
* Weird animations when screen gets [mounted](https://stackoverflow.com/a/29110384/9272042).

These issues made `InputAccessoryView` challenging to use in real-world apps. 😭

Starting with this release, `KeyboardGestureArea` is now available on iOS! Currently, it supports the `offset` property, but I plan to add more features soon. 😎

## `useFocusedInput` improvements[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#usefocusedinput-improvements "Direct link to usefocusedinput-improvements")

### More Accurate Selection Events[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#more-accurate-selection-events "Direct link to More Accurate Selection Events")

#### Improved precision[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#improved-precision "Direct link to Improved precision")

Previously, `onSelectionChange`events could produce imprecise coordinates, especially when using different `paddingTop`/`paddingBottom` values or the `textAlignVertical` property.

This update fixes those inaccuracies, ensuring more precise coordinates and eliminating the need for workarounds to align positioning between Android and iOS.

#### Fully compatible with iOS < 13[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#fully-compatible-with-ios--13 "Direct link to Fully compatible with iOS < 13")

`onSelectionChange` didn’t work for single-line `TextInput`s on iOS versions below 13. This issue has now been resolved, ensuring compatibility across all iOS versions.

### Works Seamlessly with Stripe Inputs on Android[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#works-seamlessly-with-stripe-inputs-on-android "Direct link to Works Seamlessly with Stripe Inputs on Android")

Previously, some third-party SDKs, like **Stripe**, used custom `EditText` subclasses that caused issues when casting to `ReactEditText`, preventing the library from recognizing focused inputs.

I’ve reworked the code to interact directly with `EditText` whenever possible, ensuring full compatibility with **Stripe** and other third-party SDKs.

### No crashes on iOS[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#no-crashes-on-ios "Direct link to No crashes on iOS")

While rare, some users experienced crashes due to incorrect Key-Value Observing (KVO) removal when attempting to remove KVO from a view that doesn’t have it.

This release introduces a block-based KVO handling approach, eliminating those crashes.

### More Robust Focus Detection (Even When the Keyboard Is Hidden)[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#more-robust-focus-detection-even-when-the-keyboard-is-hidden "Direct link to More Robust Focus Detection (Even When the Keyboard Is Hidden)")

Previously, the library relied on the `keyboardWillShow` event as an indicator that an input field was focused. However, this event doesn’t always trigger—such as when using a physical keyboard or setting `showSoftInputOnFocus={false}`.

Now, focus detection has been improved to work reliably even without keyboard events.

## New `preserveEdgeToEdge` prop for `KeyboardProvider`[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#new-preserveedgetoedge-prop-for-keyboardprovider "Direct link to new-preserveedgetoedge-prop-for-keyboardprovider")

Thanks to [Mathieu Acthernoene](https://github.com/zoontek), `preserveEdgeToEdge` has been introduced! This property lets you control whether `edge-to-edge` mode is disabled when calling `setEnabled(false)`, or if you want to keep it enabled.

With `edge-to-edge` mode becoming the standard, this option helps prevent conflicts with other libraries.

## Improved animation performance[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#improved-animation-performance "Direct link to Improved animation performance")

While most users won’t notice a difference (since before animations were already computed in under `1ms`), I’ve made further optimizations to improve performance.

Even small performance gains are valuable, as they free up CPU resources for other intensive tasks — such as `ShadowTree` traversal in `react-native-reanimated`.

## What's next?[​](/react-native-keyboard-controller/blog/interactive-keyboard-ios-with-offset.md#whats-next "Direct link to What's next?")

As always, my immediate priority is addressing open issues. Additionally, I have plans for upcoming updates:

* Adding support for `react-native@0.77`;
* A major rewrite of `KeyboardAwareScrollView` to consider cursor positioning (this release lays the groundwork by improving event precision to minimize breaking changes in the future).

Stay tuned and follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [interactive](/react-native-keyboard-controller/blog/tags/interactive.md)
* [ios](/react-native-keyboard-controller/blog/tags/ios.md)
* [offset](/react-native-keyboard-controller/blog/tags/offset.md)
* [selection](/react-native-keyboard-controller/blog/tags/selection.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2025-01-27-release-1-16/index.mdx)
