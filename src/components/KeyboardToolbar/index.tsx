import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { KeyboardController } from "../../bindings";
import KeyboardStickyView from "../KeyboardStickyView";

import Arrow from "./Arrow";

import type { LayoutChangeEvent } from "react-native";

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
  const [height, setHeight] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  return (
    <KeyboardStickyView offset={{ closed: height }}>
      <View
        // TODO: check whether it's readable or not
        accessibilityLabel="Toolbar"
        onLayout={onLayout}
        style={[styles.toolbar, height === 0 ? { marginBottom: -9999 } : null]}
      >
        <TouchableOpacity
          accessibilityState={{ disabled: false }}
          accessibilityRole="button"
          accessibilityLabel="Previous"
          accessibilityHint="Will move focus to previous field"
          onPress={() => KeyboardController.moveFocusTo("prev")}
        >
          <Arrow direction="up" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityState={{ disabled: false }}
          accessibilityRole="button"
          accessibilityLabel="Next"
          accessibilityHint="Will move focus to next field"
          onPress={() => KeyboardController.moveFocusTo("next")}
        >
          <Arrow direction="down" />
        </TouchableOpacity>

        <View style={styles.flex}>{renderContent?.()}</View>
        <TouchableOpacity
          accessibilityState={{ disabled: false }}
          accessibilityRole="button"
          accessibilityLabel="Done"
          accessibilityHint="Will close the keyboard"
          onPress={dismissKeyboard}
        >
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
