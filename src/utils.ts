import { useEffect } from 'react';
import { Keyboard } from 'react-native';
import {
  useSharedValue,
  useWorkletCallback,
  runOnUI,
} from 'react-native-reanimated';

export const useKeyboardMetrics = () => {
  const heightEvent = useSharedValue(0);

  const handler = useWorkletCallback((_height: number) => {
    heightEvent.value = _height;
  }, []);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      runOnUI(handler)(-e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      runOnUI(handler)(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return heightEvent;
};
