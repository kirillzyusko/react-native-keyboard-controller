import React, { useState } from "react";
import { Button, Modal, StatusBar, Text, View } from "react-native";
import { useKeyboardController } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";

import type { StatusBarStyle } from "react-native";

export default function StatusBarManipulation() {
  const [barStyle, setBarStyle] = useState<StatusBarStyle>("light-content");
  const [hidden, setHidden] = useState(false);
  const [animated, setAnimated] = useState(true);
  const { setEnabled, enabled } = useKeyboardController();
  const [darkModalVisible, setDarkModalVisible] = useState(false);
  const [modalBarStyle, setModalBarStyle] = useState<StatusBarStyle>();

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
      <Button
        testID="button.dark_modal"
        title="Show dark modal"
        onPress={() => {
          setModalBarStyle(undefined);
          setDarkModalVisible(true);
        }}
      />
      <Modal
        statusBarTranslucent
        animationType="fade"
        visible={darkModalVisible}
        onRequestClose={() => setDarkModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {modalBarStyle ? <StatusBar barStyle={modalBarStyle} /> : null}
          <Text style={{ color: "white", marginBottom: 16 }}>
            {modalBarStyle
              ? `StatusBar inside the modal: ${modalBarStyle}`
              : "No StatusBar inside the modal yet"}
          </Text>
          <Button
            testID="button.modal_light_content"
            title="Set light-content"
            onPress={() => setModalBarStyle("light-content")}
          />
          <Button
            testID="button.close_dark_modal"
            title="Close"
            onPress={() => setDarkModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
