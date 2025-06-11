# New release features, a year overview

December 26, 2023 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

I'm thrilled to announce the latest release, version `1.10.0`, of `react-native-keyboard-controller`! Packed with new functionalities and improvements, this update aims to enhance your React Native development experience.

<!-- -->

## Key features[​](/react-native-keyboard-controller/blog/release-1-10.md#key-features "Direct link to Key features")

### `useFocusedInputHandler` hook[​](/react-native-keyboard-controller/blog/release-1-10.md#usefocusedinputhandler-hook "Direct link to usefocusedinputhandler-hook")

Introducing the `useFocusedInputHandler` hook! This powerful addition empowers developers to manage focused input with unparalleled ease. The hook comes with a straightforward signature:

```
useFocusedInputHandler(
  {
    onChangeText: ({ text }) => {
      "worklet";

      // Your custom logic here
    },
  },
  [],
);
```

Whenever you are building your own avoiding solution or tracking user activity this hook can be a perfect fit for your needs!

### Exporting `KeyboardAwareScrollView`[​](/react-native-keyboard-controller/blog/release-1-10.md#exporting-keyboardawarescrollview "Direct link to exporting-keyboardawarescrollview")

I've heard your feedback, and in response, I'm now exporting `KeyboardAwareScrollView` from the library core. This widely-used component provides an enhanced `ScrollView` experience, ensuring smoother navigation and improved user interactions. Now, you can effortlessly integrate it into your projects and leverage its capabilities for a more polished UI 😎

### `KeyboardController.dismiss()` method[​](/react-native-keyboard-controller/blog/release-1-10.md#keyboardcontrollerdismiss-method "Direct link to keyboardcontrollerdismiss-method")

Simplify your workflow with the addition of the `KeyboardController.dismiss()` method. This method streamlines the dismissal of the keyboard, making it a breeze to manage user input interactions. Enhance the user experience by effortlessly controlling when and how the keyboard should disappear.

## Reflecting on a Productive Year: 2023 🎁🎅[​](/react-native-keyboard-controller/blog/release-1-10.md#reflecting-on-a-productive-year-2023- "Direct link to Reflecting on a Productive Year: 2023 🎁🎅")

As we bid farewell to 2023, it's a moment to reflect on the incredible strides we've made together. This year has been marked by innovation, user-centric enhancements, and the continuous evolution of our toolkit. Here's a summary of the key milestones:

### Interactive Keyboard Implementation[​](/react-native-keyboard-controller/blog/release-1-10.md#interactive-keyboard-implementation "Direct link to Interactive Keyboard Implementation")

I took a giant leap forward by implementing an interactive keyboard. This feature enhances user engagement and provides a dynamic interface for a more immersive experience. Now, user interactions with the keyboard are not just functional but also interactive and enjoyable 😊

### Expanded Event Metadata[​](/react-native-keyboard-controller/blog/release-1-10.md#expanded-event-metadata "Direct link to Expanded Event Metadata")

In response to your needs, I introduced new metadata fields — `duration`, `target` and `timestamp` — to events. These additions provide more comprehensive insights into user interactions, enabling you to fine-tune and optimize your applications with a deeper understanding of user behavior.

### Diverse Component Additions[​](/react-native-keyboard-controller/blog/release-1-10.md#diverse-component-additions "Direct link to Diverse Component Additions")

My commitment to versatility led to the incorporation of several new components. The introduction of `KeyboardAvoidingView`, `KeyboardStickyFooter`, and `KeyboardAwareScrollView` opens up a world of possibilities for crafting responsive and user-friendly interfaces. These components are designed to seamlessly integrate into your projects, offering enhanced UI control.

### Empowering Hooks[​](/react-native-keyboard-controller/blog/release-1-10.md#empowering-hooks "Direct link to Empowering Hooks")

Empowering developers with more tools, I introduced a series of new hooks. From the versatile `useKeyboardController` to the focused input management provided by `useReanimatedFocusedInput` and the feature-rich `useFocusedInputHandler` hook, these additions streamline development and elevate the capabilities of your React Native applications.

## Looking Forward to 2024 ☃️🎄❄️[​](/react-native-keyboard-controller/blog/release-1-10.md#looking-forward-to-2024-️️ "Direct link to Looking Forward to 2024 ☃️🎄❄️")

As I embark on the journey into the new year, the excitement is palpable. I'm eager to build upon the successes of 2023 and bring even more features to the table. Our roadmap is filled with promising enhancements, and I can't wait to share them with you. Your feedback has been invaluable, and I look forward to continuing this collaborative journey in the coming year.

Thank you for being a part of our community. Here's to a year of growth, collaboration, and the continued evolution of your React Native development experience!

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [focused text input](/react-native-keyboard-controller/blog/tags/focused-text-input.md)
* [keyboard aware scroll view](/react-native-keyboard-controller/blog/tags/keyboard-aware-scroll-view.md)
* [dismiss](/react-native-keyboard-controller/blog/tags/dismiss.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2023-12-26-release-1-10/index.mdx)
