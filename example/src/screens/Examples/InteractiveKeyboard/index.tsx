import React from 'react';
import { TextInput, View } from 'react-native';
import {
  KeyboardGestureArea,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Reanimated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import Message from '../../../components/Message';
import { history } from '../../../components/Message/data';
import styles from './styles';

const AnimatedTextInput = Reanimated.createAnimatedComponent(TextInput);

function InteractiveKeyboard() {
  const { height, progress } = useReanimatedKeyboardAnimation();

  const scrollViewStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: height.value }, ...styles.inverted.transform],
    }),
    []
  );
  const textInputStyle = useAnimatedStyle(
    () => ({
      height: 50,
      width: '100%',
      backgroundColor: '#BCBCBC',
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

  return (
    <>
      <View style={styles.container}>
        <KeyboardGestureArea interpolator="linear">
          <Reanimated.ScrollView
            showsVerticalScrollIndicator={false}
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
      <Reanimated.View style={progressViewStyle} />
    </>
  );
}

export default InteractiveKeyboard;
