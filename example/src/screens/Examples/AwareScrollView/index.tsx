import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Switch, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<ExamplesStackParamList>;

export default function AwareScrollView({ navigation }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [disableScrollOnKeyboardHide, setDisableScrollOnKeyboardHide] =
    useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text
          style={styles.header}
          onPress={handlePresentModalPress}
          testID="open_bottom_sheet_modal"
        >
          Open config
        </Text>
      ),
    });
  }, []);

  return (
    <>
      <KeyboardAwareScrollView
        testID="aware_scroll_view_container"
        bottomOffset={50}
        enabled={enabled}
        disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {new Array(10).fill(0).map((_, i) => (
          <TextInput
            key={i}
            placeholder={`TextInput#${i}`}
            keyboardType={i % 2 === 0 ? "numeric" : "default"}
          />
        ))}
      </KeyboardAwareScrollView>
      <BottomSheetModal
        snapPoints={["40%"]}
        ref={bottomSheetModalRef}
        index={0}
      >
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
            value={enabled}
            testID="bottom_sheet_toggle_enabled_state"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />
        </View>
      </BottomSheetModal>
    </>
  );
}
