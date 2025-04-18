import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Platform, ScrollView, Switch, Text, View, KeyboardAvoidingView } from "react-native";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = StackScreenProps<ExamplesStackParamList>;

import KeyboardManager from 'react-native-keyboard-manager';
KeyboardManager.setEnableAutoToolbar(false);
/*if (Platform.OS === 'ios') {
    KeyboardManager.setEnable(true);
    KeyboardManager.setEnableDebugging(false);
    KeyboardManager.setKeyboardDistanceFromTextField(10);
    KeyboardManager.setLayoutIfNeededOnUpdate(true);
    KeyboardManager.setEnableAutoToolbar(false);
    KeyboardManager.setToolbarDoneBarButtonItemText("Done");
    KeyboardManager.setToolbarManageBehaviourBy("subviews"); // "subviews" | "tag" | "position"
    KeyboardManager.setToolbarPreviousNextButtonEnable(true);
    KeyboardManager.setToolbarTintColor('#FFFFFF'); // Only #000000 format is supported
    KeyboardManager.setToolbarBarTintColor('#3a3a3a'); // Only #000000 format is supported
    KeyboardManager.setShouldShowToolbarPlaceholder(true);
    KeyboardManager.setOverrideKeyboardAppearance(false);
    KeyboardManager.setKeyboardAppearance("default"); // "default" | "light" | "dark"
    KeyboardManager.setShouldResignOnTouchOutside(true);
    KeyboardManager.setShouldPlayInputClicks(true);
    KeyboardManager.resignFirstResponder();
    KeyboardManager.isKeyboardShowing()
      .then((isShowing) => {
          // ...
      });
}*/

export default function AwareScrollView({ navigation }: Props) {
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [_, setText] = useState("");

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.expand();
  }, []);

  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);
  const [enabled, setEnabled] = useState(true);
  const [snapToOffsetsEnabled, setSnapToOffsetsEnabled] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          testID="open_bottom_sheet_modal"
          onPress={handlePresentModalPress}
        >
          Open config
        </Text>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#3A3A3C"}} edges={["top"]}>
        <ScrollView
          style={styles.container}
          testID="aware_scroll_view_container"
        >
          {new Array(8).fill(0).map((_, i) => (
            <TextInput
              key={i}
              contextMenuHidden={i === 4 && Platform.OS === "ios"}
              // keyboardType={i % 2 === 0 ? "numeric" : "default"}
              placeholder={`TextInput#${i}`}
              onChangeText={setText}
            />
          ))}
        </ScrollView>
        <BottomSheet ref={bottomSheetModalRef} index={-1} snapPoints={["40%"]}>
          <Button
            testID="bottom_sheet_close_modal"
            title="Close modal"
            onPress={() => bottomSheetModalRef.current?.close()}
          />
          <View style={styles.switchContainer}>
            <Text>Toggle back scroll</Text>
            <Switch
              testID="bottom_sheet_toggle_back_scroll"
              value={disableScrollOnKeyboardHide}
              onChange={() => {
                setDisableScrollOnKeyboardHide(!disableScrollOnKeyboardHide);
              }}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text>Toggle enabled</Text>
            <Switch
              testID="bottom_sheet_toggle_enabled_state"
              value={enabled}
              onChange={() => {
                setEnabled(!enabled);
              }}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text>Toggle snapToOffsets</Text>
            <Switch
              testID="bottom_sheet_toggle_snap_to_offsets"
              value={snapToOffsetsEnabled}
              onChange={() => {
                setSnapToOffsetsEnabled(!snapToOffsetsEnabled);
              }}
            />
          </View>
        </BottomSheet>
    </SafeAreaView>
  );
}
