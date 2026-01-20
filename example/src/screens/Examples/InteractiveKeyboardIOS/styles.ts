import { StyleSheet } from "react-native";

export const TEXT_INPUT_HEIGHT = 50;

export const contentContainerStyle = {
  paddingBottom: TEXT_INPUT_HEIGHT,
};

export default StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#BCBCBC",
  },
  composer: {
    position: "absolute",
    width: "100%",
    minHeight: TEXT_INPUT_HEIGHT,
  },
});
