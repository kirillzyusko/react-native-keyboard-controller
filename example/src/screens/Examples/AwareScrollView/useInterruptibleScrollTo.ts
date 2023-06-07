import {
  interpolate,
  scrollTo,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
  withTiming,
} from 'react-native-reanimated';
import { withPause } from 'react-native-redash';

export const useInterruptibleScrollTo = (ref) => {
  const destination = useSharedValue({ x: 0, y: 0 });
  const progress = useSharedValue(0);
  const paused = useSharedValue(true);

  useDerivedValue(() => {
    scrollTo(
      ref,
      interpolate(progress.value, [0, 1], [0, destination.value.x]),
      interpolate(progress.value, [0, 1], [0, destination.value.y]),
      false
    );
  }, [progress.value]);

  const scroll = useWorkletCallback((x: number, y: number) => {
    destination.value = { x, y };
    progress.value = 0;
    paused.value = false;
    progress.value = withPause(withTiming(1), paused);
  }, []);
  const pause = useWorkletCallback(() => {
    paused.value = true;
  }, []);

  return { scroll, pause };
};
