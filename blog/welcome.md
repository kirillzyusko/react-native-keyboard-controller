# React Native meets smooth keyboard animations

June 22, 2022 ·

<!-- -->

2 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

Many flagship applications that are written natively (such as `Telegram`, `Instagram`, etc.) use the full power of platform-specific native APIs (`iOS`, `Android`) to make transitions between opening/closing the keyboard animated and smooth.

Unfortunately, in `react-native` this aspect was given little attention and all `react-native` applications were suffering because of that - animations were rough, you couldn't write cross-platform code because some keyboard events were not available, etc. But with the advent of this library, everything changes... 😎

<!-- -->

The purpose of this library was utilizing all power of native API and at the same time provide a universal way in `react-native` to deal with it (allowing to use some platforms advanced technics if needed). Thus this library allows you to track each keyboard frame movement, and create corresponding reactions (move elements accordingly).

The first release of this library brings missing `keyboardWillShow`/`keyboardWillHide` events on `Android` making `events` module fully cross-platform as well as adding a way to use `Animated.Value` for managing keyboard frames.

In further releases the API will be enhanced:

* support will be added for interactive keyboard dismissing (on Android)
* the library will be rewritten to new `Fabric` architecture
* maybe some components, such as `KeyboardAvoidingView`/`KeyboardAwareScrollView` will be available here with better performance and animations.

Stay tuned! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [animation](/react-native-keyboard-controller/blog/tags/animation.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2022-06-22-welcome/index.mdx)
