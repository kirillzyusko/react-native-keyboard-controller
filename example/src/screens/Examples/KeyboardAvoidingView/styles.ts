import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  // Chat header
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 58,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
    gap: 10,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  headerInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  chatStatus: {
    fontSize: 12,
    color: "#34C759",
    marginTop: 1,
  },
  // Messages
  messagesList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messagesContent: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 34,
    backgroundColor: "#F9F9F9",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
    gap: 6,
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  iconText: {
    fontSize: 22,
    color: "#007AFF",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 32,
    maxHeight: 100,
    fontSize: 16,
    color: "#1A1A2E",
    paddingTop: 6,
    paddingBottom: 6,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D1D6",
  },
  sendArrow: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: -1,
  },
  // keep for compatibility
  header: {
    color: "black",
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
  },
});
