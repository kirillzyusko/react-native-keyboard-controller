import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    color: "black",
    marginRight: 12,
  },
  contentContainer: { justifyContent: "flex-end", flexGrow: 1 },
  textInput: {
    height: 48,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 16,
    color: "#1C1C1E",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  circle: {
    width: 44,
    height: 44,
    backgroundColor: "#007AFF",
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 24,
    color: "white",
  },
});
