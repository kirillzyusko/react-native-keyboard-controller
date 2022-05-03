import { useEffect } from 'react';
import {
  useSharedValue,
  useWorkletCallback,
  runOnUI,
} from 'react-native-reanimated';
import { KeyboardEvents } from './native';

export const useKeyboardMetrics = () => {
  const heightEvent = useSharedValue(0);

  const handler = useWorkletCallback((_height: number) => {
    heightEvent.value = _height;
  }, []);

  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      runOnUI(handler)(-e.height);
    });
    const hide = KeyboardEvents.addListener('keyboardWillHide', () => {
      runOnUI(handler)(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return heightEvent;
};
