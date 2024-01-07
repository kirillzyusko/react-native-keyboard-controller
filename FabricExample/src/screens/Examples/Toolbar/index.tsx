import React from "react";
import { Button, StyleSheet, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardController,
} from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

export default function ToolbarExample() {
  return (
    <>
      <Button
        title="next"
        onPress={() => KeyboardController.setFocusTo("next")}
      />
      <Button
        title="prev"
        onPress={() => KeyboardController.setFocusTo("prev")}
      />
      <KeyboardAwareScrollView style={styles.withPadding}>
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
    </>
  );
}

const styles = StyleSheet.create({
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
