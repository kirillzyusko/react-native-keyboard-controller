# Mastering keyboard management 🥷🏼

December 12, 2024 ·

<!-- -->

5 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

Today I'm glad to announce a new `1.15.0` version of `react-native-keyboard-controller` 🎉

This release mainly focuses on managing keyboard state, improving keyboard dismissal interactions and API enhancements, so let's go and see which new features this release brings 👇

## Changes to `dismiss` method[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#changes-to-dismiss-method "Direct link to changes-to-dismiss-method")

### `dismiss` method now returns a promise[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#dismiss-method-now-returns-a-promise "Direct link to dismiss-method-now-returns-a-promise")

Previously, the `dismiss` method was synchronous, which meant that you couldn't determine the moment when keyboard is fully hidden. Typically many developers were using one time listener that was resolving a promise or executing the code that had to be executed after keyboard dismissal. The code could look like this:

```
import {
  KeyboardController,
  KeyboardEvents,
} from "react-native-keyboard-controller";

const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
  setVisible(true);
  subscription.remove();
});

KeyboardController.dismiss();
```

Now, `dismiss` returns a promise, so you can use it in `async` way:

```
import { KeyboardController } from "react-native-keyboard-controller";

await KeyboardController.dismiss();
setVisible(true);
```

Much cleaner and more readable code! 💪

### `dismiss` now blurs input by default[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#dismiss-now-blurs-input-by-default "Direct link to dismiss-now-blurs-input-by-default")

The previous behavior of `dismiss` was keeping the focus on the input on Android and blurring the input on iOS. This behavior was not very intuitive and such inconsistency could causing a lot of issues. Now, the default behavior is to blur the input on both platforms 😎

Though a rhetorical question might be raised - **"I liked the old behavior, when input still hold the focus 🤷‍♂️. How to restore a previous behavior?"** We hear you! 👇

### `dismiss` now accepts a `keepFocus` parameter[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#dismiss-now-accepts-a-keepfocus-parameter "Direct link to dismiss-now-accepts-a-keepfocus-parameter")

Sometimes you might want to keep the focus on the input, even after keyboard is dismissed. This way users can understand which field was focused the last. If you want to achieve this behavior, you can pass `keepFocus` parameter to `dismiss` method:

```
KeyboardController.dismiss({ keepFocus: true });
```

## New `KeyboardController` API methods[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#new-keyboardcontroller-api-methods "Direct link to new-keyboardcontroller-api-methods")

We finished with dismissal part. But the counter part of dismissal is the checking current keyboard state. This release is packed with 2 new methods that aims to simplify the keyboard state checks and achieve a parity with `react-native` API 😊

### New `isVisible` method[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#new-isvisible-method "Direct link to new-isvisible-method")

This method acts as a `Keyboard.isVisible()` method from `react-native` and returns `true` if keyboard is currently visible and `false` otherwise.

You can use it to check keyboard visibility on demand without a need to create listeners.

### New `.state()` method[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#new-state-method "Direct link to new-state-method")

The new method returns the last keyboard state. It returns `null` if keyboard was not shown in the app yet.

This method acts similar to `Keyboard.metrics()` from `react-native` and returns the current keyboard state. The reason why it is named `state` instead of `metrics` is because it returns a different data structure and it's not a drop-in replacement for `Keyboard.metrics()`. However you can achieve the same results using `KeyboardController.state()` (because it gives an access to `height` value) and even more - you can use other properties, such as `type`, `appearance`, `target`, `timestamp` etc. to get more information about the keyboard.

## Better `KeyboardStickyView` and `KeyboardToolbar` interoperability[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#better-keyboardstickyview-and-keyboardtoolbar-interoperability "Direct link to better-keyboardstickyview-and-keyboardtoolbar-interoperability")

`KeyboardStickyView` and `KeyboardToolbar` also got some useful improvements 😊

### `KeyboardToolbar` now accepts `KeyboardStickyView` props[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#keyboardtoolbar-now-accepts-keyboardstickyview-props "Direct link to keyboardtoolbar-now-accepts-keyboardstickyview-props")

The `KeyboardToolbar` is based on `KeyboardStickyView`. However before it wasn't exposing some of `KeyboardStickyView` properties.

I fixed that problem and `KeyboardToolbar` now accepts the same properties that `KeyboardStickyView` has, thus making a better interoperability between these two components.

### `KeyboardStickyView` got new `enabled` prop[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#keyboardstickyview-got-new-enabled-prop "Direct link to keyboardstickyview-got-new-enabled-prop")

Before `KeyboardAwareScrollView` and `KeyboardAvoidingView` had `enabled` property, but somehow I forgot to add that property to `KeyboardStickyView` 😬. The `1.15.0` release fixes this problem and now `KeyboardStickyView` also has `enabled` property.

When this property is turned on, then `KeyboardStickyView` follows the keyboard. When property disabled, then it just moves the component into a position as keyboard wasn't shown yet.

## `KeyboardEvents` metadata enhancements[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#keyboardevents-metadata-enhancements "Direct link to keyboardevents-metadata-enhancements")

This release enhances `KeyboardEventData` with new properties.

### New `type` property[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#new-type-property "Direct link to new-type-property")

In this release I added new `type` property which reflects [keyboardType](https://reactnative.dev/docs/textinput#keyboardtype) value. Using this property you can understand more about which keyboard type is shown at the moment.

### New `appearance` property[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#new-appearance-property "Direct link to new-appearance-property")

This release adds a new `appearance` property which reflects keyboard appearance and can be one of `light`/`dark`/`default` values. This property is available on iOS and Android.

## What's next?[​](/react-native-keyboard-controller/blog/mastering-keyboard-management.md#whats-next "Direct link to What's next?")

The main goal of this release was making `KeyboardGestureArea` available on iOS. I implemented necessary changes in [this PR](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/727) (which would allow to use `offset` property for interactive dismissal). But when I decided to test Fabric I discovered many issues, which basically makes this component unusable on iOS. Since I already merged many PRs that extend library functionality I decided not to pause release process for months and prepare `1.15.0` now. I'm not abandoning the idea of adding `offset` to interactive keyboard dismissal. I just think it's not a right time for the release of this feature.

As support timeline for this release I'm planning to resolve some old known issues in the library to be sure this library is bug-free and can be used in various complex applications!

Stay tuned and follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [dismiss](/react-native-keyboard-controller/blog/tags/dismiss.md)
* [keepFocus](/react-native-keyboard-controller/blog/tags/keep-focus.md)
* [state](/react-native-keyboard-controller/blog/tags/state.md)
* [isVisible](/react-native-keyboard-controller/blog/tags/is-visible.md)
* [type](/react-native-keyboard-controller/blog/tags/type.md)
* [appearance](/react-native-keyboard-controller/blog/tags/appearance.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2024-12-12-release-1-15/index.mdx)
