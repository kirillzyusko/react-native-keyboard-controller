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
  const isScrolling = useSharedValue(false);

  useAnimatedReaction(
    () => progress.value,
    (result, previous) => {
      if (result !== previous) {
        console.log(
          currentScroll.value,
          'diff',
          interpolate(
            result,
            [0, 1],
            [currentScroll.value, destination.value.y]
          ) - currentScroll.value,
          destination.value.y,
          result
        );
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
    console.log('onScroll');
    destination.value = { x, y };
    progress.value = 0;
    isScrolling.value = true;
    progress.value = withTiming(1, { duration: 500 }, (finished) => {
      if (finished) {
        isScrolling.value = false;
      }
    });
  }, []);
  const pause = useWorkletCallback(() => {
    console.log('onCancel');
    cancelAnimation(progress);
    isScrolling.value = false;
  }, []);

  return { scroll, pause, isScrolling };
};
