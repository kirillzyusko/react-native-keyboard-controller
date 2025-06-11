# New OverKeyboardView component

October 1, 2024 ·

<!-- -->

3 min read

[![Kirill Zyusko](https://github.com/kirillzyusko.png)](https://github.com/kirillzyusko)

[Kirill Zyusko](https://github.com/kirillzyusko)

Library author

Meet new `OverKeyboardView` component and corresponding `1.14.0` release! 🎉

<!-- -->

## What is `OverKeyboardView`?[​](/react-native-keyboard-controller/blog/over-keyboard-view.md#what-is-overkeyboardview "Direct link to what-is-overkeyboardview")

`OverKeyboardView` is a new component that allows you to display your content **over** the keyboard. It's a great way to create a *modal-like* experience with a natural transitions between windows in your application without closing or hiding the keyboard. Say "no" to instant keyboard transitions, jumps, glitches, bouncy UI and other things and use the component that "just works":

<!-- -->

[](/react-native-keyboard-controller/video/over-keyboard-view-shared-transitions.mp4)

This component is perfect for countless applications! Whether you're building a photo gallery app or crafting a custom context menu that floats seamlessly over the screen (keeping the content behind visible while keyboard stays open) - the `OverKeyboardView` is the solution you've been waiting for!

## How to use it?[​](/react-native-keyboard-controller/blog/over-keyboard-view.md#how-to-use-it "Direct link to How to use it?")

To use `OverKeyboardView` you need to wrap your content with it and pass `visible` prop to it. When `visible` is `true` the content will be displayed over the keyboard.

```
import { OverKeyboardView } from "react-native-keyboard-controller";

const App = () => {
  const [visible, setVisible] = useState(false);

  return (
    <OverKeyboardView visible={visible}>
      {/* Your content here */}
    </OverKeyboardView>
  );
};
```

You can also check a dedicated [API page](/react-native-keyboard-controller/docs/api/over-keyboard-view.md) to learn more about it.

## What's else packed in a new release?[​](/react-native-keyboard-controller/blog/over-keyboard-view.md#whats-else-packed-in-a-new-release "Direct link to What's else packed in a new release?")

Apart of a new feature this release contains mostly bugfixes that touches an integration aspect, such as:

* `KeyboardToolbar` can work in `Modal` on Android ([#590](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/590));
* `KeyboardAwareScrollView` can use `ScrollView` from `react-native-gesture-handler` ([#595](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/595));
* `OverKeyboardView` in invisible state is not hiding `ScrollView` ([#598](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/598));
* `OverKeyboardView` works with `GestureDetector` on Android ([#602](https://github.com/kirillzyusko/react-native-keyboard-controller/pull/602));

Other than that I also improved documentation of the package, update linters and did other various maintenance tasks.

## What's next?[​](/react-native-keyboard-controller/blog/over-keyboard-view.md#whats-next "Direct link to What's next?")

I see that the library becomes more and more popular, and next several months I'd like to focus on making stability of this library better. It's already pretty stable and good, but when it comes to the integration in big projects people are encountering some issues and reporting it. So my near-term goal is to improve the stability of the library and make it more stable for everyone.

If you have a pain-points when you have to deal with keyboard in `react-native` applications, please feel free to contribute to the project by submitting issues or pull requests on GitHub. Let's continue to make `react-native-keyboard-controller` an essential tool for developers building high-quality mobile applications! 💪

To stay tuned follow me on [Twitter](https://twitter.com/ziusko) and [GitHub](https://github.com/kirillzyusko) for updates. Thank you for your support! 😊

**Tags:**

* [react-native](/react-native-keyboard-controller/blog/tags/react-native.md)
* [keyboard](/react-native-keyboard-controller/blog/tags/keyboard.md)
* [modal](/react-native-keyboard-controller/blog/tags/modal.md)
* [over keyboard view](/react-native-keyboard-controller/blog/tags/over-keyboard-view.md)

[Edit this page](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/docs/blog/2024-10-01-over-keyboard-view/index.mdx)
