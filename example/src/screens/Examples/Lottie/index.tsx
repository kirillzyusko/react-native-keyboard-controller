import React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import Lottie from 'lottie-react-native';
import { useKeyboardHandler } from 'react-native-keyboard-controller';
import Reanimated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';

// animation is taken from lottie public animations: https://lottiefiles.com/46216-lock-debit-card-morph
import LockDebitCardMorph from './animation.lottie.json';

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
    width: '100%',
    height: 200,
  },
});

const ReanimatedLottieView = Reanimated.createAnimatedComponent(Lottie);

function LottieAnimation() {
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        'worklet';

        progress.value = e.progress;
      },
    },
    []
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      progress: interpolate(
        progress.value,
        [0, 1],
        // 104 - total frames
        // 7 frame - transition begins
        // 35 frame - transition ends
        [7 / 104, 35 / 104]
      ),
    };
  });

  return (
    <View style={styles.container}>
      <ReanimatedLottieView
        renderMode={Platform.OS === 'ios' ? 'SOFTWARE' : 'AUTOMATIC'}
        style={styles.lottie}
        source={LockDebitCardMorph}
        animatedProps={animatedProps}
      />
      <TextInput style={styles.input} />
    </View>
  );
}

export default LottieAnimation;
