import { StyleSheet } from "react-native";

const container = {
  borderRadius: 20,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginHorizontal: 12,
  marginVertical: 2,
  maxWidth: "78%" as const,
};

export default StyleSheet.create({
  senderContainer: {
    alignSelf: "flex-end" as const,
    backgroundColor: "#007AFF",
    ...container,
  },
  recipientContainer: {
    alignSelf: "flex-start" as const,
    backgroundColor: "#E8E8ED",
    ...container,
  },
  senderMessage: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 22,
  },
  recipientMessage: {
    color: "#1C1C1E",
    fontSize: 16,
    lineHeight: 22,
  },
});
