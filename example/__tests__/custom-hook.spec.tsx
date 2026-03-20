import { useFocusEffect } from "@react-navigation/native";
import { renderHook } from "@testing-library/react-native";
import { useCallback } from "react";
import {
  AndroidSoftInputModes,
  KeyboardController,
  useKeyboardContext,
} from "react-native-keyboard-controller";

jest.mock("@react-navigation/native", () => ({
  useFocusEffect: jest.fn().mockImplementation((cb) => cb()),
}));

function useKeyboardAnimation() {
  useFocusEffect(
    useCallback(() => {
      KeyboardController.setInputMode(
        AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE,
      );

      return () => KeyboardController.setDefaultMode();
    }, []),
  );

  const context = useKeyboardContext();

  return context.animated;
}

describe("custom hook creation", () => {
  it("should render without errors", () => {
    const { result } = renderHook(() => useKeyboardAnimation());

    expect(result).toBeDefined();
  });
});
