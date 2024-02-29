import React, { useState } from "react";
import { Button, Modal, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";
import TextInput from "../../../components/TextInput";

function KeyboardAnimation() {
  return <KeyboardAnimationTemplate />;
}

export default function ModalExample() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        title={"Show Modal"}
        onPress={() => setModalVisible(true)}
        testID="toggle_button"
      />

      <View style={styles.animationContainer}>
        <KeyboardAnimation />
      </View>


        <Modal
          transparent
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardProvider>
          <GestureHandlerRootView style={styles.modalContainer}>
            <KeyboardAnimation />
          </GestureHandlerRootView>
          </KeyboardProvider>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    flex: 1,
  },
  textInput: {
    width: 200,
    marginTop: 50,
    height: 50,
    backgroundColor: "yellow",
  },
});
