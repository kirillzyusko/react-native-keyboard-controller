import React, { useMemo } from "react";
import { Animated, StyleSheet, View } from "react-native";

import useColorScheme from "../hooks/useColorScheme";

import { colors } from "./colors";

import type { ViewStyle } from "react-native";

type Props = {
  direction: "up" | "down";
  disabled?: boolean;
};

// TODO: maxFontSizeMultiplier={1.3}
// TODO: handle bold text
const ArrowComponent: React.FC<Props> = ({ direction, disabled }) => {
  const theme = useColorScheme();

  const color = useMemo(
    () => ({
      backgroundColor: disabled
        ? colors[theme].disabled
        : colors[theme].primary,
    }),
    [disabled, theme],
  );
  const left = useMemo(() => [styles.arrowLeftLine, color], [color]);
  const right = useMemo(() => [styles.arrowRightLine, color], [color]);

  return (
    <View
      style={
        direction === "down"
          ? styles.arrowDownContainer
          : styles.arrowUpContainer
      }
    >
      <View style={styles.arrow}>
        <Animated.View style={left} />
        <Animated.View style={right} />
      </View>
    </View>
  );
};

const arrowLine: ViewStyle = {
  width: 12,
  height: 2,
};
const arrowUpContainer: ViewStyle = {
  marginHorizontal: 5,
  width: 30,
  height: 30,
  justifyContent: "center",
  alignItems: "center",
};
const styles = StyleSheet.create({
  arrowUpContainer: arrowUpContainer,
  arrowDownContainer: {
    ...arrowUpContainer,
    transform: [{ rotate: "180deg" }],
  },
  arrow: {
    width: 20,
    height: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowLeftLine: {
    ...arrowLine,
    transform: [{ rotate: "-45deg" }],
  },
  arrowRightLine: {
    ...arrowLine,
    transform: [{ rotate: "45deg" }],
    left: -4,
  },
});

export default ArrowComponent;
