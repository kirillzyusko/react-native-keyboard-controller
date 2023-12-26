import React, { useState } from "react";
import { Button, StatusBar, View } from "react-native";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";
import { randomColor } from "../../../utils";

import type { StatusBarStyle } from "react-native";

export default function StatusBarManipulation() {
  const [color, setColor] = useState("#00FF0000");
  const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
  const [hidden, setHidden] = useState(false);
  const [animated, setAnimated] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: "pink" }}>
      <StatusBar
        backgroundColor={color}
        barStyle={barStyle}
        hidden={hidden}
        animated={animated}
        translucent
      />
      <KeyboardAnimationTemplate />
      <Button
        title={`Set ${hidden ? "shown" : "hidden"}`}
        onPress={() => setHidden(!hidden)}
      />
      <Button
        title="Update color"
        onPress={() => setColor(`${randomColor()}`)}
      />
      <Button
        title={`Set ${!animated ? "" : "not"} animated`}
        onPress={() => setAnimated(!animated)}
      />
      <Button
        title={`Change ${barStyle}`}
        onPress={() =>
          setBarStyle(
            barStyle === "light-content" ? "dark-content" : "light-content",
          )
        }
      />
    </View>
  );
}
