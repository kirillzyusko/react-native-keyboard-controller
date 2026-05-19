import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";
import { randomColor } from "../../../utils";

import type { StatusBarStyle } from "react-native";

const StatusBarButton = ({
  testID,
  title,
  onPress,
}: {
  testID: string;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    testID={testID}
    style={statusStyles.button}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={statusStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default function StatusBarManipulation() {
  const [color, setColor] = useState("#00FF0000");
  const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
  const [hidden, setHidden] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [translucent, setTranslucent] = useState(true);
  const { setEnabled, enabled } = useKeyboardController();

  return (
    <View style={statusStyles.container}>
      <StatusBar
        animated={animated}
        backgroundColor={color}
        barStyle={barStyle}
        hidden={hidden}
        translucent={translucent}
      />
      <KeyboardAnimationTemplate />
      <View style={statusStyles.buttonGroup}>
        <StatusBarButton
          testID="button.hidden"
          title={`Set ${hidden ? "shown" : "hidden"}`}
          onPress={() => setHidden(!hidden)}
        />
        <StatusBarButton
          testID="button.color"
          title="Update color"
          onPress={() => setColor(`${randomColor()}`)}
        />
        <StatusBarButton
          testID="button.animated"
          title={`Set ${!animated ? "" : "not"} animated`}
          onPress={() => setAnimated(!animated)}
        />
        <StatusBarButton
          testID="button.bar_style"
          title={`Change ${barStyle}`}
          onPress={() =>
            setBarStyle(
              barStyle === "light-content" ? "dark-content" : "light-content",
            )
          }
        />
        <StatusBarButton
          testID="button.translucent"
          title={`Set ${!translucent ? "" : "not"} translucent`}
          onPress={() => setTranslucent(!translucent)}
        />
        <StatusBarButton
          testID="button.enabled"
          title={`${enabled ? "Disable" : "Enable"} module`}
          onPress={() => setEnabled(!enabled)}
        />
      </View>
    </View>
  );
}

const statusStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  buttonGroup: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
