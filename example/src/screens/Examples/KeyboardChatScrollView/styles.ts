import { StyleSheet } from "react-native";

export const TEXT_INPUT_HEIGHT = 50;

export const MARGIN = 16;

export default StyleSheet.create({
  container: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
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
  input: {
    flex: 1,
    margin: MARGIN,
    marginBottom: 0,
    padding: MARGIN,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
    color: "#1A1A2E",
    fontSize: 16,
  },
  composer: {
    position: "absolute",
    width: "100%",
    minHeight: TEXT_INPUT_HEIGHT,
    backgroundColor: "#F9F9F9",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
  },
  send: {
    position: "absolute",
    top: MARGIN + (TEXT_INPUT_HEIGHT - MARGIN * 2) / 2,
    right: MARGIN * 2,
    padding: MARGIN,
    backgroundColor: "#007AFF",
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 99,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
export const contentContainerStyle = {
  paddingBottom: TEXT_INPUT_HEIGHT + MARGIN,
};
export const invertedContentContainerStyle = {
  paddingTop: TEXT_INPUT_HEIGHT + MARGIN,
};
