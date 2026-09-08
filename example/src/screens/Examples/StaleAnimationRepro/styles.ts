import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginRight: 12,
    fontSize: 15,
    color: "#0a84ff",
  },
  list: {
    flex: 1,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  panel: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  hint: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 6,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#e5e5ea",
  },
  buttonLabel: {
    fontSize: 13,
    fontWeight: "500",
  },
  buttonOk: {
    backgroundColor: "#d1f0d6",
  },
  buttonBug: {
    backgroundColor: "#f8d7da",
  },
  verdict: {
    marginTop: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  verdictGood: {
    backgroundColor: "#d1f0d6",
  },
  verdictBad: {
    backgroundColor: "#f8d7da",
  },
  verdictText: {
    fontSize: 13,
    fontWeight: "600",
  },
  verdictDetail: {
    fontFamily: "Menlo",
    fontSize: 10,
    color: "#333",
  },
  footer: {
    padding: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
    backgroundColor: "#ffd60a",
  },
  input: {
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
