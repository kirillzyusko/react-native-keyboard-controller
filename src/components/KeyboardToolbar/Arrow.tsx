import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  direction: "up" | "down";
  color: string;
};

// TODO: handle bold text
const ArrowComponent: React.FC<Props> = ({ direction }) => {
  return (
    <View
      style={[
        styles.arrowContainer,
        direction === "down" && { transform: [{ rotate: "180deg" }] },
      ]}
    >
      <View style={styles.arrow}>
        <View
          style={[styles.arrowLine, { transform: [{ rotate: "-45deg" }] }]}
        />
        <View
          style={[
            styles.arrowLine,
            { transform: [{ rotate: "45deg" }] },
            { left: -4 },
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
    // TODO: use platform specific colors
    backgroundColor: "#007aff",
  },
});

export default ArrowComponent;
