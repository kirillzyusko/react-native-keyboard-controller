---
sidebar_position: 5
description: A guide that explores the challenges of building chat app layouts and shows how to solve them using the KeyboardChatScrollView component
keywords:
  [
    react-native-keyboard-controller,
    react-native,
    keyboard,
    chat,
    KeyboardChatScrollView,
  ]
---

# Building a chat app

Keyboard handling in chat applications has always been one of the trickiest problems in mobile development — even on native platforms. Chat apps push keyboard interactions to their limits: interactive dismissal, content repositioning, smooth transitions between the keyboard and custom input views, and all of it at 120 FPS. Getting this right requires deep integration between the keyboard, scroll views, and layout systems — far more than a general-purpose component can offer.

## Why general-purpose components fall short

You might be tempted to reach for `KeyboardAvoidingView` or `KeyboardAwareScrollView` to handle keyboard interactions in a chat app. While these components work well for forms, settings screens, and other straightforward layouts, they weren't designed for the unique demands of a chat interface.

Here's what you'll run into:

- **Frame drops with complex layouts** — `KeyboardAvoidingView` with `behavior="padding"` or `behavior="height"` can cause [frame drops](https://github.com/software-mansion/react-native-reanimated/issues/6854), particularly when the layout is complex.
- **First-message rendering issues** — using `behavior="translate-with-padding"` makes it [impossible](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/951) to render the first message at the top of the screen.
- **Double scroll on interactive dismissal** — combining `KeyboardAvoidingView` with interactive keyboard dismissal on iOS leads to a [double-scroll problem](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/594#issuecomment-2406860730).

These aren't edge cases — they're fundamental mismatches between what generic components were designed to do and what chat apps actually need. You can work around them, but you'll end up writing a lot of platform-specific code to get a polished result.

## What chat apps actually need

Despite the complexity, most chat apps share the same set of keyboard-related requirements:

- **Content repositioning** — push messages up when the keyboard appears (with the option to disable this in certain cases).
- **Interactive dismissal** — let users swipe the keyboard away with a drag gesture.
- **Content freezing** — hold the chat in place when switching from the keyboard to a custom input view like an emoji picker or bottom sheet.
- **Virtualized list support** — work seamlessly with `FlatList`, `FlashList`, `LegendList`, and other virtualized list implementations.
- **Smooth animations** — maintain 60/120 FPS during keyboard transitions, even on low-end devices.
- **Keyboard padding** — extend the scrollable area to account for keyboard height.
- **Custom offsets** — support layouts where the chat isn't flush against the bottom of the screen.

Implementing all of this from scratch is a significant undertaking. That's why we built `KeyboardChatScrollView` — a dedicated component that handles all of these behaviors out of the box, so you can focus on building your chat experience rather than fighting the keyboard.

## What is `KeyboardChatScrollView`?

`KeyboardChatScrollView` is a purpose-built component for chat app layouts. It provides all the requirements listed above.

## Example

## API reference

For the full list of props and usage examples, see the [`KeyboardChatScrollView` API reference](../api/components/keyboard-chat-scroll-view).
