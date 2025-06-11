# Enhanced events metadata - say goodbye to guesswork and hello to precision!

August 25, 2023 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

I'm thrilled to unveil the latest upgrade to the `react-native-keyboard-controller` library - version `1.6.0`! This release is all about empowering developers like you with enhanced event metadata, providing you with advanced techniques to take your keyboard handling to the next level.

<!-- -->

**Say goodbye to guesswork and hello to precision!** React Native Keyboard Controller `1.6.0` introduces a trio of new fields in the event metadata that will revolutionize the way you manage keyboard interactions in your React Native applications 😎

## Key features[​](/react-native-keyboard-controller/blog/enhanced-metadata.md#key-features "Direct link to Key features")

Below you can find a list of key features added in this release 😊

### Timestamp: Sync your animations seamlessly[​](/react-native-keyboard-controller/blog/enhanced-metadata.md#timestamp-sync-your-animations-seamlessly "Direct link to Timestamp: Sync your animations seamlessly")

The addition of the `timestamp` field in the event metadata marks a breakthrough in keyboard handling. Now, you can precisely calculate the delay between an event occurring in the native thread and its propagation to JavaScript. This level of accuracy enables you to orchestrate keyboard handling with finesse, ensuring a seamless and visually pleasing user experience.

### Target: Layout mastery at your fingertips[​](/react-native-keyboard-controller/blog/enhanced-metadata.md#target-layout-mastery-at-your-fingertips "Direct link to Target: Layout mastery at your fingertips")

Unlock the potential of enhanced layout handling with the `target` field in event metadata. By accessing the view tag of the focused field, you can synchronously retrieve layout information. This newfound capability empowers you to make real-time adjustments to your UI elements based on the active input, creating a fluid and context-aware user interface.

### Duration: Elevate animation fluidity[​](/react-native-keyboard-controller/blog/enhanced-metadata.md#duration-elevate-animation-fluidity "Direct link to Duration: Elevate animation fluidity")

Experience the art of animation depth with the `duration` field in event metadata. If you're aiming for parallax-like effects without the intricacies of frame-in-frame keyboard animations, this feature is your key! Define the `duration` of the keyboard animation to achieve a captivating parallax effect that adds a touch of elegance to your app's visual appeal.

## What's next?[​](/react-native-keyboard-controller/blog/enhanced-metadata.md#whats-next "Direct link to What's next?")

I'm also excited to share a sneak peek into what's on the horizon 😎

During the `1.6.0` development cycle, I've delved even deeper into keyboard handling, uncovering insights that will shape the way you interact with keyboards in your React Native apps. So my investigation has inspired a new API that will make keyboard interactions more intuitive and seamless. Whether you're a seasoned developer or just starting out, managing keyboards will become a breeze.

Also I will be actively addressing GitHub issues and ensuring compatibility with the latest React Native version. My commitment to excellence means you can rely on a stable and up-to-date library 😊

Follow me on [Twitter](https://twitter.com/ziusko) for updates. Thank you for your support!

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [focused text input](/react-native-keyboard-controller/blog/tags/focused-text-input.md)
* [duration](/react-native-keyboard-controller/blog/tags/duration.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2023-08-25-enhanced-metadata/index.mdx)
