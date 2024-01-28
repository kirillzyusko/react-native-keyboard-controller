import React from "react";
import { StyleSheet, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

import AutoFillContacts from "./Contacts";

export default function ToolbarExample() {
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
        />
        <TextInput
          keyboardType="default"
          placeholder="Your surname"
          title="Surname"
          testID="TextInput#2"
          multiline={false}
        />
        <TextInput
          keyboardType="default"
          placeholder="example@gmail.com"
          title="Email"
          editable={false}
          multiline={false}
          testID="TextInput#3"
        />
        <TextInput
          keyboardType="default"
          placeholder="Tell us funny facts about you"
          title="About you"
          editable={false}
          testID="TextInput#4"
        />
        <View style={styles.row}>
          <View style={styles.birthday}>
            <TextInput
              keyboardType="numeric"
              multiline={false}
              placeholder="DD"
              title="Day"
              testID="TextInput#5"
            />
          </View>
          <View style={[styles.birthday, styles.withPadding]}>
            <TextInput
              keyboardType="numeric"
              multiline={false}
              placeholder="MM"
              title="Month"
              testID="TextInput#6"
            />
          </View>
          <View style={styles.birthday}>
            <TextInput
              keyboardType="numeric"
              multiline={false}
              placeholder="YYYY"
              title="Year"
              testID="TextInput#7"
            />
          </View>
        </View>
        <TextInput
          keyboardType="default"
          placeholder="Country"
          title="Country"
          testID="TextInput#8"
        />
        <TextInput
          keyboardType="default"
          placeholder="Region of the city"
          title="Region"
          testID="TextInput#9"
        />
        <TextInput
          keyboardType="default"
          placeholder="City where you currently live"
          title="City"
          testID="TextInput#10"
        />
        <TextInput
          keyboardType="default"
          placeholder="Street name"
          title="Street"
          testID="TextInput#11"
        />
        <TextInput
          keyboardType="numeric"
          placeholder="House number"
          title="House"
          testID="TextInput#12"
        />
        <TextInput
          keyboardType="numeric"
          placeholder="Flat number"
          title="Flat"
          testID="TextInput#13"
        />
      </KeyboardAwareScrollView>
      <KeyboardToolbar Content={AutoFillContacts} />
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
});
