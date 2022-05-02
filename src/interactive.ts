import { useAnimatedGestureHandler } from 'react-native-reanimated';
import { useInteractiveKeyboardContext } from './animated';

export const useInteractiveKeyboardAnimation = () => {
  const { isScrollActive, position, opacity } = useInteractiveKeyboardContext();

  const handler = useAnimatedGestureHandler({
    onStart: () => {
      console.log('onStart');
      isScrollActive.value = true;
    },
    onEnd: () => {
      console.log('onEnd');
      isScrollActive.value = false;
    },
  });

  return { handler };
};
