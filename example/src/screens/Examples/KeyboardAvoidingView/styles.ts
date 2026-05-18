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
    justifyContent: "space-between",
  },
  heading: {
    paddingHorizontal: 24,
    paddingTop: 60,
    color: "black",
    fontSize: 36,
    marginBottom: 48,
    fontWeight: "600",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  textInput: {
    height: 45,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  inputs: {
    gap: 36,
    marginBottom: 200,
  },
  button: {
    marginBottom: 20,
    marginHorizontal: 24,
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
