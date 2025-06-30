import React, { useEffect } from "react";
import { Image, StyleSheet, TextInput, useColorScheme } from "react-native";
import {
  KeyboardBackgroundView,
  KeyboardEvents,
  KeyboardStickyView,
  useKeyboardState,
} from "react-native-keyboard-controller";
import Reanimated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import DarkIcon from "./ai-dark.png";
import LightIcon from "./ai.png";

const ReanimatedBackgroundView = Reanimated.createAnimatedComponent(
  KeyboardBackgroundView,
);

const LiquidKeyboardExample = () => {
  const scheme = useColorScheme();
  const appearance = useKeyboardState((state) => state.appearance);
  const progress = useSharedValue(0);
  const { bottom } = useSafeAreaInsets();
  const color = appearance === "default" ? scheme : appearance;

  useEffect(() => {
    progress.set(0);
    /*progress.value = withRepeat(withSpring(1, {
      stiffness: 1000,
      damping: 500,
      mass: 3,
    }), -1, true);*/
    KeyboardEvents.addListener("keyboardDidShow", () => {
      progress.set(
        withSpring(1, {
          stiffness: 1000,
          damping: 500,
          mass: 3,
        }),
      );
    });
    KeyboardEvents.addListener("keyboardWillHide", () => {
      progress.set(
        withSpring(0, {
          stiffness: 1000,
          damping: 500,
          mass: 3,
        }),
      );
    });
  }, []);

  const mainCircle = useAnimatedStyle(
    () => ({
      borderBottomRightRadius: interpolate(
        progress.value,
        [0, 0.8, 1],
        [0, 0, 25],
      ),
      transform: [{ translateY: -progress.value * 70 }, { rotate: "45deg" }],
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
      <TextInput keyboardType="default" style={styles.textInput} />
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
              top: bottom,
              // zIndex: 2,
            },
            mainCircle,
          ]}
        >
          <Image
            source={color === "dark" ? LightIcon : DarkIcon}
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
});

export default LiquidKeyboardExample;
