import React from 'react';
import { Animated, TextInput, View } from 'react-native';
import {
  useKeyboardAnimation,
  useReanimatedKeyboardAnimation,
  useReanimatedKeyboardAnimationReplica,
} from 'react-native-keyboard-controller';
import Reanimated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import styles from './styles';

export default function KeyboardAnimation() {
  const { height, progress } = useReanimatedKeyboardAnimation();
  const { height: heightReplica } = useReanimatedKeyboardAnimationReplica();

  const style1 = useAnimatedStyle(() => ({
    width: 50,
    height: 50,
    backgroundColor: 'red',
    borderRadius: 25,
    transform: [{ translateY: height.value }],
  }));
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
  const rea = useDerivedValue(() => `REA: ${keyboard.height.value}`);
  const my = useDerivedValue(() => `MY: ${height.value}`);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'aqua',
          width: '100%',
          height: '100%',
        }}
      >
        <ReText text={rea} style={{ color: 'white', fontSize: 28 }} />
        <ReText text={my} style={{ color: 'white', fontSize: 28 }} />
      </View>
      <TextInput
        style={{
          width: 200,
          marginTop: 50,
          height: 50,
          backgroundColor: 'yellow',
        }}
      />
      <View style={styles.row}>
        <Reanimated.View style={style1} />
        {/*<Animated.View
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
        />*/}
        <Reanimated.View style={style} />
        <Reanimated.View style={translateStyle} />
      </View>
    </View>
  );
}
