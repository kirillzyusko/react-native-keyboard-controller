import type { SharedValue } from "react-native-reanimated";

export const sv = <T>(initial: T): SharedValue<T> => {
  return { value: initial } as SharedValue<T>;
};
