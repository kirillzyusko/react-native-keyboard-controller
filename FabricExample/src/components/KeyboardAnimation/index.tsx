import React, {useRef} from 'react';
import {Animated, TextInput, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
/*import {
  useKeyboardAnimation,
  useKeyboardAnimationReplica,
} from 'react-native-keyboard-controller';*/
import styles from './styles';

export default function KeyboardAnimation() {
  const height = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const heightReplica = useSharedValue(0);
  // const { height, progress } = useKeyboardAnimation();
  // const { height: heightReplica } = useKeyboardAnimationReplica();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Animated.View
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'red',
            borderRadius: 25,
            transform: [{translateY: height}],
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
            transform: [{translateY: heightReplica}],
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
