import React from "react";
import { Button, View } from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";

export default function EnabledDisabled() {
  const { enabled, setEnabled } = useKeyboardController();

  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <Button
        testID="toggle_button"
        title={enabled ? "Enabled" : "Disabled"}
        onPress={() => setEnabled(!enabled)}
      />
      <KeyboardAnimationTemplate />
    </View>
  );
}
