import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

// TODO: is not stretched to full width <- fixed with additional View inside KeyboardExtender
// TODO: don't hardcode height as 44 in native code <- rely on internal view height
// TODO: remove _touchHandler when view gets detached from keyboard?
// TODO: test how GestureHandler works there

export default function KeyboardExtendExample() {
  const [showExtend, setShowExtend] = useState(true);
  const [isOKVMode, setOKVMode] = useState(false);
  const opacity = useSharedValue(1);
  // TODO: replace with animated value
  const {height} = useKeyboardState();

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <Button
        title={isOKVMode ? "OKV" : "Default"}
        onPress={() => setOKVMode(!isOKVMode)}
      />
      <Button
        title="Change opacity"
        onPress={() => {
          opacity.set(
            withTiming(opacity.value === 0 ? 1 : 0, {
              duration: 1000,
            }),
          );
        }}
      />
      <Button
        title={showExtend ? "Detach" : "Attach"}
        onPress={() => setShowExtend(!showExtend)}
      />
      <TextInput placeholder="Type something..." style={styles.input} />

      <TextInput placeholder="Another input field..." style={styles.input} />

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
        <View style={{flex: 1, justifyContent: "flex-end"}}>
          {/* TODO replace hardcoded value */}
          <TextInput placeholder="Search..." style={[styles.input, {marginBottom: height - 61.73}]} />
        </View>
      </OverKeyboardView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
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
