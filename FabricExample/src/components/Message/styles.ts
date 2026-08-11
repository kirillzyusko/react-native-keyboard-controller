import { StyleSheet } from "react-native";

const container = {
  borderRadius: 10,
  padding: 10,
  margin: 10,
  marginVertical: 5,
  maxWidth: "75%" as const,
};

export default StyleSheet.create({
  senderContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#1be6cf",
    ...container,
  },
  recipientContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    ...container,
  },
  message: {
    color: "rgba(0, 0, 0, 0.0)",
    opacity: 0,
  },
});
