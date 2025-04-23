import {
  BackdropFilter,
  Blur,
  Canvas,
  ColorMatrix,
  Rect,
  interpolate,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, View } from "react-native";
import {
  KeyboardStickyView,
  useKeyboardState,
  useResizeMode,
} from "react-native-keyboard-controller";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const makeSaturationMatrix = (s: number) => {
  const lumR = 0.2126;
  const lumG = 0.7152;
  const lumB = 0.0722;

  return [
    lumR + (1 - lumR) * s,
    lumG - lumG * s,
    lumB - lumB * s,
    0,
    0,
    lumR - lumR * s,
    lumG + (1 - lumG) * s,
    lumB - lumB * s,
    0,
    0,
    lumR - lumR * s,
    lumG - lumG * s,
    lumB + (1 - lumB) * s,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#3c3c3c",
  },
  text: {
    color: "black",
  },
});

export default function DripSharedTransition() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  const mainCircle = useAnimatedStyle(
    () => ({
      borderBottomRightRadius: interpolate(progress.value, [0, 0.5, 1], [0, 0, 25]),
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
          translateY: interpolate(
            progress.value,
            [0, 0.35, 1],
            [12, 0, 12],
          ),
        },
      ],
    }),
    [],
  );

  return (
    <View style={{ flex: 1, justifyContent: "flex-end" }}>
      <Reanimated.View
        style={[
          {
            width: 50,
            height: 50,
            backgroundColor: "#00AfEE",
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
        <Image style={{transform: [{ rotate: "-45deg" }], width: 20, height: 20}} source={{uri: "https://static.thenounproject.com/png/7262146-200.png"}}></Image>
      </Reanimated.View>
      <Reanimated.View
        style={[
          {
            width: 100,
            height: 100,
            backgroundColor: "#00AfEE",
            borderRadius: 9999,
            right: -5,
            bottom: -40,
            position: "absolute",
          },
          secondCircle,
        ]}
      />
      <View style={{ height: 50, backgroundColor: "#3c3c3c", width: "100%" }} />
    </View>
  );
}

function UseKeyboardState() {
  useResizeMode();

  const state = useKeyboardState();

  return (
    <>
      <TextInput keyboardType="email-address" style={styles.input} />
      <Text style={styles.text}>isVisible: {state.isVisible.toString()}</Text>
      <Text style={styles.text}>height: {state.height}</Text>
      <Text style={styles.text}>duration: {state.duration}</Text>
      <Text style={styles.text}>timestamp: {state.timestamp}</Text>
      <Text style={styles.text}>target: {state.target}</Text>
      <Text style={styles.text}>type: {state.type}</Text>
      <Text style={styles.text}>appearance: {state.appearance}</Text>
      <Canvas style={{ flex: 1, justifyContent: "flex-end" }}>
        {/* Задний фон (например, подложка для blur) */}
        <BackdropFilter
          clip={{ x: 0, y: 240, width: 300, height: 50 }}
          filter={
            <>
              <Blur blur={20} />
              <ColorMatrix matrix={makeSaturationMatrix(1.8)} />
              <ColorMatrix
                matrix={[
                  0.27, 0, 0, 0, 0.1679, 0, 0.27, 0, 0, 0.1679, 0, 0, 0.27, 0,
                  0.1679, 0, 0, 0, 0.27, 0.73,
                ]}
              />
            </>
          }
        />

        <Rect
          color="rgba(0, 0, 0, 0.03)" // аналог #0000000a
          height={50}
          width={400}
          x={0}
          y={240}
        />
      </Canvas>
    </>
  );
}
