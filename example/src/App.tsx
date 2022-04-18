import * as React from 'react';

import { Animated, StyleSheet, View, TextInput } from 'react-native';
import {
  KeyboardProvider,
  useKeyboardProgress,
} from 'react-native-keyboard-events';

function KeyboardAnimation() {
  const progress = useKeyboardProgress();

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'red',
          borderRadius: 25,
          transform: [{ translateY: progress }],
        }}
      />
      <TextInput style={{ width: 200, height: 50, backgroundColor: "yellow" }} />
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
});
