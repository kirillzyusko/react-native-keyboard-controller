---
sidebar_position: 6
description: Frequently asked questions and answers on them
keywords:
  [
    react-native-keyboard-controller,
    react-native keyboard,
    installation,
    setup,
    keyboard handling,
    keyboard animation,
    keyboard movement,
    troubleshooting,
  ]
---

# FAQ

## Usage with `useAnimatedKeyboard` hook from `react-native-reanimated`

`react-native-keyboard-controller` and `useAnimatedKeyboard` hook (from `react-native-reanimated`) _**may**_ technically be used together, but it's **highly recommended** to use only one of them to avoid any kind of conflicts.

If you want to know the difference between `useAnimatedKeyboard` and the implementation of this library, please read [this comparison](./recipes/architecture#what-is-the-difference-between-useanimatedkeyboard-from-react-native-reanimated-and-this-library).
