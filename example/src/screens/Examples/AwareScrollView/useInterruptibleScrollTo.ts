import { RefObject } from 'react';
import Reanimated, {
  SharedValue,
  cancelAnimation,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useSharedValue,
  useWorkletCallback,
  withTiming,
} from 'react-native-reanimated';

export const useInterruptibleScrollTo = (
  ref: RefObject<Reanimated.ScrollView>,
  currentScroll: SharedValue<number>
) => {
  const destination = useSharedValue({ x: 0, y: 0 });
  const progress = useSharedValue(0);

  useAnimatedReaction(
    () => progress.value,
    (result, previous) => {
      if (result !== previous) {
        scrollTo(
          ref,
          interpolate(result, [0, 1], [0, destination.value.x]),
          interpolate(
            result,
            [0, 1],
            [currentScroll.value, destination.value.y]
          ),
          false
        );
      }
    },
    []
  );

  const scroll = useWorkletCallback((x: number, y: number) => {
    destination.value = { x, y };
    progress.value = 0;
    progress.value = withTiming(1, { duration: 500 });
  }, []);
  const pause = useWorkletCallback(() => {
    cancelAnimation(progress);
  }, []);

  return { scroll, pause };
};
