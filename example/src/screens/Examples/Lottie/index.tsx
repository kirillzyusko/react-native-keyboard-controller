import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Lottie from 'lottie-react-native';
import { useKeyboardAnimation } from 'react-native-keyboard-controller';

// animation is taken from lottie public animations: https://lottiefiles.com/46216-lock-debit-card-morph
import LockDebitCardMorph from './animation.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#5C5C5C',
  },
  lottie: {
    height: 200,
  },
});

function LottieAnimation() {
  const { progress } = useKeyboardAnimation();

  const animation = progress.interpolate({
    inputRange: [0, 1],
    // 104 - total frames
    // 7 frame - transition begins
    // 35 frame - transition ends
    outputRange: [7 / 104, 35 / 104],
  });

  return (
    <View style={styles.container}>
      <Lottie
        style={styles.lottie}
        source={LockDebitCardMorph}
        progress={animation}
      />
      <TextInput style={styles.input} />
    </View>
  );
}

export default LottieAnimation;
