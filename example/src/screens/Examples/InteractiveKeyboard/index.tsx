import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import {
  KeyboardGestureArea,
  useKeyboardHandler,
} from 'react-native-keyboard-controller';
import Reanimated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const useKeyboardAnimation = () => {
  // for simplicity purpose let's lock scroll view via state variable
  // further it can be optimized without re-render/crossing the bridge
  const [isScrollEnabled, setScrollEnabled] = useState(true);

  const isScrollViewLocked = useSharedValue(false);
  const progress = useSharedValue(0);
  const height = useSharedValue(0);
  useKeyboardHandler({
    onMove: (e) => {
      'worklet';

      console.log('onMove', e.height);

      /*if (isScrollViewLocked.value) {
        runOnJS(setScrollEnabled)(true);
      }*/

      isScrollViewLocked.value = false;
      progress.value = e.progress;
      height.value = e.height;
    },
    onInteractive: (e) => {
      'worklet';

      console.log('onInteractive', e.height);

      /*if (!isScrollViewLocked.value) {
        runOnJS(setScrollEnabled)(false);
      }*/

      isScrollViewLocked.value = true;
      progress.value = e.progress;
      height.value = e.height;
    },
  });

  return { height, progress, isScrollEnabled };
};

function InteractiveKeyboard() {
  const { height, isScrollEnabled } = useKeyboardAnimation();

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: -height.value }, ...styles.inverted.transform],
    }),
    []
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#BCBCBC',
      transform: [{ translateY: -height.value }],
    }),
    []
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: height.value,
    }),
    []
  );

  return (
    <>
      <View style={styles.container}>
        <KeyboardGestureArea style={styles.content} interpolator="ios">
          <Reanimated.ScrollView
            scrollEnabled={isScrollEnabled}
            style={scrollViewStyle}
          >
            <View style={styles.inverted}>
              <Reanimated.View style={fakeView} />
              {history.map((message, index) => (
                <Message key={index} {...message} />
              ))}
            </View>
          </Reanimated.ScrollView>
        </KeyboardGestureArea>
        <AnimatedTextInput style={textInputStyle} />
      </View>
    </>
  );
}

export default InteractiveKeyboard;
