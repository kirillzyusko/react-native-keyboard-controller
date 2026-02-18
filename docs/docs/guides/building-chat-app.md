---
sidebar_position: 5
description: A guide that explores pitfalls of building chat app layout and shows how to solve them using ChatKit component
keywords:
  [
    react-native-keyboard-controller,
    react-native,
    keyboard,
    chat,
    ChatKit,
    chat-kit,
  ]
---

# Building a chat app

Handling keyboard in chat applications was always a challenge, even on native platforms. The main issue is that chat apps almost fully utilize advanced functionality of the keyboard, such as interactive dismissal etc. This makes it hard to handle keyboard events in a simple way. And it makes it even hard to build a chat app layout that will work well on all platforms and delivers a great user experience along with 60/120FPS animations even on low-end devices.

If you tried to use components from [components overview](./components-overview) guide to handle keyboard events in a chat app, you may have noticed that there is no good solutions for your use case:

- if you use `KeyboardAvoidingView` with `behavior="padding"` or `behavior="height"` you may see [frame junks](https://github.com/software-mansion/react-native-reanimated/issues/6854), especially if your layout is very complex.
- if you use `KeyboardAvoidingView` with `behavior="translate-with-padding"` you may see that it's [impossible](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/951) to render first message in chat from the top of the screen.
- if you use `KeyboardAvoidingView` and use interactive dismissal on iOS you could observe [double scroll](https://github.com/kirillzyusko/react-native-keyboard-controller/issues/594#issuecomment-2406860730) problem.

All these problems stems from the fact that these components were designed before chat-apps became a trend. And using generic-purpose components for specific functionality will always result in a poor user experience.

That being said that you always had to go to compromises and workarounds to make it work. And that's why we created a separate `ChatKit` component that aims to solve all these problems and provide a solid foundation for building a chat app.

## What is `ChatKit`?

## API reference

An API reference for `ChatKit` can be found [in `ChatKit` section](../api/components/chat-kit).
