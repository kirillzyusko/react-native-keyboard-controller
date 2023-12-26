---
slug: set-enabled
title: New setEnabled method
authors: [kirill]
tags: [react-native, keyboard, setEnabled]
keywords: [react-native-keyboard-controller, keyboard, setEnabled]
---

I'm thrilled to announce the release of `react-native-keyboard-controller` version `1.8.0`. With this latest release, I introduce the `useKeyboardController` hook and `setEnabled` method, which allows for a gradual integration of the library into your project, enabling you to disable the module on specific screens as needed. This flexible feature ensures that your app's keyboard behavior remains seamless and user-friendly.

<!-- truncate -->

## What's New in Version 1.8.0: The `setEnabled` Hook

The star feature of `react-native-keyboard-controller` version `1.8.0` is the introduction of the `setEnabled` method. This method provides developers with granular control over when and where the library's keyboard management should be active.

### How to Use `setEnabled`

Using the `setEnabled` method is incredibly straightforward. Here's a quick example of how to integrate it into your React Native project:

```tsx
import { useKeyboardController } from "react-native-keyboard-controller";

const { enabled, setEnabled } = useKeyboardController();

// if you want to know whether is module active at the moment
console.log(enabled);

// disable keyboard controller on a specific screen
setEnabled(false);
```

In this example, we're importing the `useKeyboardController` hook from the `react-native-keyboard-controller` library. This hook returns `setEnabled` method (which you can use to disable keyboard management for a specific screen) and `enabled` variable (indicating whether the module is active now or not).

When you disable the module using `setEnabled(false)`, the screen will fallback to the default `Android` behavior, automatically resizing based on `AndroidManifest` preferences (`android:windowSoftInputMode`). This level of control allows you to tailor the keyboard experience to your app's unique needs on a per-screen basis.

### Use Cases for `setEnabled`

The `setEnabled` method is incredibly versatile and can be employed in various scenarios:

- **Forms**: Disable keyboard management on screens with simple forms that don't require custom keyboard management.

- **Chat Interfaces**: Keep keyboard management enabled for chat screens, ensuring smooth and consistent user experiences during messaging interactions.

- **Gradual Integration**: Tailor keyboard functionality on specific pages where you require precise control over how the keyboard behaves, while leaving other screens unaffected by these adjustments.

## Conclusion

`react-native-keyboard-controller` continues to evolve, making it an essential tool for React Native developers who want to provide exceptional user experiences in their mobile apps.

With the introduction of the `setEnabled` method in version `1.8.0`, you now have even more control over keyboard behavior, ensuring that your app feels polished and responsive 😎

To get started with the latest version, check out the [official documentation](../) and explore the new possibilities that the `setEnabled` method offers.

Upgrade your React Native project today and take your keyboard management to the next level with `react-native-keyboard-controller` version `1.8.0`!

Stay tuned for future updates and releases as I continue to enhance the `react-native-keyboard-controller` library. Follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊
