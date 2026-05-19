import Lottie from "lottie-react-native";
import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";
import Reanimated, {
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from "react-native-reanimated";

// animation is taken from lottie public animations: https://lottiefiles.com/46216-lock-debit-card-morph
import LockDebitCardMorph from "./animation.json";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    paddingHorizontal: 16,
    color: "#1C1C1E",
    fontSize: 16,
    marginBottom: 16,
  },
  lottie: {
    width: "100%",
    height: 220,
    marginTop: 16,
  },
});

const ReanimatedLottieView = Reanimated.createAnimatedComponent(Lottie);

function LottieAnimation() {
  const progress = useSharedValue(0);

  useKeyboardHandler(
    {
      onMove: (e) => {
        "worklet";

        // eslint-disable-next-line react-compiler/react-compiler
        progress.value = e.progress;
      },
    },
    [],
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      progress: interpolate(
        progress.value,
        [0, 1],
        // 104 - total frames
        // 7 frame - transition begins
        // 35 frame - transition ends
        [7 / 104, 35 / 104],
      ),
    };
  });

  return (
    <View style={styles.container}>
      <ReanimatedLottieView
        animatedProps={animatedProps}
        renderMode={Platform.OS === "ios" ? "SOFTWARE" : "AUTOMATIC"}
        source={LockDebitCardMorph}
        style={styles.lottie}
      />
      <TextInput style={styles.input} />
    </View>
  );
}

export default LottieAnimation;
