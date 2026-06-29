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
import {
  KeyboardEffects,
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import LinearGradient from "react-native-linear-gradient";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
          <LinearGradient
            colors={["rgba(80, 200, 137, 1)", "rgba(209, 5, 127, 1)"]}
            end={{ x: 0.96, y: 0.3 }}
            locations={[0, 1]}
            start={{ x: 0.04, y: 0.7 }}
            style={{ flex: 1 }}
          />
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
    <>
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
      <KeyboardStickyView offset={{ opened: 32 }}>
        <Reanimated.View style={[StyleSheet.absoluteFillObject, opacity]}>
          <Image
            source={GIF_SOURCE}
            style={{
              left: 14,
              right: 14,
              top: -2,
              bottom: 14,
              position: "absolute",
              borderRadius: 25,
            }}
          />
          <BlurView
            blurAmount={4}
            blurType="light"
            style={{
              position: "absolute",
              top: -12,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Reanimated.View>
        <TextInput placeholder="Describe an image" style={styles.textInput} />
      </KeyboardStickyView>
    </>
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
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  fill: {
    flex: 1,
  },
});

export default KeyboardEffectsExample;
