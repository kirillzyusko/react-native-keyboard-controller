import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  settings: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  settingsButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#e8e8e8",
  },
  settingsText: {
    color: "black",
    fontSize: 14,
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
    paddingLeft: 10,
  },
  inputs: {
    gap: 36,
    marginBottom: 36,
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
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    color: "rgb(40, 64, 147)",
    fontSize: 16,
  },
  modalTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    marginRight: 40,
  },
});
