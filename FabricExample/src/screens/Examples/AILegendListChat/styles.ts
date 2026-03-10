import { StyleSheet } from "react-native";

export default StyleSheet.create({
  behaviorBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    zIndex: 1000,
  },
  behaviorButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 13,
    color: "#666",
    backgroundColor: "#ddd",
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
    backgroundColor: "#fff",
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
    color: "black",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
  inputContainer: {
    alignItems: "center",
    backgroundColor: "#ffffffa0",
    borderColor: "#ccc",
    borderTopWidth: 1,
    flexDirection: "row",
    padding: 10,
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
    color: "black",
  },
  placeholderContainer: {
    backgroundColor: "#f8f9fa",
    borderColor: "#e9ecef",
    borderWidth: 1,
  },
  placeholderText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  systemMessageContainer: {},
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
