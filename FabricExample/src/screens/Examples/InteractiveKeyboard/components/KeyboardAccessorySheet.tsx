import * as React from "react";
import { useEffect, useState } from "react";
import { Modal, Platform, StyleSheet, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import {
  KeyboardEvents,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

import type { LayoutChangeEvent } from "react-native";

type Props = {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export function KeyboardAccessorySheet({ open, onClose, children }: Props) {
  const [viewHeight, setViewHeight] = useState(108);

  // used to detect the actual content height of the view
  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    if (height > 0) {
      setViewHeight(height);
    }
  };

  useEffect(() => {
    const willShow = KeyboardEvents.addListener("keyboardWillShow", (e) => {
      console.log("keyboardWillShow", e);
    });
    const didShow = KeyboardEvents.addListener("keyboardDidShow", (e) => {
      console.log("keyboardDidShow", e);
    });

    const willHide = KeyboardEvents.addListener("keyboardWillHide", (e) => {
      console.log("keyboardWillHide", e);
    });
    const didHide = KeyboardEvents.addListener("keyboardDidHide", (e) => {
      console.log("keyboardDidHide", e);
    });

    return () => {
      willShow.remove();
      didShow.remove();
      willHide.remove();
      didHide.remove();
    };
  }, []);

  return (
    <Modal
      animationType={Platform.OS === "ios" ? "none" : "slide"}
      transparent={true}
      visible={open}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="always"
        >
          <KeyboardGestureArea
            interpolator="ios"
            offset={viewHeight}
            style={styles.accessoryView}
            textInputNativeID="accessory-text-input"
          >
            <KeyboardStickyView>
              <View style={styles.container} onLayout={handleLayout}>
                <View style={[styles.content, { paddingBottom: 8 }]}>
                  <View style={styles.handle} />
                  {children}
                </View>
              </View>
            </KeyboardStickyView>
          </KeyboardGestureArea>
        </ScrollView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "salmon",
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
    // keep left/right border from being shown
    marginLeft: -1,
    marginRight: -1,
  },
  accessoryView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
});
