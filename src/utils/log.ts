const __DEV__ = process.env.NODE_ENV === "development";

export const log = (...args: any[]) => {
  "worklet";

  if (__DEV__) {
    console.log("[KeyboardController]", ...args);
  }
};
