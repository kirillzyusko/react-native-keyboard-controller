import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  name: string;
  size: number;
};

const getInitial = (name: string) =>
  Array.from(name.trim())[0]?.toUpperCase() ?? "?";

export default function Avatar({ name, size }: AvatarProps) {
  const containerStyle = useMemo(
    () => [
      styles.container,
      { width: size, height: size, borderRadius: size / 2 },
    ],
    [size],
  );
  const initialStyle = useMemo(
    () => [styles.initial, { fontSize: size / 2 }],
    [size],
  );

  return (
    <View style={containerStyle}>
      <Text style={initialStyle}>{getInitial(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#64D2FF",
  },
  initial: {
    color: "#000000",
    fontWeight: "600",
  },
});
