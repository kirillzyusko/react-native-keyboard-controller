import React, { useEffect } from 'react';
import { findNodeHandle, TextInput, View } from 'react-native';
import {
  KeyboardController,
  KeyboardGestureArea,
  useKeyboardHandler,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Reanimated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const useInteractiveKeyboard = (onInteractive: () => void) => {
  const isShown = useSharedValue(false);
  const hasBecameInteractive = useSharedValue(false);
  const progress = useSharedValue(0);
  const height = useSharedValue(0);

  useKeyboardHandler({
    onStart: (e) => {
      'worklet';

      // progress.value = e.progress;
      // height.value = e.height;
    },
    onMove: (e) => {
      'worklet';

      // keyboard becomes interactive
      if (isShown.value && !hasBecameInteractive.value) {
        hasBecameInteractive.value = true;
        onInteractive();
      }

      progress.value = e.progress;
      height.value = e.height;
    },
    onEnd: (e) => {
      'worklet';

      isShown.value = e.progress !== 0;
      progress.value = e.progress;
      height.value = e.height;
    },
  });

  return { height, progress };
};

function InteractiveKeyboard() {
  const scroll = useSharedValue(0);
  const ref = useAnimatedRef<Reanimated.ScrollView>();
  const onBecomeInteractive = useWorkletCallback(() => {
    console.log(ref.current, scroll.value);
    scrollTo(ref, 0, scroll.value, false);
  }, []);
  const { height, progress } = useInteractiveKeyboard(onBecomeInteractive);

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
  const progressViewStyle = useAnimatedStyle(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      height: interpolate(progress.value, [0, 1], [0, 100]),
      width: interpolate(progress.value, [0, 1], [0, 100]),
      backgroundColor: 'red',
    }),
    []
  );
  const handler = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        scroll.value = e.contentOffset.y;
      },
    },
    [ref.current]
  );

  useEffect(() => {
    const tag = findNodeHandle(ref.current);
    console.log(tag);
    KeyboardController.registerForScrollEvents(tag);
  }, []);

  console.log(ref.current);

  return (
    <>
      <View style={styles.container}>
        <KeyboardGestureArea style={{flex: 1}} interpolator="linear">
          <Reanimated.ScrollView
            ref={ref}
            scrollEventThrottle={16}
            onScroll={handler}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="interactive"
            nestedScrollEnabled
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
      {/*<Reanimated.View style={progressViewStyle} />*/}
    </>
  );
}

export default InteractiveKeyboard;
