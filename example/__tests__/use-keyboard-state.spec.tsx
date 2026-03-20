import { renderHook } from "@testing-library/react-native";
import { useKeyboardState } from "react-native-keyboard-controller";

describe("`useKeyboardState` specification", () => {
  it("should return mocked state", () => {
    const { result } = renderHook(() => useKeyboardState());

    expect(result.current).toStrictEqual({
      isVisible: false,
      height: 0,
      duration: 0,
      timestamp: 0,
      target: 0,
      type: "default",
      appearance: "default",
    });
  });
});
