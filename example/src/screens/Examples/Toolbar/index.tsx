import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardController,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

export default function ToolbarExample() {
  const [show, setShow] = useState(true);

  return (
    <>
      <Button
        title="restore"
        onPress={() => KeyboardController.setFocusTo("current")}
      />
      <Button
        title={show ? "Hide" : "Show"}
        onPress={() => setShow((s) => !s)}
      />
      {show && <TextInput placeholder="o" title="Ok" />}
      <KeyboardAwareScrollView
        bottomOffset={62}
        style={[styles.withPadding, styles.container]}
      >
        <TextInput placeholder="1" title="Name" />
        <TextInput placeholder="2" title="Surname" multiline={false} />
        <TextInput
          keyboardType="default"
          placeholder="example@gmail.com"
          title="Email"
          editable={false}
          multiline={false}
        />
        <TextInput
          keyboardType="default"
          placeholder="Tell us funny facts about you"
          title="About you"
          editable={false}
        />
        <View style={styles.row}>
          <View style={styles.birthday}>
            <TextInput multiline={false} placeholder="DD" title="Day" />
          </View>
          <View style={[styles.birthday, styles.withPadding]}>
            <TextInput multiline={false} placeholder="MM" title="Month" />
          </View>
          <View style={styles.birthday}>
            <TextInput multiline={false} placeholder="YYYY" title="Year" />
          </View>
        </View>
        <TextInput placeholder="3" title="Country" />
        <TextInput placeholder="4" title="Region" />
        <TextInput placeholder="5" title="City" />
        <TextInput placeholder="6" title="Street" />
        <TextInput placeholder="7" title="House" />
        <TextInput placeholder="8" title="Flat" />
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
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
