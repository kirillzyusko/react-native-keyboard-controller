import { StyleSheet } from "react-native";

export const TEXT_INPUT_HEIGHT = 50;

export const MARGIN = 16;

export default StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "#3A3A3C",
  },
  input: {
    flex: 1,
    margin: MARGIN,
    marginBottom: 0,
    padding: MARGIN,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: "#BCBCBC",
    backgroundColor: "#3A3A3C66",
  },
  composer: {
    position: "absolute",
    width: "100%",
    minHeight: TEXT_INPUT_HEIGHT,
  },
  send: {
    position: "absolute",
    top: MARGIN + (TEXT_INPUT_HEIGHT - MARGIN * 2) / 2,
    right: MARGIN * 2,
    padding: MARGIN,
    backgroundColor: "white",
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
