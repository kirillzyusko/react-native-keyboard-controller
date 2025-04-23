import React, { useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  KeyboardBackgroundView,
  KeyboardEvents,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Reanimated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ReanimatedBackgroundView = Reanimated.createAnimatedComponent(
  KeyboardBackgroundView,
);

const KeyboardBackdropViewExample = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    /*progress.value = withRepeat(withSpring(1, {
      stiffness: 1000,
      damping: 500,
      mass: 3,
    }), -1, true);*/
    KeyboardEvents.addListener("keyboardDidShow", () => {
      progress.value = withSpring(1, {
        stiffness: 1000,
        damping: 500,
        mass: 3,
      });
    });
    KeyboardEvents.addListener("keyboardWillHide", () => {
      progress.value = withSpring(0, {
        stiffness: 1000,
        damping: 500,
        mass: 3,
      });
    });
  }, []);

  const mainCircle = useAnimatedStyle(
    () => ({
      borderBottomRightRadius: interpolate(
        progress.value,
        [0, 0.8, 1],
        [0, 0, 25],
      ),
      transform: [{ translateY: -progress.value * 70 + 34 }, { rotate: "45deg" }],
    }),
    [],
  );
  const secondCircle = useAnimatedStyle(
    () => ({
      transform: [
        // { scale: interpolate(progress.value, [0, 0.5, 1], [1, 1, 0.8]) },
        {
          // 27%
          translateY: interpolate(progress.value, [0, 0.35, 1], [12, -2, 12]),
        },
      ],
    }),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        keyboardType="default"
        style={styles.textInput}
      />
      <KeyboardStickyView>
        <ReanimatedBackgroundView
          style={[
            {
              width: 50,
              height: 50,
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              borderBottomLeftRadius: 25,
              right: 20,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              // zIndex: 2,
            },
            mainCircle,
          ]}
        >
                  <Image
            source={require("./ai.png")}
            style={{ transform: [{ rotate: "-45deg" }], width: 20, height: 20 }}
          />
        </ReanimatedBackgroundView>
        <ReanimatedBackgroundView
          style={[
            {
              width: 100,
              height: 100,
              borderRadius: 9999,
              right: -5,
              bottom: -122,
              position: "absolute",
            },
            secondCircle,
          ]}
        />
      </KeyboardStickyView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8A8A8C",
    justifyContent: "space-between",
  },
  textInput: {
    height: 50,
    paddingHorizontal: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  text: {
    fontSize: 20,
    color: "#000",
  },
  ai: {
    position: "absolute",
    left: 18,
    top: 16,
    color: "white",
  },
});

export default KeyboardBackdropViewExample;
