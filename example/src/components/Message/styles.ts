import { StyleSheet } from "react-native";

const container = {
  borderRadius: 10,
  padding: 10,
  margin: 10,
  marginVertical: 5,
};
export default StyleSheet.create({
  senderContainer: {
    alignSelf: "flex-end",
    backgroundColor: "#e0e0e0",
    ...container,
  },
  recipientContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#50FF00",
    ...container,
  },
  message: {
    color: "#000000",
  },
});
