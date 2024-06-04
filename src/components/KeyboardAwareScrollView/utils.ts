export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  worklet: F,
  wait = 0,
) => {
  "worklet";

  const value = {
    time: 0,
  };

  return (...args: Parameters<F>): ReturnType<F> | void => {
    "worklet";

    const t = Date.now();
    const now = t - value.time;

    if (now < wait) {
      value.time = t;
      return;
    }

    value.time = t;

    return worklet(...args);
  };
};
