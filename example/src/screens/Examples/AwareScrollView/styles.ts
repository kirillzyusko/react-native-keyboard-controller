import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#3A3A3C",
  },
  content: {
    paddingTop: 50,
  },
  header: {
    color: "black",
    paddingRight: 12,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 16,
  },
  snapToOffsetsAbsoluteContainer: {
    width: "100%",
    position: "absolute",
  },
  snapToOffsetsInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  snapToOffsetsLine: {
    height: 2,
    flex: 1,
    backgroundColor: "black",
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
});
