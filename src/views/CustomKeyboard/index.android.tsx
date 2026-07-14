import React from "react";
import { View } from "react-native";

import { RCTCustomKeyboardView } from "../../bindings";

import type { CustomKeyboardProps } from "../../types";
import type { PropsWithChildren } from "react";

/**
 * A component that replaces the system keyboard with its children whenever
 * a text input becomes focused. 
 * @param props - Component props.
 * @returns A view component that renders in place of the system keyboard.
 * @example
 * ```tsx
 * <CustomKeyboard enabled={emojiKeyboardShown}>
 *   <EmojiPicker style={{ height: 300 }} onPick={insertEmoji} />
 * </CustomKeyboard>
 * ```
 */
const CustomKeyboard = (props: PropsWithChildren<CustomKeyboardProps>) => {
  const { children, enabled = true } = props;

  return (
    <RCTCustomKeyboardView enabled={enabled}>
      <View collapsable={false}>{children}</View>
    </RCTCustomKeyboardView>
  );
};

export default CustomKeyboard;
