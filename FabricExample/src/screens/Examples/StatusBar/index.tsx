import React, { useState } from "react";
import { Button, StatusBar, View } from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";

import type { StatusBarStyle } from "react-native";

export default function StatusBarManipulation() {
  const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
  const [hidden, setHidden] = useState(false);
  const [animated, setAnimated] = useState(true);
  const { setEnabled, enabled } = useKeyboardController();

  return (
    <View style={{ flex: 1, backgroundColor: "pink" }}>
      <StatusBar animated={animated} barStyle={barStyle} hidden={hidden} />
      <KeyboardAnimationTemplate />
      <Button
        testID="button.hidden"
        title={`Set ${hidden ? "shown" : "hidden"}`}
        onPress={() => setHidden(!hidden)}
      />
      <Button
        testID="button.animated"
        title={`Set ${!animated ? "" : "not"} animated`}
        onPress={() => setAnimated(!animated)}
      />
      <Button
        testID="button.bar_style"
        title={`Change ${barStyle}`}
        onPress={() =>
          setBarStyle(
            barStyle === "light-content" ? "dark-content" : "light-content",
          )
        }
      />
      <Button
        testID="button.enabled"
        title={`${enabled ? "Disable" : "Enable"} module`}
        onPress={() => setEnabled(!enabled)}
      />
    </View>
  );
}
