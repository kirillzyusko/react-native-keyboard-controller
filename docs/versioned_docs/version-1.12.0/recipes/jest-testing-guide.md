---
sidebar_position: 3
description: A testing-guide showing how to write unit-tests using jest
keywords: [react-native-keyboard-controller, jest, mock, testing]
---

# Jest testing guide

## Setting up a mock

This library includes a built in mock for Jest. To use it, add the following code to the [jest setup](https://jestjs.io/docs/configuration#setupfiles-array) file:

```js
jest.mock("react-native-keyboard-controller", () =>
  require("react-native-keyboard-controller/jest"),
);
```

## Test case example

Once you've set up mock - you can write your first test 😊. A sample of test case is shown below. For more test cases please see [this](https://github.com/kirillzyusko/react-native-keyboard-controller/tree/main/example/__tests__) link.

```tsx
import "@testing-library/jest-native/extend-expect";
import React from "react";
import { Animated } from "react-native";
import { render } from "@testing-library/react-native";

import { useKeyboardAnimation } from "react-native-keyboard-controller";

function TestComponent() {
  const { height } = useKeyboardAnimation();

  return (
    <Animated.View
      testID="view"
      style={{ transform: [{ translateY: height }] }}
    />
  );
}

describe("basic keyboard interaction", () => {
  it("should have different styles depends on position", () => {
    const { getByTestId, update } = render(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({ transform: [{ translateY: 0 }] });

    (useKeyboardAnimation as jest.Mock).mockReturnValue({
      height: new Animated.Value(150),
      progress: new Animated.Value(0.5),
    });
    update(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({
      transform: [{ translateY: 150 }],
    });

    (useKeyboardAnimation as jest.Mock).mockReturnValue({
      height: new Animated.Value(300),
      progress: new Animated.Value(1),
    });
    update(<TestComponent />);

    expect(getByTestId("view")).toHaveStyle({
      transform: [{ translateY: 300 }],
    });
  });
});
```
