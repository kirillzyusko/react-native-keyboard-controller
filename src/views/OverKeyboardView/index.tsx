import React, { useMemo } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

import { RCTOverKeyboardView } from "../../bindings";
import { useWindowDimensions } from "../../hooks";

import type { OverKeyboardViewProps } from "../../types";
import type { PropsWithChildren } from "react";
import type { ViewStyle } from "react-native";

const OverKeyboardView = ({
  children,
  visible,
}: PropsWithChildren<OverKeyboardViewProps>) => {
  const { height, width } = useWindowDimensions();
  const inner: ViewStyle = useMemo(
    () => ({ position: "absolute", height, width }),
    [height, width],
  );

  return (
    <RCTOverKeyboardView visible={visible}>
      {/* TouchableWithoutFeedback is needed to prevent click handing on RootView (Android) */}
      <TouchableWithoutFeedback>
        {/* On iOS - stretch view to full window dimensions to make yoga work */}
        <View style={inner}>{children}</View>
      </TouchableWithoutFeedback>
    </RCTOverKeyboardView>
  );
};

export default OverKeyboardView;
