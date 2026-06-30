import { BlurView } from "@react-native-community/blur";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedGlow from "react-native-animated-glow";
import {
  KeyboardEffects,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import LinearGradient from "react-native-linear-gradient";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import type { PresetConfig } from "react-native-animated-glow";

const MODES = ["gradient", "color", "gif"] as const;

type Mode = (typeof MODES)[number];

const GIF_SOURCE = {
  uri: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbG1hdjU0bDBqZ3dha3NoNXF0YTY5ajNhNTdmMmV5azZsMHhlc21pMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dAWZiSMbMvObDWP3aA/giphy.gif",
};

const COLORS = [
  "transparent",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
];

type ColorButtonProps = {
  color: string;
  index: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const input: PresetConfig = {
  metadata: {
    name: "Default Rainbow",
    textColor: "#FFFFFF",
    textSize: 16,
    category: "Gradient",
    tags: ["colorful", "rainbow", "vibrant", "skia"],
  },
  states: [
    {
      name: "default",
      preset: {
        cornerRadius: 30,
        outlineWidth: 4,
        borderColor: [
          "rgba(238, 255, 0, 1)",
          "rgba(79, 255, 0, 1)",
          "rgba(46, 90, 255, 1)",
          "rgba(254, 0, 255, 1)",
          "rgba(231, 23, 23, 1)",
        ],
        backgroundColor: "rgba(10, 10, 10, 1)",
        animationSpeed: 1.2,
        borderSpeedMultiplier: 1,
        glowLayers: [
          {
            glowPlacement: "behind",
            colors: [
              "rgba(205, 201, 35, 1)",
              "rgba(0, 255, 79, 1)",
              "rgba(0, 119, 255, 1)",
              "rgba(239, 0, 255, 1)",
              "rgba(222, 28, 28, 1)",
            ],
            glowSize: 34,
            opacity: 0.2,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
          {
            glowPlacement: "behind",
            colors: [
              "rgba(185, 182, 32, 1)",
              "rgba(0, 255, 79, 1)",
              "rgba(0, 119, 255, 1)",
              "rgba(239, 0, 255, 1)",
              "rgba(222, 28, 28, 1)",
            ],
            glowSize: 6,
            opacity: 0.5,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
          {
            glowPlacement: "behind",
            colors: ["#FFFFFF"],
            glowSize: [2, 8, 8, 2],
            opacity: 0.2,
            speedMultiplier: 2,
            coverage: 0.5,
            relativeOffset: 0,
          },
        ],
      },
    },
    {
      name: "hover",
      transition: 300,
      preset: {
        animationSpeed: 1.8,
        glowLayers: [
          {
            glowSize: 40,
            opacity: 0.24,
          },
          {
            glowSize: 7,
            opacity: 0.6,
          },
          {
            glowSize: [2, 10, 10, 2],
            opacity: 0.24,
          },
        ],
      },
    },
    {
      name: "press",
      transition: 100,
      preset: {
        animationSpeed: 2.4,
        glowLayers: [
          {
            glowSize: 40,
            opacity: 0.28,
          },
          {
            glowSize: 8,
            opacity: 0.7,
          },
          {
            glowSize: [3, 11, 11, 3],
            opacity: 0.28,
          },
        ],
      },
    },
  ],
};
const keyboard: PresetConfig = {
  metadata: {
    name: "Default Rainbow",
    textColor: "#FFFFFF",
    textSize: 16,
    category: "Gradient",
    tags: ["colorful", "rainbow", "vibrant", "skia"],
  },
  states: [
    {
      name: "default",
      preset: {
        cornerRadius: 0,
        outlineWidth: 0,
        borderColor: [
          "rgb(0, 247, 255)",
          "rgb(0, 106, 255)",
          "rgba(46, 90, 255, 1)",
          "rgba(254, 0, 255, 1)",
          "rgba(231, 23, 23, 1)",
        ],
        backgroundColor: "rgba(10, 10, 10, 0)",
        animationSpeed: 1.2,
        borderSpeedMultiplier: 1,
        glowLayers: [
          {
            glowPlacement: "over",
            colors: [
              "rgb(42, 255, 227)",
              "rgb(0, 242, 255)",
              "rgba(0, 119, 255, 1)",
              "rgb(34, 0, 255)",
              "rgb(222, 28, 219)",
            ],
            glowSize: 34,
            opacity: 0.3,
            speedMultiplier: 1,
            coverage: 1,
            relativeOffset: 0,
          },
        ],
      },
    },
  ],
};

const ColorButton = ({
  color,
  index,
  selectedIndex,
  onSelect,
}: ColorButtonProps) => {
  const onPress = useCallback(() => onSelect(index), [index, onSelect]);
  const buttonStyle = useMemo(
    () => [
      styles.colorButton,
      { backgroundColor: color },
      index === selectedIndex && styles.selectedColor,
    ],
    [color, index, selectedIndex],
  );

  return <TouchableOpacity style={buttonStyle} onPress={onPress} />;
};

const KeyboardEffectsExample = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("gradient");

  const cycleMode = useCallback(
    () => setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]),
    [],
  );

  const colorEffectStyle = useMemo(
    () => [styles.fill, { backgroundColor: COLORS[colorIndex] }],
    [colorIndex],
  );
  const { progress } = useReanimatedKeyboardAnimation();

  const opacity = useAnimatedStyle(
    () => ({
      opacity: progress.value,
    }),
    [],
  );

  const renderEffect = () => {
    switch (mode) {
      case "gradient":
        return (
          <AnimatedGlow preset={keyboard}>
            <View style={{ height: 300 }} />
          </AnimatedGlow>
        );
      case "gif":
        return (
          <View style={[styles.fill, { transform: [{ translateY: 0 }] }]}>
            <Image source={GIF_SOURCE} style={styles.fill} />
            <BlurView
              blurAmount={32}
              blurType="materialLight"
              style={StyleSheet.absoluteFill}
            />
          </View>
        );
      default:
        return <View style={colorEffectStyle} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#181818" }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.controls}>
          <View style={styles.colorPicker}>
            {COLORS.map((color, index) => (
              <ColorButton
                key={color}
                color={color}
                index={index}
                selectedIndex={colorIndex}
                onSelect={setColorIndex}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.toggleButton} onPress={cycleMode}>
            <Text style={styles.toggleButtonText}>{mode.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <KeyboardEffects translucent>{renderEffect()}</KeyboardEffects>
      <KeyboardStickyView
        offset={{ opened: 16 }}
        style={{ marginHorizontal: 16, marginBottom: 16 }}
      >
        <Reanimated.View style={[StyleSheet.absoluteFillObject, opacity]} />
        <AnimatedGlow preset={input}>
          <TextInput
            keyboardAppearance="dark"
            placeholder="Describe an image"
            style={styles.textInput}
          />
        </AnimatedGlow>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 16,
  },
  colorPicker: {
    flexDirection: "row",
    gap: 12,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#333",
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  toggleButtonText: {
    fontWeight: "600",
    color: "#333",
  },
  textInput: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  fill: {
    flex: 1,
  },
});

export default KeyboardEffectsExample;
