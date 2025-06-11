# Announcing upcoming release 📣

May 13, 2024 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

I'm excited to announce the latest release, version 1.12.0, of react-native-keyboard-controller!

Although this release may not seem monumental, it's significant, and I'm thrilled to share it with you. 😍

The key features of this release are: **bridgeless** support, selection tracking, enhanced `KeyboardToolbar` component and synchronous `onMove` handler on iOS among other bug fixes and improvements.

## Bridgeless support[​](/react-native-keyboard-controller/blog/release-1-12.md#bridgeless-support "Direct link to Bridgeless support")

This library starting from `1.12.0` is now compatible RN 0.74 and fully supports bridgeless mode, offering improved performance and streamlined communication between native and JavaScript layers.

## Selection tracking[​](/react-native-keyboard-controller/blog/release-1-12.md#selection-tracking "Direct link to Selection tracking")

In the previous version, `react-native-keyboard-controller` was not able to track selection changes in the text input fields. Starting from `1.12.0` this library exposes a new event and handlers making it possible to track selection changes.

In addition to duplicating the react-native API, this event provides information not only about the `start` and `end` positions but also the `x` and `y` coordinates for the top-left and bottom-right corners of the selection.

These details allow you to draw elements behind the cursor, making interaction with focused inputs more intuitive:

<!-- -->

[](/react-native-keyboard-controller/video/selection-demo.mov)

<br />

Later on I'm planning to extend `KeyboardAwareScrollView` to react on selection tracking, so if your selection is overlapped with keyboard then `KeyboardAwareScrollView` will automatically scroll and avoid an overlap.

## `KeyboardToolbar` enhancements[​](/react-native-keyboard-controller/blog/release-1-12.md#keyboardtoolbar-enhancements "Direct link to keyboardtoolbar-enhancements")

The `KeyboardToolbar` component was initially introduced in version `1.10.0`. In this release, I've added new features to make it even more customizable and HID compatible.

### `blur` effect[​](/react-native-keyboard-controller/blog/release-1-12.md#blur-effect "Direct link to blur-effect")

Starting with version `1.12.0`, you can apply a blur effect to the `KeyboardToolbar` component by using the `blur` prop. You can use any compatible component, such as `react-native-blur` or `expo-blur`. Since iOS 16, the keyboard itself is translucent with a blur effect, which causes all components behind it to be blurred too.

With the new version of `react-native-keyboard-controller`, you can extend this effect to the `KeyboardToolbar` component! 😎

### Button callbacks[​](/react-native-keyboard-controller/blog/release-1-12.md#button-callbacks "Direct link to Button callbacks")

From version `1.12.0`, the `KeyboardToolbar` component supports various callbacks for specific events, such as `onNextCallback`, `onPrevCallback`, and `onDoneCallback`.

These callbacks let you add **haptic** feedback, **play sounds**, or implement other creative responses based on your needs.

## Synchronous `onMove` handler on iOS[​](/react-native-keyboard-controller/blog/release-1-12.md#synchronous-onmove-handler-on-ios "Direct link to synchronous-onmove-handler-on-ios")

Since version `1.4.0`, when the `useKeyboardHandler` hook was introduced, the `onMove` handler was always a frame behind.

As a result, it created a parallax effect that prevented elements from precisely following the keyboard.

With a new release this problem is solved, and the `onMove` handler is now synchronized with the keyboard animation. 😊

## No need to patch `react-native-text-input-mask` anymore[​](/react-native-keyboard-controller/blog/release-1-12.md#no-need-to-patch-react-native-text-input-mask-anymore "Direct link to no-need-to-patch-react-native-text-input-mask-anymore")

If you used `react-native-text-input-mask` alongside `useFocusedInputHandler` or `KeyboardAwareScrollView`, you might have needed to patch it to ensure that the `onChangeText` event was triggered.

With the new release of `react-native-keyboard-controller`, you can now safely remove this patch and keep your existing code intact. 👍

## What's next?[​](/react-native-keyboard-controller/blog/release-1-12.md#whats-next "Direct link to What's next?")

This release refines the previous version and at the same time introduces crucial improvements that will unlock the full potential of `react-native-keyboard-controller` in future updates:

* on iOS, we now inject a delegate into `TextInput`, providing greater control over input and keyboard events;
* the fully synchronous `onMove` handler will enable frame-by-frame keyboard control in the future, particularly when an interactive keyboard offset is implemented. 👀

To stay tuned follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [bridgeless](/react-native-keyboard-controller/blog/tags/bridgeless.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2024-05-13-release-1-12/index.mdx)
