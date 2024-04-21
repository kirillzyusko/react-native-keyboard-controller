import { BlurView } from "@react-native-community/blur";
import React, { useCallback, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { trigger } from "react-native-haptic-feedback";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

import AutoFillContacts from "./Contacts";

import type { Contact } from "./Contacts";

// Optional configuration
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const haptic = () =>
  trigger(Platform.OS === "ios" ? "impactLight" : "keyboardTap", options);

export default function ToolbarExample() {
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

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={62}
        style={[styles.withPadding, styles.container]}
        testID="toolbar.scrollView"
      >
        <TextInput
          keyboardType="default"
          placeholder="Your name"
          title="Name"
          testID="TextInput#1"
          onFocus={onShowAutoFill}
          defaultValue={name}
        />
        <TextInput
          keyboardType="default"
          placeholder="Your surname"
          title="Surname"
          testID="TextInput#2"
          onFocus={onHideAutoFill}
          multiline={false}
        />
        <TextInput
          keyboardType="default"
          placeholder="example@gmail.com"
          title="Email"
          editable={false}
          multiline={false}
          onFocus={onHideAutoFill}
          testID="TextInput#3"
        />
        <TextInput
          keyboardType="default"
          placeholder="Tell us funny facts about you"
          title="About you"
          editable={false}
          onFocus={onHideAutoFill}
          testID="TextInput#4"
        />
        <View style={styles.row}>
          <View style={styles.birthday}>
            <TextInput
              keyboardType="numeric"
              multiline={false}
              placeholder="DD"
              title="Day"
              onFocus={onHideAutoFill}
              testID="TextInput#5"
            />
          </View>
          <View style={[styles.birthday, styles.withPadding]}>
            <TextInput
              keyboardType="numeric"
              multiline={false}
              placeholder="MM"
              title="Month"
              onFocus={onHideAutoFill}
              testID="TextInput#6"
            />
          </View>
          <View style={styles.birthday}>
            <TextInput
              keyboardType="numeric"
              multiline={false}
              placeholder="YYYY"
              title="Year"
              onFocus={onHideAutoFill}
              testID="TextInput#7"
            />
          </View>
        </View>
        <TextInput
          keyboardType="default"
          placeholder="Country"
          title="Country"
          onFocus={onHideAutoFill}
          testID="TextInput#8"
        />
        <TextInput
          keyboardType="default"
          placeholder="Region of the city"
          title="Region"
          onFocus={onHideAutoFill}
          testID="TextInput#9"
        />
        <TextInput
          keyboardType="default"
          placeholder="City where you currently live"
          title="City"
          onFocus={onHideAutoFill}
          testID="TextInput#10"
        />
        <TextInput
          keyboardType="default"
          placeholder="Street name"
          title="Street"
          onFocus={onHideAutoFill}
          testID="TextInput#11"
        />
        <TextInput
          keyboardType="numeric"
          placeholder="House number"
          title="House"
          onFocus={onHideAutoFill}
          testID="TextInput#12"
        />
        <TextInput
          keyboardType="numeric"
          placeholder="Flat number"
          title="Flat"
          onFocus={onHideAutoFill}
          testID="TextInput#13"
        />
      </KeyboardAwareScrollView>
      <KeyboardToolbar
        content={
          showAutoFill ? (
            <AutoFillContacts onContactSelected={onContactSelected} />
          ) : null
        }
        blur={blur}
        opacity={Platform.OS === "ios" ? "4F" : "DD"}
        onDoneCallback={haptic}
        onPrevCallback={haptic}
        onNextCallback={haptic}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
});

const blur = (
  <BlurView
    blurType={Platform.OS === "ios" ? "chromeMaterial" : "light"}
    blurAmount={32}
    reducedTransparencyFallbackColor="white"
    style={styles.absolute}
  />
);
