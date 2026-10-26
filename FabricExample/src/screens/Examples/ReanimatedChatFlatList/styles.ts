import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    color: "black",
    marginRight: 12,
  },
  contentContainer: { justifyContent: "flex-end", flexGrow: 1 },
  textInput: { height: 50, width: "100%", backgroundColor: "#BCBCBC" },
  fab: {
    position: "absolute",
    bottom: 50,
    right: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingBottom: 16,
  },
  circle: {
    width: 40,
    height: 40,
    backgroundColor: "#0080FF",
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
    color: "white",
  },
});
