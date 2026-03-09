import React, { useState } from "react";
import {
  Modal,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import styles from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import type { KeyboardAvoidingViewProps } from "react-native";

type Props = StackScreenProps<ExamplesStackParamList>;

type Behavior = KeyboardAvoidingViewProps["behavior"];
const behaviors: Behavior[] = ["padding", "height", "position"];

function KAVContent({
  behavior,
  isPackageImplementation,
  keyboardVerticalOffset,
  automaticOffset,
}: {
  behavior: Behavior;
  isPackageImplementation: boolean;
  keyboardVerticalOffset: number;
  automaticOffset?: boolean;
}) {
  const Container = isPackageImplementation
    ? KeyboardAvoidingView
    : RNKeyboardAvoidingView;

  return (
    <Container
      behavior={behavior}
      contentContainerStyle={
        behavior === "position" ? styles.container : undefined
      }
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.content}
      testID="keyboard_avoiding_view.container"
      {...(isPackageImplementation ? { automaticOffset } : {})}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Header</Text>
        <View style={styles.inputs}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#7C7C7C"
            style={styles.textInput}
            testID="keyboard_avoiding_view.username"
          />
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#7C7C7C"
            style={styles.textInput}
            testID="keyboard_avoiding_view.password"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          testID="keyboard_avoiding_view.submit"
        >
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

export default function KeyboardAvoidingViewExample(_props: Props) {
  const [behavior, setBehavior] = useState<Behavior>(behaviors[0]);
  const [isPackageImplementation, setPackageImplementation] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [automaticOffset, setUseAbsolutePosition] = useState(false);
  const [offset, setOffset] = useState(100);
  const offsets = [0, 50, 100];

  return (
    <>
      <View style={styles.settings}>
        <TouchableOpacity
          style={styles.settingsButton}
          testID="keyboard_avoiding_view.implementation"
          onPress={() => setPackageImplementation((value) => !value)}
        >
          <Text style={styles.settingsText}>
            {isPackageImplementation ? "Package" : "RN"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          testID="keyboard_avoiding_view.behavior"
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
          testID="keyboard_avoiding_view.absolute"
          onPress={() => setUseAbsolutePosition((value) => !value)}
        >
          <Text style={styles.settingsText}>
            {automaticOffset ? "Auto" : "Manual"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          testID="keyboard_avoiding_view.offset"
          onPress={() => {
            const index = offsets.indexOf(offset);

            setOffset(offsets[index === offsets.length - 1 ? 0 : index + 1]);
          }}
        >
          <Text style={styles.settingsText}>+{offset}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          testID="keyboard_avoiding_view.modal"
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.settingsText}>Modal</Text>
        </TouchableOpacity>
      </View>
      <KAVContent
        behavior={behavior}
        isPackageImplementation={isPackageImplementation}
        keyboardVerticalOffset={offset}
        automaticOffset={automaticOffset}
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
          <Text style={styles.modalTitle}>Modal KAV</Text>
        </View>
        <KAVContent
          behavior={behavior}
          isPackageImplementation={isPackageImplementation}
          keyboardVerticalOffset={automaticOffset ? 0 : offset}
          automaticOffset={automaticOffset}
        />
      </Modal>
    </>
  );
}
