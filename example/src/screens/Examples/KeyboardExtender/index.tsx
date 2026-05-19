import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  KeyboardExtender,
  useKeyboardState,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KeyboardExtendExample() {
  const appearance = useKeyboardState((state) => state.appearance);
  const [showExtend, setShowExtend] = useState(true);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withTiming(showExtend ? 1 : 0));
  }, [showExtend]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [],
  );
  const textStyle = useMemo(
    () => [
      styles.priceText,
      appearance === "light"
        ? styles.lightKeyboardText
        : styles.darkKeyboardText,
    ],
    [appearance],
  );

  return (
    <>
      <Image source={require("./background.jpg")} style={styles.background} />
      <TouchableWithoutFeedback
        testID="keyboard_extender.dismiss"
        onPress={() => Keyboard.dismiss()}
      >
        <SafeAreaView edges={["top"]} style={styles.container}>
          <TextInput
            keyboardType="numeric"
            placeholder="Donation amount"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            testID="donation_amount"
            onFocus={() => setShowExtend(true)}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="Postal code"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            testID="postal_code"
            onFocus={() => setShowExtend(false)}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <KeyboardExtender enabled={showExtend}>
        <Reanimated.View style={[styles.keyboardExtend, animatedStyle]}>
          <TouchableOpacity
            testID="donation_10"
            onPress={() => Alert.alert("10 dollars")}
          >
            <Text style={textStyle}>10$</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="donation_20"
            onPress={() => Alert.alert("20 dollars")}
          >
            <Text style={textStyle}>20$</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="donation_50"
            onPress={() => Alert.alert("50 dollars")}
          >
            <Text style={textStyle}>50$</Text>
          </TouchableOpacity>
        </Reanimated.View>
      </KeyboardExtender>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    color: "#1C1C1E",
  },
  keyboardExtend: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 17,
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  lightKeyboardText: {
    color: "#007AFF",
  },
  darkKeyboardText: {
    color: "#64D2FF",
  },
});
