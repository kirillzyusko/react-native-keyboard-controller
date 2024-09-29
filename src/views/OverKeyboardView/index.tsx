import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { RCTOverKeyboardView } from "../../bindings";
import { useWindowDimensions } from "../../hooks";

import type { OverKeyboardViewProps } from "../../types";
import type { PropsWithChildren } from "react";

const OverKeyboardView = ({
  children,
  visible,
}: PropsWithChildren<OverKeyboardViewProps>) => {
  const { height, width } = useWindowDimensions();
  const inner = useMemo(() => ({ height, width }), [height, width]);
  const style = useMemo(
    () => [styles.absolute, Platform.OS === "ios" ? inner : undefined],
    [inner],
  );

  return (
    <RCTOverKeyboardView visible={visible}>
      {/* On iOS - stretch view to full window dimensions to make yoga work */}
      <View style={style}>{children}</View>
    </RCTOverKeyboardView>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});

export default OverKeyboardView;
