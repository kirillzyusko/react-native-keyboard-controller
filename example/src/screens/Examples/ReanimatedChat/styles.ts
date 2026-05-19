import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    color: "#007AFF",
    marginRight: 12,
  },
  inverted: {
    transform: [
      {
        rotate: "180deg",
      },
    ],
  },
});
