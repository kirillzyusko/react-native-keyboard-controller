import React from 'react';
import { Animated, TextInput, View } from 'react-native';
import {
  KeyboardEvents,
  useKeyboardAnimation,
  useKeyboardAnimationReplica,
} from 'react-native-keyboard-controller';
import styles from './styles';

export default function KeyboardAnimation() {
  const { height, progress } = useKeyboardAnimation();
  const { height: heightReplica } = useKeyboardAnimationReplica();

  React.useEffect(() => {
    const listener = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      console.debug(e);
    });

    return () => listener.remove();
  }, []);

  return (
    <View style={styles.container}>
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
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'blue',
            borderRadius: 25,
            transform: [{ translateY: heightReplica }],
          }}
        />
      </View>
      <TextInput
        style={{
          width: 200,
          marginTop: 50,
          height: 50,
          backgroundColor: 'yellow',
        }}
      />
    </View>
  );
}
