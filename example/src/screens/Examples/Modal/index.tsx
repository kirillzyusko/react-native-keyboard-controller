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
        color="#007AFF"
        testID="show_button"
        title={"Show Modal"}
        onPress={() => setModalVisible(true)}
      />

      <View style={styles.animationContainer}>
        <KeyboardAnimationTemplate />
      </View>

      <Modal
        statusBarTranslucent
        transparent
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Button
            color="#007AFF"
            testID="close_button"
            title={"Close Modal"}
            onPress={() => setModalVisible(false)}
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
    backgroundColor: "#F2F2F7",
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  textInput: {
    width: 200,
    marginTop: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
  },
});
