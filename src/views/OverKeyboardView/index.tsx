import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { IS_FABRIC } from "../../architecture";
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
    () => [
      styles.absolute,
      // On iOS - stretch view to full window dimensions to make yoga work
      // On Android Fabric we temporarily use the same approach
      Platform.OS === "ios" || IS_FABRIC ? inner : undefined,
    ],
    [inner],
  );

  return (
    <RCTOverKeyboardView visible={visible}>
      {/* `OverKeyboardView` should always have a single child */}
      <View collapsable={false} style={style}>
        {children}
      </View>
    </RCTOverKeyboardView>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
  },
});

export default OverKeyboardView;
