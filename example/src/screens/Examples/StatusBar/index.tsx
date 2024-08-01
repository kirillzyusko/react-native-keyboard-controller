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
        backgroundColor={color}
        barStyle={barStyle}
        hidden={hidden}
        animated={animated}
        translucent={translucent}
      />
      <KeyboardAnimationTemplate />
      <Button
        title={`Set ${hidden ? "shown" : "hidden"}`}
        onPress={() => setHidden(!hidden)}
        testID="button.hidden"
      />
      <Button
        title="Update color"
        onPress={() => setColor(`${randomColor()}`)}
        testID="button.color"
      />
      <Button
        title={`Set ${!animated ? "" : "not"} animated`}
        onPress={() => setAnimated(!animated)}
        testID="button.animated"
      />
      <Button
        title={`Change ${barStyle}`}
        onPress={() =>
          setBarStyle(
            barStyle === "light-content" ? "dark-content" : "light-content",
          )
        }
        testID="button.bar_style"
      />
      <Button
        title={`Set ${!translucent ? "" : "not"} translucent`}
        onPress={() => setTranslucent(!translucent)}
        testID="button.translucent"
      />
      <Button
        title={`${enabled ? "Disable" : "Enable"} module`}
        onPress={() => setEnabled(!enabled)}
        testID="button.enabled"
      />
    </View>
  );
}
