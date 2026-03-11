import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

type Behavior = "padding" | "height" | "position";
const behaviors: Behavior[] = ["padding", "height", "position"];

function KAVContent({
  behavior,
  keyboardVerticalOffset,
  automaticOffset,
}: {
  behavior: Behavior;
  keyboardVerticalOffset: number;
  automaticOffset: boolean;
}) {
  return (
    <KeyboardAvoidingView
      automaticOffset={automaticOffset}
      behavior={behavior}
      contentContainerStyle={
        behavior === "position" ? styles.container : undefined
      }
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.content}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Header</Text>
        <View style={styles.inputs}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#7C7C7C"
            style={styles.textInput}
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#7C7C7C"
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function KeyboardAvoidingViewAutomaticExample() {
  const [behavior, setBehavior] = useState<Behavior>(behaviors[0]);
  const [automaticOffset, setAutomaticOffset] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const offsets = [0, 50, 100];

  return (
    <>
      <View style={styles.settings}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            const index = behaviors.indexOf(behavior);

            setBehavior(
              behaviors[index === behaviors.length - 1 ? 0 : index + 1],
            );
          }}
        >
          <Text style={styles.settingsText}>{behavior}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            const index = offsets.indexOf(offset);

            setOffset(offsets[index === offsets.length - 1 ? 0 : index + 1]);
          }}
        >
          <Text style={styles.settingsText}>+{offset}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setAutomaticOffset((v) => !v)}
        >
          <Text style={styles.settingsText}>
            {automaticOffset ? "Auto" : "Manual"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.settingsText}>Modal</Text>
        </TouchableOpacity>
      </View>
      <KAVContent
        automaticOffset={automaticOffset}
        behavior={behavior}
        keyboardVerticalOffset={offset}
      />
      <Modal
        animationType="slide"
        presentationStyle="pageSheet"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            Modal ({automaticOffset ? "Auto" : "Manual"})
          </Text>
        </View>
        <KAVContent
          automaticOffset={automaticOffset}
          behavior={behavior}
          keyboardVerticalOffset={offset}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontSize: 36,
    marginBottom: 48,
    fontWeight: "600",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  inputs: {},
  textInput: {
    height: 44,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 36,
    paddingLeft: 10,
  },
  button: {
    marginTop: 12,
    height: 44,
    borderRadius: 10,
    backgroundColor: "rgb(40, 64, 147)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
  settings: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
  settingsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#E8E8E8",
  },
  settingsText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  closeButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
});
