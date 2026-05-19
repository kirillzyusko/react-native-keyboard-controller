import { StyleSheet } from "react-native";

export default StyleSheet.create({
  behaviorBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    zIndex: 1000,
  },
  behaviorButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 13,
    color: "#8E8E93",
    backgroundColor: "#E9E9EB",
    overflow: "hidden",
  },
  behaviorButtonActive: {
    backgroundColor: "#007AFF",
    color: "#fff",
  },
  composerWrapper: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
  },
  container: {
    backgroundColor: "#F2F2F7",
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  dot: {
    backgroundColor: "#007AFF",
    borderRadius: 4,
    height: 8,
    marginHorizontal: 2,
    width: 8,
  },
  input: {
    color: "#1C1C1E",
    backgroundColor: "#F2F2F7",
    borderColor: "#D1D1D6",
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5EA",
    borderTopWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  list: {
    flex: 1,
  },
  messageContainer: {
    borderRadius: 16,
    padding: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#1C1C1E",
  },
  placeholderContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5EA",
    borderWidth: 1,
  },
  placeholderText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  systemMessageContainer: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  systemStyle: {
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  timeStamp: {},
  timeStampText: {
    color: "#888",
    fontSize: 12,
  },
  typingIndicator: {
    alignItems: "center",
    flexDirection: "row",
  },
  userMessageContainer: {
    backgroundColor: "#007AFF",
  },
  userMessageText: {
    color: "white",
  },
  userStyle: {
    alignItems: "flex-end",
    alignSelf: "flex-end",
    maxWidth: "75%",
  },
});
