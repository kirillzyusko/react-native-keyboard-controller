import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef } from "react";
import { Button, Keyboard, StyleSheet, Text, View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";

import Switch from "../../../components/Switch";

import { useChatConfigStore } from "./store";

function ConfigSheet() {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const inverted = useChatConfigStore((state) => state.inverted);
  const setInverted = useChatConfigStore((state) => state.setInverted);
  const beginning = useChatConfigStore((state) => state.beginning);
  const setBeginning = useChatConfigStore((state) => state.setBeginning);
  const setFreeze = useChatConfigStore((state) => state.setFreeze);
  const mode = useChatConfigStore((state) => state.mode);
  const setMode = useChatConfigStore((state) => state.setMode);

  const handlePresentModalPress = useCallback(async () => {
    setFreeze(true);
    requestAnimationFrame(async () => {
      await KeyboardController.dismiss({ keepFocus: true });
      bottomSheetModalRef.current?.expand();
    });
  }, [setFreeze]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index < 0) {
        setFreeze(false);
        KeyboardController.setFocusTo("current");
      }
    },
    [setFreeze],
  );

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
  }, [navigation]);

  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      index={-1}
      snapPoints={["50%"]}
      onChange={handleSheetChange}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <Button
          testID="bottom_sheet_close_modal"
          title="Close modal"
          onPress={() => bottomSheetModalRef.current?.close()}
        />
        <View style={styles.switchContainer}>
          <Text>Toggle inverted</Text>
          <Switch
            testID="bottom_sheet_toggle_inverted_state"
            value={inverted}
            onChange={() => {
              setInverted(!inverted);
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>Toggle beginning</Text>
          <Switch
            testID="bottom_sheet_toggle_beginning_state"
            value={beginning}
            onChange={() => {
              setBeginning(!beginning);
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>Use Scroll View</Text>
          <Switch
            testID="bottom_sheet_toggle_scroll_view_list_state"
            value={mode === "scroll"}
            onChange={() => {
              setMode("scroll");
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>Use Flat List</Text>
          <Switch
            testID="bottom_sheet_toggle_flat_list_state"
            value={mode === "flat"}
            onChange={() => {
              setMode("flat");
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>Use Flash List 🚧</Text>
          <Switch
            testID="bottom_sheet_toggle_flash_list_state"
            value={mode === "flash"}
            onChange={() => {
              setMode("flash");
            }}
          />
        </View>
        <View style={styles.switchContainer}>
          <Text>Use Legend List 🚧</Text>
          <Switch
            testID="bottom_sheet_toggle_legend_list_state"
            value={mode === "legend"}
            onChange={() => {
              setMode("legend");
            }}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    color: "white",
    paddingRight: 12,
  },
  bottomSheetContent: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
  },
});

export default ConfigSheet;
