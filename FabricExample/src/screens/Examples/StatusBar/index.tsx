import React, { useState } from "react";
import { Button, StatusBar, View } from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";
import { randomColor } from "../../../utils";

import type { StatusBarStyle } from "react-native";

export default function StatusBarManipulation() {
  const [color, setColor] = useState("#00FF0000");
  const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
  const [hidden, setHidden] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [translucent, setTranslucent] = useState(true);
  const { setEnabled, enabled } = useKeyboardController();

  return (
    <View style={{ flex: 1, backgroundColor: "pink" }}>
      <StatusBar
        animated={animated}
        backgroundColor={color}
        barStyle={barStyle}
        hidden={hidden}
        translucent={translucent}
      />
      <KeyboardAnimationTemplate />
      <Button
        testID="button.hidden"
        title={`Set ${hidden ? "shown" : "hidden"}`}
        onPress={() => setHidden(!hidden)}
      />
      <Button
        testID="button.color"
        title="Update color"
        onPress={() => setColor(`${randomColor()}`)}
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
        testID="button.translucent"
        title={`Set ${!translucent ? "" : "not"} translucent`}
        onPress={() => setTranslucent(!translucent)}
      />
      <Button
        testID="button.enabled"
        title={`${enabled ? "Disable" : "Enable"} module`}
        onPress={() => setEnabled(!enabled)}
      />
    </View>
  );
}
