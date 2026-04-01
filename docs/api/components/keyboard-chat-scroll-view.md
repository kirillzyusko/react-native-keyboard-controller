# KeyboardChatScrollView

`KeyboardChatScrollView` is a purpose-built component for chat application layouts. It handles keyboard appearance, interactive dismissal, and content repositioning with smooth 60/120 FPS animations — all the keyboard behaviors that chat apps need, but general-purpose components ***struggle*** to deliver.

<!-- -->

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/always.mp4)

## Props[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#props "Direct link to Props")

### [`ScrollView Props`](https://reactnative.dev/docs/scrollview#props)[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#scrollview-props "Direct link to scrollview-props")

Inherits all [ScrollView Props](https://reactnative.dev/docs/scrollview#props).

### `ScrollViewComponent`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#scrollviewcomponent "Direct link to scrollviewcomponent")

Custom component that will be used as a `ScrollView`. Default is `ScrollView`.

When to use it?

If you want to use `ScrollView` from `react-native-gesture-handler` you can pass it as a `ScrollViewComponent` prop.

```
import { ScrollView } from "react-native-gesture-handler";

<KeyboardChatScrollView ScrollViewComponent={ScrollView} />;
```

### `freeze`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#freeze "Direct link to freeze")

When `true`, freezes all keyboard-driven layout changes. This is useful when dismissing the keyboard to show a custom input view (such as an emoji picker or bottom sheet) — it prevents the chat content from shifting while the transition happens.

### `inverted`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#inverted "Direct link to inverted")

Set to `true` if your list uses the `inverted` prop (the standard pattern for chat-style lists where the newest messages appear at the bottom).

### `keyboardLiftBehavior`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#keyboardliftbehavior "Direct link to keyboardliftbehavior")

Controls how the chat content responds when the keyboard appears. Defaults to `"always"`.

#### `always`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#always "Direct link to always")

Content always lifts with the keyboard, keeping the bottom messages visible **regardless** of the current scroll position. This is the most common chat app behavior, used by **Telegram**, **WhatsApp**, and others.

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/always.mp4)

#### `whenAtEnd`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#whenatend "Direct link to whenatend")

Content lifts only when the scroll view is **at the end** (i.e., the last message is visible or near the bottom). If the user has scrolled up to read older messages, the keyboard won't push the content around. This matches the **ChatGPT** mobile app behavior.

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/when-at-end.mp4)

#### `persistent`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#persistent "Direct link to persistent")

Content lifts when the keyboard appears, but **does not drop back** when the keyboard hides. The scroll position stays where it was pushed to. This matches the **Claude** mobile app behavior.

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/persistent.mp4)

#### `never`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#never "Direct link to never")

Content never moves in response to the keyboard. The keyboard simply overlaps the chat. This matches the **Perplexity** app behavior.

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/never.mp4)

### `offset`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#offset "Direct link to offset")

The distance between the bottom of the screen and the `ScrollView`. When the keyboard appears, the `ScrollView` will only push content by the effective distance (`keyboardHeight - offset`) instead of the full keyboard height. Defaults to `0`.

This is useful when the input is not at the very bottom of the screen — for example, when the `ScrollView` sits above a **safe area** inset, **bottom tabs**, or **any other fixed-height element**. In that case, set `offset` to the height of the elements between the `ScrollView` and the bottom of the screen.

### `extraContentPadding`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#extracontentpadding "Direct link to extracontentpadding")

A [Reanimated `SharedValue<number>`](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/) representing additional padding introduced by an element **outside** the keyboard — for example, a growing multiline `TextInput` inside a `KeyboardStickyView`.

When this value changes, `KeyboardChatScrollView` does two things:

1. **Extends the scrollable range** — the extra amount is added to `contentInset`, keeping all content reachable.
2. **Adjusts the scroll position** — conditionally, based on `keyboardLiftBehavior`, so the bottom messages stay visible as the input grows.

When to use it?

Use `extraContentPadding` whenever an element that is **not** the keyboard changes the amount of space the chat list has to work with. The most common case is a multiline text input that grows as the user types.

note

The value must be a `SharedValue` (from `useSharedValue`) — not a plain number — so that changes are tracked on the UI thread without triggering a React re-render.

### `applyWorkaroundForContentInsetHitTestBug`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#applyworkaroundforcontentinsethittestbug "Direct link to applyworkaroundforcontentinsethittestbug")

When `true`, applies a runtime workaround for a React Native 0.81+ bug where the ScrollView's `contentInset` area does not respond to touch/scroll gestures ([facebook/react-native#54123](https://github.com/facebook/react-native/issues/54123)).

This uses Objective-C runtime method swizzling on the ScrollView's container view, which is inherently fragile. **Only enable if you are affected by the upstream bug and understand the risks.**

**iOS only.** Defaults to `false`.

warning

This prop uses runtime method swizzling, which can be fragile and may conflict with other libraries or future React Native versions. Use with caution and thoroughly test your app when enabling this workaround.

### `blankSpace`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#blankspace "Direct link to blankspace")

A [Reanimated `SharedValue<number>`](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/) representing a minimum inset floor for the bottom padding.

When set, the total bottom padding is computed as:

```
max(blankSpace, keyboardPadding + extraContentPadding);
```

This means the keyboard "absorbs" into the minimum padding rather than adding to it:

#### When `blankSpace >= keyboard + extraContentPadding`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#when-blankspace--keyboard--extracontentpadding "Direct link to when-blankspace--keyboard--extracontentpadding")

Content does **not** move when the keyboard opens or closes — the minimum padding is large enough to absorb the keyboard height.

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/blankSpaceGreaterThan.mp4)

#### When `blankSpace < keyboard + extraContentPadding`[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#when-blankspace--keyboard--extracontentpadding-1 "Direct link to when-blankspace--keyboard--extracontentpadding-1")

Content moves, but only by the **excess amount** beyond the minimum floor.

[](/react-native-keyboard-controller/video/keyboard-chat-scroll-view/blankSpaceLessThan.mp4)

When to use it?

Use `blankSpace` in AI chat applications where a sent message needs space below it to push it to the top of the viewport while the AI response streams in. The minimum padding ensures this space remains available without causing additional movement when the keyboard opens.

note

The value must be a `SharedValue` (from `useSharedValue`) — not a plain number — so that changes are tracked on the UI thread without triggering a React re-render.

iOS contentInset hit-test bug

On **iOS with React Native 0.81+**, the `contentInset` area created by `blankSpace` may not respond to touch/scroll gestures due to [facebook/react-native#54123](https://github.com/facebook/react-native/issues/54123).

To fix this, you must either:

* Set `applyWorkaroundForContentInsetHitTestBug={true}` on `KeyboardChatScrollView`, **or**
* Apply a patch to React Native that fixes the upstream bug

Without one of these solutions, users won't be able to scroll or interact with content in the minimum padding area.

## Usage with virtualized lists[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#usage-with-virtualized-lists "Direct link to Usage with virtualized lists")

`KeyboardChatScrollView` doesn't ship with built-in wrappers for third-party virtualized list libraries, but since all of them (`FlatList`, `FlashList`, `LegendList`) accept a custom scroll component, integration is straightforward.

First, create a wrapper component:

VirtualizedListScrollView\.tsx

```
import React, { forwardRef } from "react";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";

import type { ScrollViewProps } from "react-native";
import type { KeyboardChatScrollViewProps } from "react-native-keyboard-controller";

type Ref = React.ElementRef<typeof KeyboardChatScrollView>;

const VirtualizedListScrollView = forwardRef<
  Ref,
  ScrollViewProps & KeyboardChatScrollViewProps
>((props, ref) => {
  return (
    <KeyboardChatScrollView
      ref={ref}
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      {...props}
    />
  );
});

export default VirtualizedListScrollView;
```

Then pass it to your list via `renderScrollComponent`:

FlashList

```
<FlashList
  ref={ref}
  data={messages}
  keyExtractor={(item) => item.text}
  renderItem={({ item }) => <Message {...item} />}
  renderScrollComponent={VirtualizedListScrollView}
/>
```

FlatList/LegendList

```
const memoList = useCallback(
  (props: ScrollViewProps) => <VirtualizedListScrollView {...props} />,
  [],
);

<FlatList
  ref={ref}
  data={messages}
  keyExtractor={(item) => item.text}
  renderItem={({ item }) => <Message {...item} />}
  renderScrollComponent={memoList}
/>

<LegendList
  ref={ref}
  data={messages}
  keyExtractor={(item) => item.text}
  renderItem={({ item }) => <Message {...item} />}
  renderScrollComponent={memoList}
/>
```

## Example[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#example "Direct link to Example")

<!-- -->

## Design principles[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#design-principles "Direct link to Design principles")

The key idea behind this component is that the `ScrollView` layout **never** changes. Instead of adjusting the **layout** or the `ScrollView` **position**, it changes the content position. To implement a chat interface we need to do two things: extend the scrollable range and adjust the scroll position.

### Extending scroll range[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#extending-scroll-range "Direct link to Extending scroll range")

When the keyboard appears we need to extend the scrollable range. On iOS this is achievable via `contentInset`. On Android it's less straightforward because there is no such property.

To bring support on Android, the `ScrollView` is wrapped with [`ClippingScrollViewDecorator`](https://github.com/kirillzyusko/react-native-keyboard-controller/blob/main/android/src/main/java/com/reactnativekeyboardcontroller/views/ClippingScrollViewDecoratorView.kt) — a custom view built in `react-native-keyboard-controller` that simulates `contentInset` behavior on Android by exposing two additional properties: `contentInsetBottom` and `contentInsetTop`. The usage looks like:

```
<ClippingScrollViewDecorator contentInsetTop={0} contentInsetBottom={0}>
  <ScrollView style={{ flex: 1 }}>{/* ...content... */}</ScrollView>
</ClippingScrollViewDecorator>
```

The `ClippingScrollViewDecorator` should wrap the `ScrollView`. Whenever you change the `contentInsetBottom` or `contentInsetTop` properties, the `contentInset` will be automatically applied to the underlying `ScrollView`.

### Adjusting scroll position[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#adjusting-scroll-position "Direct link to Adjusting scroll position")

The second step is to adjust the scroll position. This is handled differently on iOS and Android.

#### iOS[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#ios "Direct link to iOS")

On iOS we change the [`contentOffset`](https://reactnative.dev/docs/scrollview#contentoffset) property. It works well and without bugs, unlike on Android, so for Android we use a different approach.

#### Android[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#android "Direct link to Android")

On Android we adjust the scroll position inside the [`onMove`](/react-native-keyboard-controller/docs/api/hooks/keyboard/use-keyboard-handler.md#onmove) handler via the [`scrollTo`](https://docs.swmansion.com/react-native-reanimated/docs/scroll/scrollTo/) method on the UI thread from a worklet.

## Troubleshooting[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#troubleshooting "Direct link to Troubleshooting")

### De-synchronized Android animation (new arch only)[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#de-synchronized-android-animation-new-arch-only "Direct link to De-synchronized Android animation (new arch only)")

`KeyboardChatScrollView` relies on a Reanimated commit hook internally. If you're using **Reanimated < 4.3.0**, you need to enable the [`USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS`](https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags/#use_commit_hook_only_for_react_commits) feature flag in your `package.json`:

```
{
  "reanimated": {
    "staticFeatureFlags": {
      "USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS": true
    }
  }
}
```

After adding this, run `pod install` (iOS) and rebuild the app.

Reanimated 4.3.0+ relevance

If you're on **Reanimated 4.3.0+**, this flag is enabled by default — no extra configuration needed.

What it affects?

If you don't enable this flag you'll see de-synchronized keyboard animation on Android/Fabric architecture.

### Missing animations on iOS (new arch only)[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#missing-animations-on-ios-new-arch-only "Direct link to Missing animations on iOS (new arch only)")

On iOS (New Architecture only), updating React state right before a keyboard event can cause animations to be skipped entirely. This happens because a React commit can block Reanimated from applying its animated updates in the same frame.

Common triggers include:

* updating state in the `onFocus` callback of a `TextInput`;
* updating state in response to the `keyboardWillShow` event;
* using `KeyboardToolbar` or other components that trigger a state update before the keyboard appears.

To fix this, enable the [DISABLE\_COMMIT\_PAUSING\_MECHANISM](https://docs.swmansion.com/react-native-reanimated/docs/guides/feature-flags/#disable_commit_pausing_mechanism) feature flag. See the link for detailed setup instructions.

Do I need to enable this flag?

This issue can occur even if the state update comes from a different screen (e.g. a parent navigator). To check, open the React Profiler and look for any React commits that happen just before the keyboard event — if you see one, you likely need this flag.

### `scrollToEnd` doesn't scroll to the correct position when keyboard is open[​](/react-native-keyboard-controller/docs/api/components/keyboard-chat-scroll-view.md#scrolltoend-doesnt-scroll-to-the-correct-position-when-keyboard-is-open "Direct link to scrolltoend-doesnt-scroll-to-the-correct-position-when-keyboard-is-open")

React Native's `FlatList.scrollToEnd()` calculates the scroll offset using `visibleLength` without accounting for the keyboard-adjusted layout. This means calling `listRef.current?.scrollToEnd()` may stop short of the actual end when the keyboard is visible.

**Workaround:** call `scrollToEnd` on the underlying `KeyboardChatScrollView` instead of the `FlatList`. Since `FlatList` internally assigns its own ref to the scroll component, you need a separate ref to reach it. Create a wrapper component that accepts a custom ref prop and forwards it alongside `FlatList`'s internal ref:

```
import { forwardRef, useCallback } from "react";
import { KeyboardChatScrollView } from "react-native-keyboard-controller";

import type { RefCallback } from "react";
import type { ScrollViewProps } from "react-native";

type ChatScrollViewRef = React.ElementRef<typeof KeyboardChatScrollView>;
type ChatScrollViewProps = ScrollViewProps & {
  chatScrollViewRef?: { current: ChatScrollViewRef | null };
};

const ChatScrollView = forwardRef<ChatScrollViewRef, ChatScrollViewProps>(
  ({ chatScrollViewRef, ...props }, ref) => {
    const combinedRef: RefCallback<ChatScrollViewRef> = useCallback(
      (instance) => {
        // forward to FlatList's internal ref
        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }

        // forward to the user-provided ref
        if (chatScrollViewRef) {
          chatScrollViewRef.current = instance as ChatScrollViewRef | null;
        }
      },
      [ref, chatScrollViewRef],
    );

    return <KeyboardChatScrollView ref={combinedRef} {...props} />;
  },
);
```

Then use it with `FlatList` via `renderScrollComponent`:

```
const chatScrollViewRef = useRef<ChatScrollViewRef>(null);

const renderScrollComponent = useCallback(
  (props: ScrollViewProps) => (
    <ChatScrollView {...props} chatScrollViewRef={chatScrollViewRef} />
  ),
  [],
);

<FlatList
  data={messages}
  renderItem={renderItem}
  renderScrollComponent={renderScrollComponent}
/>;

// Instead of listRef.current?.scrollToEnd()
chatScrollViewRef.current?.scrollToEnd();
```
