import { useSharedValue } from 'react-native-reanimated';
import { useKeyboardHandler } from '../../hooks';

export const useKeyboardAnimation = () => {
  const heightWhenOpened = useSharedValue(0);
  const height = useSharedValue(0);
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onStart: (e) => {
        'worklet';

        if (e.height > 0) {
          heightWhenOpened.value = e.height;
        }
      },
      onMove: (e) => {
        'worklet';

        progress.value = e.progress;
        height.value = e.height;
      },
    },
    []
  );

  return { height, progress, heightWhenOpened };
};
