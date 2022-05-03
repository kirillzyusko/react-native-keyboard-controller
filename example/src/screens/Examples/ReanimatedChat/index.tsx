import React, { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import {
  useReanimatedKeyboardAnimation,
  InteractiveKeyboard,
  useInteractiveKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  useAnimatedRef,
} from 'react-native-reanimated';
import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

const defaultLinearInterpolator = (
  finger: number,
  distanceToKeyboard: number,
  keyboardHeight: number
) => {
  'worklet';

  return {
    position: interpolate(finger, [0, keyboardHeight], [keyboardHeight, 0]),
    opacity: 1,
  };
};

const iOSInteractiveKeyboard = (
  finger: number,
  distanceToKeyboard: number,
  keyboardHeight: number
) => {
  'worklet';

  // console.log(121212, finger, distanceToKeyboard, keyboardHeight);

  return {
    position: interpolate(
      finger,
      [0, distanceToKeyboard, distanceToKeyboard + keyboardHeight],
      [keyboardHeight, keyboardHeight, 0]
    ),
    opacity: 1,
  };
};

function ReanimatedChat() {
  const scrollView = useAnimatedRef<Reanimated.ScrollView>();
  const { height } = useReanimatedKeyboardAnimation();

  const scrollToBottom = useCallback(() => {
    scrollView.current?.scrollToEnd({ animated: false });
  }, []);

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }],
    }),
    []
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#ECECEC',
      transform: [{ translateY: height.value }],
    }),
    []
  );
  const fakeView = useAnimatedStyle(
    () => ({
      height: Math.abs(height.value),
    }),
    []
  );

  const { handler } = useInteractiveKeyboardAnimation(
    defaultLinearInterpolator
  );

  return (
    <View style={styles.container}>
      <InteractiveKeyboard handler={handler}>
        <Reanimated.ScrollView
          ref={scrollView}
          onContentSizeChange={scrollToBottom}
          showsVerticalScrollIndicator={false}
          style={scrollViewStyle}
        >
          <Reanimated.View style={fakeView} />
          {history.map((message, index) => (
            <Message key={index} {...message} />
          ))}
        </Reanimated.ScrollView>
      </InteractiveKeyboard>
      <AnimatedTextInput style={textInputStyle} />
    </View>
  );
}

export default ReanimatedChat;
