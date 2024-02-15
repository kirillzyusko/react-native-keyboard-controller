import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingTop: 50,
  },
  pageContainer: {
    flex: 1,
  },
  footer: {
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
    gap: 10,
  },
  footerText: {
    color: "white",
    fontWeight: "bold",
  },
  circle: {
    position: "absolute",
    bottom: 0,
    right: 30,
    justifyContent: "flex-end",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#002099",
  },
  header: {
    color: "black",
    paddingRight: 12,
  },
  inputInFooter: {
    width: 200,
    backgroundColor: "yellow",
  },
});
