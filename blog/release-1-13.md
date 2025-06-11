# A new 1.13 release 😎

August 16, 2024 ·

<!-- -->

6 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

I'm excited to announce the latest release, version `1.13.0`, of react-native-keyboard-controller! 🎉

This update brings significant improvements and new features to enhance the way your React Native apps handle keyboard interactions. With better support for `Modal` components, dynamic `StatusBar` translucency, and new customization options for `KeyboardGestureArea`s, this release is designed to make your development process smoother and your app's user experience more seamless. 🚀

<!-- -->

## Key features[​](/react-native-keyboard-controller/blog/release-1-13.md#key-features "Direct link to Key features")

### `Modal` support on Android[​](/react-native-keyboard-controller/blog/release-1-13.md#modal-support-on-android "Direct link to modal-support-on-android")

Starting from the very first version of this library it was impossible to use the functionality of this library inside the `Modal`. It was caused by next factors:

* the `Modal` window lives in its own view hierarchy;
* `react-native` set `adjustResize` mode to `window` of the `Modal`.

As a result whenever you try to use `react-native-keyboard-controller` inside the `Modal` you will get a default behavior (but sometimes even mixed behavior, i. e. hooks will report keyboard height and `Modal` content will be automatically resized).

As a temporary workaround people simply disabled the module (to fallback to a fully default behavior):

```
import { useKeyboardController } from "react-native-keyboard-controller";

// ... somewhere in your modal screen ...

const { enabled, setEnabled } = useKeyboardController();

useEffect(() => {
  setEnabled(false);
}, []);
```

While it was working approach it still had some downsides, such as inconsistent keyboard handling/animations across the app.

With the new release it's not a problem anymore - now you can use all hooks and components inside the `Modal` without additional hassle and it will just work out of the box:

[](/react-native-keyboard-controller/video/modal-integration-demo.mp4)

### Support for `StatusBar.translucent`[​](/react-native-keyboard-controller/blog/release-1-13.md#support-for-statusbartranslucent "Direct link to support-for-statusbartranslucent")

The `StatusBar` integration was always a problematic because `react-native` uses deprecated methods that eventually breaks keyboard events. This module exports its own `StatusBarManagerCompat` module and uses this module automatically to handle `StatusBar` changes.

The problem was in the fact that `StatusBarManagerCompat` module didn't react on `translucent` prop changes. Now it's not the case and you can disable/enable `translucent` property dynamically.

info

You may think that `statusBarTranslucent` prop on `KeyboardProvider` is not needed anymore, but I would recommend to keep it - it'll help to layout `KeyboardProvider` properly in one frame without frame jumps.

### New `offset` prop for `KeyboardGestureArea`[​](/react-native-keyboard-controller/blog/release-1-13.md#new-offset-prop-for-keyboardgesturearea "Direct link to new-offset-prop-for-keyboardgesturearea")

Starting from this release I'm adding more customization to interactive keyboard handling. On `Android` now you can add `offset` property (which can be equal to your `TextInput` height) to your `KeyboardGestureArea` component - it'll allow you to extend the keyboard area and start dismiss gesture starting from the `TextInput` top border and not from the keyboard itself.

<!-- -->

|                                                                                      |                                                                                               |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [](/react-native-keyboard-controller/video/keyboard-gesture-area-without-offset.mp4) | [](/react-native-keyboard-controller/video/keyboard-gesture-area-with-offset.mp4)             |
| *The keyboard movement starts only when you cross the top border of the keyboard*    | *The keyboard movement starts only when you cross the top border of your<!-- --> `TextInput`* |

### `react-native@0.75` support[​](/react-native-keyboard-controller/blog/release-1-13.md#react-native075-support "Direct link to react-native075-support")

This release brings support for `react-native@0.75`. Even though `1.12.x` should be also compatible with `react-native@0.75` I still would recommend you to update this library to `1.13.0` if you are running your project on `react-native@0.75` (especially if you are using new architecture).

### An ability to prevent default actions in `KeyboardToolbar`[​](/react-native-keyboard-controller/blog/release-1-13.md#an-ability-to-prevent-default-actions-in-keyboardtoolbar "Direct link to an-ability-to-prevent-default-actions-in-keyboardtoolbar")

Starting from `1.12.0` you had an ability to customize the behavior of `KeyboardToolbar` buttons - you could run additional actions (add haptic feedback, for example). However before it wasn't possible to prevent default actions from happening, i. e. if you pressed next button, then focus would move to the next input.

With this release you can prevent default actions from happening by calling `e.preventDefault()` in `onNextCallback`, `onPrevCallback`, and `onDoneCallback` callbacks.

I think it's a great addition to the existing functionality, because sometimes you may need to have this. For example, if you have a custom input between two `TextInput`s (let's say a calendar picker) and when you press the next button (while you have a focus on the first input) - most likely you want to open a calendar picker. But with default behavior you will skip a calendar picker and will instantly move to the second input. Using new functionality you can call `e.preventDefault()` conditionally and perform your own action to achieve your custom requirements!

### Synchronous `worklet` handler mount[​](/react-native-keyboard-controller/blog/release-1-13.md#synchronous-worklet-handler-mount "Direct link to synchronous-worklet-handler-mount")

Hooks such as `useKeyboardHandler` or `useFocusedInputHandler` were mounting `worklet` handlers asynchronously. In most of the cases it wasn't a problem, but if the keyboard performs an animation and `worklet` handler is not attached yet, then you will get a broken layout - keyboard will overlap elements etc.

This release fixes this issue by mounting `worklet` handlers synchronously so it's not a problem anymore! 😊

### Other bug fixes and improvements[​](/react-native-keyboard-controller/blog/release-1-13.md#other-bug-fixes-and-improvements "Direct link to Other bug fixes and improvements")

Among all other improvements this release also includes a bunch of fixes, such as:

* proper `ref` de-allocation for `KeyboardAwareScrollView`;
* better accessibility labels for `KeyboardToolbar`;
* incorrect `height`/`progress` values in `onEnd`/`didShow` events on iOS when keyboard appearance has two stages (i. e. you are using `secureTextEntry` prop on `TextInput`).

Also this release aims to improve the stability of this library - I added a bunch of **e2e** tests and added scripts for running them on more devices. If before I used only **iOS 17** simulator and **Android 9** emulator, now I'm using **iOS 16/17/18** (yes, I'm testing on ***beta*** iOS releases too 😎) simulators and **Android 9/12** emulators.

I hope such setup can help to catch bugs on as early stage as possible. But I'm not going to stop here - I'm also planning to add more tests, more runtimes (Android 15 is planned) and improve the stability of this library even more.

## What's next?[​](/react-native-keyboard-controller/blog/release-1-13.md#whats-next "Direct link to What's next?")

The new `1.13.0` release is just a better revision of the `1.12.0` release. But since it brings quite a lot of new features and improvements I decided to publish it as a separate release. 👀

I'm planning to continuously improve this library and add more features. The ultimate goal is to fix all the bugs and implement all requested features. 😎

If you have a pain-points when you have to deal with keyboard in `react-native` applications, please feel free to contribute to the project by submitting issues or pull requests on GitHub. Let's continue to make `react-native-keyboard-controller` an essential tool for developers building high-quality mobile applications! 💪

To stay tuned follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [modal](/react-native-keyboard-controller/blog/tags/modal.md)
* [translucent status bar](/react-native-keyboard-controller/blog/tags/translucent-status-bar.md)
* [offset](/react-native-keyboard-controller/blog/tags/offset.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2024-08-16-release-1-13/index.mdx)
