# Meet new 1.17 release with useKeyboardState hook 👋

April 9, 2025 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

Say hello to new `1.17.0` release of `react-native-keyboard-controller` 👋

This update brings a powerful new hook, custom C++ shadow nodes, and of course, plenty of bug fixes 😎

Let’s take a closer look at what’s new 👇

![Phone with visible keyboard and arrow to useKeyboardState](/react-native-keyboard-controller/assets/images/use-keyboard-state-147782c03c92b23356da2e7a8f5b051d.png)

## 🔥 New `useKeyboardState` hook[​](/react-native-keyboard-controller/blog/use-keyboard-state.md#-new-usekeyboardstate-hook "Direct link to -new-usekeyboardstate-hook")

Since the very first version, this library has provided keyboard events via the `KeyboardEvents` module. But many developers ended up writing their own wrappers to sync those events with `ref` or `state` variables.

In version `1.15.0`, the `KeyboardController.state()` API was introduced to read the keyboard state without needing a listener. However, if you wanted to react to keyboard changes (like conditionally rendering a component) you still had to use `KeyboardEvents` and deal with boilerplate code.

**That’s no longer the case!** With this release, you can use the new `useKeyboardState` hook to track the keyboard in a clean, declarative way. 🎉

Also, `KeyboardController.state()` has been improved — it now always returns a defined value, so you no longer need optional chaining to safely access the keyboard state.

## 🧱 Custom C++ Shadow Nodes[​](/react-native-keyboard-controller/blog/use-keyboard-state.md#-custom-c-shadow-nodes "Direct link to 🧱 Custom C++ Shadow Nodes")

When `OverKeyboardView` was introduced, there was an issue on Android/Fabric: the view couldn’t stretch to full screen. That’s because layout is now calculated in C++, and resizing your component requires updating state in C++ as well.

At the time, I released `OverKeyboardView` with this limitation since there were a lot of other moving pieces — and gradual rollout was the right choice. But now that the new architecture is the default in React Native, it’s time to address the problem.

Starting with this release, custom (non-auto-generated) C++ shadow nodes are included. This makes `OverKeyboardView` work as expected under the Fabric renderer.

> ⚠️ **If you hit any build issues, make a [clean](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/786#issuecomment-2741464142) build and try again. Still having problems? Open an [issue](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/new?template=bug_report.md) and I’ll help you out.**

## ✨ Summary[​](/react-native-keyboard-controller/blog/use-keyboard-state.md#-summary "Direct link to ✨ Summary")

This is a relatively small release focused on tightening up the internals and laying the groundwork for future updates.

While it doesn’t introduce any game-changing features, it plays an important role in ensuring that custom C++ shadow nodes can be successfully integrated across projects using the new React Native architecture. Think of it as a bridge release — stabilizing key parts of the system to unlock bigger things coming soon 🙌

## 🚀 What's next?[​](/react-native-keyboard-controller/blog/use-keyboard-state.md#-whats-next "Direct link to 🚀 What's next?")

As always, my top priority is resolving open issues. Beyond that, here’s what’s coming up:

* Support for `react-native@0.79`;
* A new `KeyboardExtender` component that gets embedded directly into the keyboard;
* `KeyboardToolbar.Group` component to split multiple inputs into groups, each with its own navigation and state;
* A complete rewrite of `KeyboardAwareScrollView` that will use cursor position instead of layout-based detection.

Stay tuned and follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [useKeyboardState](/react-native-keyboard-controller/blog/tags/use-keyboard-state.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2025-04-09-release-1-17/index.mdx)
