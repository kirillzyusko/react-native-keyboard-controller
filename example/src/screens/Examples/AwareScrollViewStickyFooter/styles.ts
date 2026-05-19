import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F2F2F7",
  },
  content: {
    paddingTop: 24,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  footerText: {
    color: "#1C1C1E",
    fontWeight: "600",
    fontSize: 15,
  },
  circle: {
    position: "absolute",
    bottom: 0,
    right: 30,
    justifyContent: "flex-end",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
  },
  header: {
    color: "#007AFF",
    paddingRight: 12,
    fontWeight: "600",
  },
  inputInFooter: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 12,
  },
});
