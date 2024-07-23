import React, { useState } from "react";
import { Button, Modal, StyleSheet, View } from "react-native";
import { useKeyboardContext } from "react-native-keyboard-controller";

import KeyboardAnimationTemplate from "../../../components/KeyboardAnimation";

// when modal is unmounted we don't want to reset `softInputMode` to default value
const useKeyboardAnimation = () => {
  const context = useKeyboardContext();

  return context.animated;
};

export default function ModalExample() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        title={"Show Modal"}
        onPress={() => setModalVisible(true)}
        testID="show_button"
      />

      <View style={styles.animationContainer}>
        <KeyboardAnimationTemplate />
      </View>

      <Modal
        transparent
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Button
            title={"Close Modal"}
            onPress={() => setModalVisible(false)}
            testID="close_button"
          />
          {/* eslint-disable-next-line react-compiler/react-compiler */}
          <KeyboardAnimationTemplate provider={useKeyboardAnimation} />
        </View>
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
    paddingTop: 50,
    paddingLeft: 220,
    backgroundColor: "rgba(0,0,0,0.3)",
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
