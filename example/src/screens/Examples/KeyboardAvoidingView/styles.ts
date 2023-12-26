import { StyleSheet } from "react-native";

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
    height: 45,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 36,
    paddingLeft: 10,
  },
  button: {
    marginTop: 12,
    height: 45,
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
