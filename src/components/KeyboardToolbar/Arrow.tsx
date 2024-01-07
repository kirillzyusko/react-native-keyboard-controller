import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";

import { colors } from "./colors";

type Props = {
  direction: "up" | "down";
  disabled?: boolean;
};

// TODO: maxFontSizeMultiplier={1.3}
// TODO: handle bold text
const ArrowComponent: React.FC<Props> = ({ direction, disabled }) => {
  const theme = useColorScheme() || "light";
  const color = {
    backgroundColor: disabled ? colors[theme].disabled : colors[theme].primary,
  };

  return (
    <View
      style={[
        styles.arrowContainer,
        direction === "down" && { transform: [{ rotate: "180deg" }] },
      ]}
    >
      <View style={styles.arrow}>
        <View
          style={[
            styles.arrowLine,
            { transform: [{ rotate: "-45deg" }] },
            color,
          ]}
        />
        <View
          style={[
            styles.arrowLine,
            { transform: [{ rotate: "45deg" }] },
            { left: -4 },
            color,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    marginHorizontal: 5,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    width: 20,
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowLine: {
    width: 12,
    height: 2,
  },
});

export default ArrowComponent;
