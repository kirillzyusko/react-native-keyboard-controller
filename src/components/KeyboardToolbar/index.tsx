import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { KeyboardController } from "../../bindings";
import KeyboardStickyView from "../KeyboardStickyView";

import Arrow from "./Arrow";

export type KeyboardToolbarProps = {
  renderContent: () => JSX.Element;
};

// TODO: accessibility

const dismissKeyboard = () => KeyboardController.dismiss();

/**
 * `KeyboardToolbar` is a component that is shown above the keyboard with `Prev`/`Next` and
 * `Done` buttons.
 */
const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({ renderContent }) => {
  return (
    <KeyboardStickyView>
      <View style={styles.toolbar}>
        <TouchableOpacity
          onPress={() => KeyboardController.moveFocusTo("prev")}
        >
          <Arrow direction="up" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => KeyboardController.moveFocusTo("next")}
        >
          <Arrow direction="down" />
        </TouchableOpacity>

        <View style={styles.flex}>{renderContent?.()}</View>
        <TouchableOpacity onPress={dismissKeyboard}>
          <Text
            style={{
              marginRight: 8,
              fontWeight: "600",
              fontSize: 15,
              color: "#007aff",
            }}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardStickyView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  toolbar: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    // TODO: don't hardcode? How to get this value from in `bottomOffset` in `KeyboardAwareScrollView`?
    height: 42,
    paddingHorizontal: 8,
  },
});

export default KeyboardToolbar;
