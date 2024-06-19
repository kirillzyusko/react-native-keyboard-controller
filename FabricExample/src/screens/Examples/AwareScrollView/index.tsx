import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Switch, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import TextInput from "../../../components/TextInput";

import { styles } from "./styles";

import type { ExamplesStackParamList } from "../../../navigation/ExamplesStack";
import type { StackScreenProps } from "@react-navigation/stack";

type Props = StackScreenProps<ExamplesStackParamList>;
const snapToOffsets = [125, 225, 325, 425, 525, 625];

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
        snapToOffsets={snapToOffsetsEnabled ? snapToOffsets : undefined}
        disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {snapToOffsetsEnabled && (
          <>
            {snapToOffsets.map((offset) => (
              <View
                key={offset}
                style={[
                  styles.snapToOffsetsAbsoluteContainer,
                  {
                    top: offset,
                  },
                ]}
              >
                <View style={styles.snapToOffsetsInnerContainer}>
                  <Text>{offset}</Text>
                  <View style={styles.snapToOffsetsLine} />
                </View>
              </View>
            ))}
          </>
        )}

        {new Array(10).fill(0).map((_, i) => (
          <TextInput
            key={i}
            placeholder={`TextInput#${i}`}
            keyboardType={i % 2 === 0 ? "numeric" : "default"}
            onChangeText={setText}
          />
        ))}
      </KeyboardAwareScrollView>
      <BottomSheet snapPoints={["40%"]} ref={bottomSheetModalRef} index={-1}>
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

        <View style={styles.switchContainer}>
          <Text>Toggle snapToOffsets</Text>
          <Switch
            value={snapToOffsetsEnabled}
            testID="bottom_sheet_toggle_snap_to_offsets"
            onChange={() => {
              setSnapToOffsetsEnabled(!snapToOffsetsEnabled);
            }}
          />
        </View>
      </BottomSheet>
    </>
  );
}
