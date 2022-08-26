import React from 'react';
import { Animated, TextInput, View } from 'react-native';
import {
  useKeyboardAnimation,
  useReanimatedKeyboardAnimation,
  useReanimatedKeyboardAnimationReplica,
} from 'react-native-keyboard-controller';
import Reanimated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import styles from './styles';

export default function KeyboardAnimation() {
  const { height, progress } = useKeyboardAnimation();
  const { height: heightReplica } = useReanimatedKeyboardAnimationReplica();

  const style = useAnimatedStyle(
    () => ({
      width: 50,
      height: 50,
      backgroundColor: 'blue',
      borderRadius: 25,
      transform: [{ translateY: heightReplica.value }],
    }),
    []
  );

  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      width: 50,
      height: 50,
      backgroundColor: 'gray',
      borderRadius: 25,
      transform: [{ translateY: -keyboard.height.value }],
    };
  });

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          width: 200,
          marginTop: 50,
          height: 50,
          backgroundColor: 'yellow',
        }}
      />
      <View style={styles.row}>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'red',
            borderRadius: 25,
            transform: [{ translateY: height }],
          }}
        />
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'green',
            borderRadius: 25,
            transform: [
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 100],
                }),
              },
            ],
          }}
        />
        <Reanimated.View style={style} />
        <Reanimated.View style={translateStyle} />
      </View>
    </View>
  );
}
