import React, { useState } from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  KeyboardExtender,
  OverKeyboardView,
  useKeyboardState,
} from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: remove _touchHandler when view gets detached from keyboard?
// TODO: test how GestureHandler works there
// TODO: don't overwrite existing inputAccessoryView?
// TODO: Android implementation

export default function KeyboardExtendExample() {
  const [showExtend, setShowExtend] = useState(true);
  const [isOKVMode, setOKVMode] = useState(false);
  const opacity = useSharedValue(1);
  // TODO: replace with animated value
  const { height } = useKeyboardState();

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [],
  );

  return (
    <>
      <Image
        source={require("./background.jpg")}
        style={{ ...StyleSheet.absoluteFillObject, flex: 1, width: "100%" }}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <TextInput
          placeholder="Donation amount"
          placeholderTextColor="#5c5c5c"
          keyboardType="numeric"
          style={styles.input}
        />

        <KeyboardExtender enabled={showExtend}>
          <Reanimated.View style={[styles.keyboardExtend, animatedStyle]}>
            <TouchableOpacity onPress={() => Alert.alert("10$")}>
              <Text style={styles.priceText}>10$</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("20$")}>
              <Text style={styles.priceText}>20$</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("50$")}>
              <Text style={styles.priceText}>50$</Text>
            </TouchableOpacity>
          </Reanimated.View>
        </KeyboardExtender>
        <OverKeyboardView visible={isOKVMode}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            {/* TODO replace hardcoded value */}
            <TextInput
              placeholder="Search..."
              style={[styles.input, { marginBottom: height - 61.73 }]}
            />
          </View>
        </OverKeyboardView>
      </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderWidth: 2,
    borderColor: "#1c1c1c",
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  keyboardExtend: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  priceText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
  },
  overKeyboardView: {
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
  },
  hiddenInput: {
    height: 0,
    width: 0,
  },
  helpText: {
    fontSize: 14,
    color: "#666",
  },
});
