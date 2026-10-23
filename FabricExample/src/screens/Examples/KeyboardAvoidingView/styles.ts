import { PixelRatio, Platform, StyleSheet } from "react-native";

const inputHeight =
  Platform.OS === "android" ? PixelRatio.roundToNearestPixel(45) : 45;

export default StyleSheet.create({
  header: {
    color: "black",
    marginRight: 12,
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
    maxHeight: 600,
  },
  heading: {
    color: "black",
    fontSize: 36,
    marginBottom: 48,
    fontWeight: "600",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  textInput: {
    height: inputHeight,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: Platform.OS === "android" ? 9 : 10,
  },
  inputs: {
    gap: 36,
    marginBottom: 36,
  },
  button: {
    marginTop: 12,
    height: inputHeight,
    borderRadius: 10,
    backgroundColor: "rgb(40, 64, 147)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
});
