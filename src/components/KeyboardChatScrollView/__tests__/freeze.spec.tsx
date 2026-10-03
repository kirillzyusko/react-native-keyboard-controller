import { render } from "@testing-library/react-native";
import React from "react";

import KeyboardChatScrollView from "..";
import { sv } from "../../../__fixtures__/sv";

import type { SharedValue } from "react-native-reanimated";

const mockReceivedFreeze: Record<string, SharedValue<boolean>> = {};

jest.mock("../useChatKeyboard", () => ({
  useChatKeyboard: (
    _ref: unknown,
    options: { freeze: SharedValue<boolean> },
  ) => {
    mockReceivedFreeze.useChatKeyboard = options.freeze;

    return {
      padding: { value: 0 },
      currentHeight: { value: 0 },
      contentOffsetY: undefined,
      scroll: { value: 0 },
      layout: { value: { width: 0, height: 0 } },
      size: { value: { width: 0, height: 0 } },
      onLayout: jest.fn(),
      onContentSizeChange: jest.fn(),
    };
  },
}));
jest.mock("../useExtraContentPadding", () => ({
  useExtraContentPadding: (options: { freeze: SharedValue<boolean> }) => {
    mockReceivedFreeze.useExtraContentPadding = options.freeze;
  },
}));
jest.mock("../useFrozenPadding", () => ({
  useFrozenPadding: (options: { freeze: SharedValue<boolean> }) => {
    mockReceivedFreeze.useFrozenPadding = options.freeze;
  },
}));
jest.mock("../useEndVisible", () => ({ useEndVisible: jest.fn() }));
jest.mock("../../ScrollViewWithBottomPadding", () => ({
  __esModule: true,
  default: () => null,
}));

beforeEach(() => {
  for (const key of Object.keys(mockReceivedFreeze)) {
    delete mockReceivedFreeze[key];
  }
});

describe("`KeyboardChatScrollView` freeze", () => {
  it("should pass a shared-value `freeze` to every consumer as is", () => {
    const freeze = sv(false);

    render(<KeyboardChatScrollView freeze={freeze} />);

    expect(mockReceivedFreeze.useChatKeyboard).toBe(freeze);
    expect(mockReceivedFreeze.useExtraContentPadding).toBe(freeze);
    expect(mockReceivedFreeze.useFrozenPadding).toBe(freeze);
  });

  it("should expose a synchronous `freeze` write to the keyboard handlers at once", () => {
    const freeze = sv(false);

    render(<KeyboardChatScrollView freeze={freeze} />);
    freeze.value = true;

    expect(mockReceivedFreeze.useChatKeyboard.value).toBe(true);
  });

  it("should keep supporting a boolean `freeze`", () => {
    render(<KeyboardChatScrollView freeze />);

    expect(mockReceivedFreeze.useChatKeyboard.value).toBe(true);
    expect(mockReceivedFreeze.useFrozenPadding).toBe(
      mockReceivedFreeze.useChatKeyboard,
    );
  });
});
