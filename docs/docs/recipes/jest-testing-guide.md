---
sidebar_position: 3
---

# Jest testing guide

This library includes a built in mock for Jest. To use it, add the following code to the [jest setup](https://jestjs.io/docs/configuration#setupfiles-array) file:

```js
jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest')
);
```
