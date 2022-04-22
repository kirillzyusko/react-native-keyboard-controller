import * as React from 'react';

import {
  Animated,
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  Easing,
} from 'react-native';
import {
  KeyboardProvider,
  useKeyboardProgress,
} from 'react-native-keyboard-controller';

function KeyboardAnimation() {
  const progress = useKeyboardProgress();
  const replica = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(replica, {
        toValue: -e.endCoordinates.height,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }).start();

      return () => listener.remove();
    });
  }, []);
  React.useEffect(() => {
    const listener = Keyboard.addListener('keyboardDidHide', (e) => {
      Animated.timing(replica, {
        toValue: 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }).start();

      return () => listener.remove();
    });
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
