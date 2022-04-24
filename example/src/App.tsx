import * as React from 'react';

import { Animated, StyleSheet, View, TextInput } from 'react-native';
import {
  KeyboardEvents,
  KeyboardProvider,
  useKeyboardAnimation,
  useKeyboardAnimationReplica,
} from 'react-native-keyboard-controller';

function KeyboardAnimation() {
  const { height, progress } = useKeyboardAnimation();
  const { height: heightReplica } = useKeyboardAnimationReplica();

  React.useEffect(() => {
    const listener = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      console.debug(3434343, e);
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

export default function App() {
  return (
    <KeyboardProvider>
      <KeyboardAnimation />
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
  },
});
