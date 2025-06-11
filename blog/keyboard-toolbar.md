# New KeyboardToolbar component 😍

February 21, 2024 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

I'm glad to announce a groundbreaking feature that's set to transform the way users interact with keyboards in your app: the `KeyboardToolbar`. This feature will enhance typing efficiency and increase user satisfaction. 😎

<!-- -->

## Why `KeyboardToolbar`?[​](/react-native-keyboard-controller/blog/keyboard-toolbar.md#why-keyboardtoolbar "Direct link to why-keyboardtoolbar")

In the digital age, the keyboard is not just a tool; it's the gateway to communication, creativity, and connection. Recognizing this, I set out to redefine the keyboard experience, making it more intuitive, seamless, and, most importantly, tailored to your users needs. So I'm happy to reveal `KeyboardToolbar` - a sleek, customizable toolbar that sticks to your keyboard like a faithful companion, ready to streamline your typing journey. 😍

## Why do I need another toolbar component if `react-native-keyboard-manager` already provides an implementation?[​](/react-native-keyboard-controller/blog/keyboard-toolbar.md#why-do-i-need-another-toolbar-component-if-react-native-keyboard-manager-already-provides-an-implementation "Direct link to why-do-i-need-another-toolbar-component-if-react-native-keyboard-manager-already-provides-an-implementation")

While `react-native-keyboard-manager` offers a toolbar component powered by `IQKeyboardManager`, it still lack some features, such as:

* missing Android support;
* lack of full customization (you can not render custom content/buttons/icons, perform custom actions on clicks, etc.);
* issues when integrating custom input components (date pickers, bottom sheets, etc.).

Taking all these points into consideration, I decided to create a **new** component that would overcome these limitations, while at the same time maintaining a simple API so that developers can easily work with it.

I was inspired by `IQKeyboardManager` functionality and its ease of integration into iOS projects, so I decided to replicate their algorithms for view traversal on both Android and iOS.

For sure, the current implementation only covers basic use cases, but I plan to extend the functionality to cover more and more various edge cases in the future. 😎

## The simple API behind a new component[​](/react-native-keyboard-controller/blog/keyboard-toolbar.md#the-simple-api-behind-a-new-component "Direct link to The simple API behind a new component")

The UI of the new component is implemented using `react-native` primitives (thus allowing great customization). However, the functionality for moving focus to `next` and `previous` fields is implemented on the native side and is powered by a simple API:

```
import { KeyboardController } from "react-native-keyboard-controller";

// this will move focus to the next TextInput
KeyboardController.setFocusTo("next");
// or if we want to set focus to previous field
KeyboardController.setFocusTo("prev");
```

Last but not least - the new API allows you to restore focus to the last focused input 🤯. To achieve this, you should use:

```
import { KeyboardController } from "react-native-keyboard-controller";

// if keyboard is closed - it'll restore a focus
// if keyboard is open - it will not do anything
KeyboardController.setFocusTo("current");
```

So, as you can see, for simple navigation to `next` and `previous` fields, you don't need to create a complex solutions with an array of `refs` in JS code - now it's powered by the new API of this library and allows you to delegate control to the library and simplify your codebase 😎

## Instead of summary[​](/react-native-keyboard-controller/blog/keyboard-toolbar.md#instead-of-summary "Direct link to Instead of summary")

As I roll out the `KeyboardToolbar`, I invite you to join me in this exciting journey. Elevate your app's user experience, redefine keyboard interaction, and watch as your users engage with your app in ways never imagined before. Stay tuned for more updates, and get ready to embrace the future of keyboard navigation.

To start to use this feature install the latest `react-native-keyboard-controller` version `1.11.0` and add this component into your app. 😎 Also don't forget to check [example](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example) app to see how it's implemented there 👀

Follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [keyboard toolbar](/react-native-keyboard-controller/blog/tags/keyboard-toolbar.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2024-02-21-keyboard-toolbar/index.mdx)
