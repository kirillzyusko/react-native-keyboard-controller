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
    backgroundColor: "#F8F8FC",
    ...container,
  },
  recipientContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#64D2FF",
    ...container,
  },
  message: {
    color: "transparent",
  },
});
