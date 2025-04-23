import { BlurView } from "@react-native-community/blur";
import React, { useCallback, useEffect, useState } from "react";
import { Modal, Platform, StyleSheet, Text, View } from "react-native";
import { trigger } from "react-native-haptic-feedback";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import TextInput from "../../../components/TextInput";

import AutoFillContacts from "./Contacts";

import type { Contact } from "./Contacts";
import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const haptic = () =>
  trigger(Platform.OS === "ios" ? "impactLight" : "keyboardTap", options);

function Form() {
  const [showAutoFill, setShowAutoFill] = useState(false);
  const [name, setName] = useState("");
  const onContactSelected = useCallback((contact: Contact) => {
    setName(contact.name);
  }, []);
  const onShowAutoFill = useCallback(() => {
    setShowAutoFill(true);
  }, []);
  const onHideAutoFill = useCallback(() => {
    setShowAutoFill(false);
  }, []);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#3A3A3C", overflow: "hidden" }} edges={["top"]}>
      <KeyboardAwareScrollView
        bottomOffset={62}
        style={[styles.withPadding, styles.container]}
        testID="toolbar.scrollView"
      >
        <TextInput
          defaultValue={name}
          keyboardType="default"
          placeholder="Your name"
          testID="TextInput#1"
          title="Name"
          onFocus={onShowAutoFill}
        />
        <TextInput
          keyboardType="default"
          multiline={false}
          placeholder="Your surname"
          testID="TextInput#2"
          title="Surname"
          onFocus={onHideAutoFill}
        />
        <TextInput
          editable={false}
          keyboardType="default"
          multiline={false}
          placeholder="example@gmail.com"
          testID="TextInput#3"
          title="Email"
          onFocus={onHideAutoFill}
        />
        <TextInput
          editable={false}
          keyboardType="default"
          placeholder="Tell us funny facts about you"
          testID="TextInput#4"
          title="About you"
          onFocus={onHideAutoFill}
        />
        <TextInput
          keyboardType="default"
          placeholder="Country"
          testID="TextInput#8"
          title="Country"
          onFocus={onHideAutoFill}
        />
        <TextInput
          keyboardType="default"
          placeholder="Region of the city"
          testID="TextInput#9"
          title="Region"
          onFocus={onHideAutoFill}
        />
        <TextInput
          keyboardType="default"
          placeholder="City where you currently live"
          testID="TextInput#10"
          title="City"
          onFocus={onHideAutoFill}
        />
        <TextInput
          keyboardType="default"
          placeholder="Street name"
          testID="TextInput#11"
          title="Street"
          onFocus={onHideAutoFill}
        />
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          placeholder="House number"
          testID="TextInput#12"
          title="House"
          onFocus={onHideAutoFill}
        />
        <TextInput
          contextMenuHidden
          keyboardType="numeric"
          placeholder="Flat number"
          testID="TextInput#13"
          title="Flat"
          onFocus={onHideAutoFill}
        />
      </KeyboardAwareScrollView>
      <KeyboardToolbar
        // blur={blur}
        content={
          showAutoFill ? (
            <AutoFillContacts onContactSelected={onContactSelected} />
          ) : null
        }
        insets={insets}
        // opacity={Platform.OS === "ios" ? "4F" : "DD"}
        onDoneCallback={haptic}
        onNextCallback={haptic}
        onPrevCallback={haptic}
      />
    </SafeAreaView>
  );
}

type Props = StackScreenProps<ExamplesStackParamList>;

export default function ToolbarExample({ navigation }: Props) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.row}>
          <Text
            style={styles.header}
            testID="toolbar.kyc"
            onPress={() => setVisible(true)}
          >
            KYC
          </Text>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <>
      <Form />
      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={isVisible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modal}>
          <Form />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3A3A3C",
  },
  row: {
    flexDirection: "row",
  },
  birthday: {
    flex: 1 / 3,
  },
  withPadding: {
    paddingHorizontal: 16,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  header: {
    color: "black",
    marginRight: 12,
  },
  modal: {
    marginTop: 32,
  },
});

const blur = (
  <BlurView
    blurAmount={32}
    blurType={Platform.OS === "ios" ? "chromeMaterial" : "light"}
    reducedTransparencyFallbackColor="white"
    style={styles.absolute}
  />
);
