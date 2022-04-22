import * as React from 'react';

import { Animated, StyleSheet, View, TextInput } from 'react-native';
import {
  KeyboardEvents,
  KeyboardProvider,
  useKeyboardProgress,
  useKeyboardReplicaProgress,
} from 'react-native-keyboard-controller';

function KeyboardAnimation() {
  const progress = useKeyboardProgress();
  const replica = useKeyboardReplicaProgress();

  React.useEffect(() => {
    const listener = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      console.debug(3434343, e);
    });

    return () => listener.remove();
  }, []);

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
            transform: [{ translateY: progress }],
          }}
        />
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'blue',
            borderRadius: 25,
            transform: [{ translateY: replica }],
          }}
        />
      </View>
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
