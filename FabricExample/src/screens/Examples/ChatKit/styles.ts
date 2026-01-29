import { StyleSheet } from "react-native";

export const TEXT_INPUT_HEIGHT = 50;

const MARGIN = 16;

export const contentContainerStyle = {
  paddingBottom: TEXT_INPUT_HEIGHT + MARGIN,
};

export default StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
  },
  input: {
    flex: 1,
    margin: MARGIN,
    padding: MARGIN,
    borderRadius: 99,
    backgroundColor: "#BCBCBC",
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
  // bottom sheet
  header: {
    color: "black",
    paddingRight: 12,
  },
  bottomSheetContent: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
  },
});
