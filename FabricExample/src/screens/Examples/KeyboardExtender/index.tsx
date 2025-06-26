import React, { useEffect, useState } from "react";
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
import { KeyboardExtender } from "react-native-keyboard-controller";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KeyboardExtendExample() {
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

  return (
    <>
      <Image source={require("./background.jpg")} style={styles.background} />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView edges={["top"]} style={styles.container}>
          <TextInput
            keyboardType="numeric"
            placeholder="Donation amount"
            placeholderTextColor="#5c5c5c"
            style={styles.input}
            testID="donation_amount"
            onFocus={() => setShowExtend(true)}
          />
          <TextInput
            keyboardType="numeric"
            placeholder="Postal code"
            placeholderTextColor="#5c5c5c"
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
            <Text style={styles.priceText}>10$</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="donation_20"
            onPress={() => Alert.alert("20 dollars")}
          >
            <Text style={styles.priceText}>20$</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="donation_50"
            onPress={() => Alert.alert("50 dollars")}
          >
            <Text style={styles.priceText}>50$</Text>
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
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    padding: 20,
  },
});
