import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { KeyboardController } from "../../bindings";
import KeyboardStickyView from "../KeyboardStickyView";

import Arrow from "./Arrow";
import { colors } from "./colors";

import type { LayoutChangeEvent, TextStyle, ViewStyle } from "react-native";

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
  const theme = useColorScheme() || "light";
  const [height, setHeight] = useState(0);
  const background: ViewStyle = { backgroundColor: colors[theme].background };
  const done: TextStyle = { color: colors[theme].primary };

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  }, []);

  return (
    <KeyboardStickyView offset={{ closed: height }}>
      <View
        // TODO: check whether it's readable or not
        accessibilityLabel="Toolbar"
        onLayout={onLayout}
        style={[
          styles.toolbar,
          height === 0 ? { marginBottom: -9999 } : null,
          background,
        ]}
      >
        <TouchableOpacity
          accessibilityState={{ disabled: false }}
          accessibilityRole="button"
          accessibilityLabel="Previous"
          accessibilityHint="Will move focus to previous field"
          onPress={() => KeyboardController.setFocusTo("prev")}
        >
          <Arrow disabled direction="up" />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityState={{ disabled: false }}
          accessibilityRole="button"
          accessibilityLabel="Next"
          accessibilityHint="Will move focus to next field"
          onPress={() => KeyboardController.setFocusTo("next")}
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
            style={[
              {
                marginRight: 8,
                fontWeight: "600",
                fontSize: 15,
              },
              done,
            ]}
            maxFontSizeMultiplier={1.3}
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
    // TODO: don't hardcode? How to get this value from in `bottomOffset` in `KeyboardAwareScrollView`?
    height: 42,
    paddingHorizontal: 8,
  },
});

export default KeyboardToolbar;
