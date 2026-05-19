import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: 0.2,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  formSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#9CA3AF",
    marginBottom: 28,
    paddingHorizontal: 2,
    lineHeight: 21,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginTop: 12,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  header: {
    color: "#007AFF",
    paddingRight: 12,
    fontWeight: "600",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  snapToOffsetsAbsoluteContainer: {
    width: "100%",
    position: "absolute",
  },
  snapToOffsetsInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  snapToOffsetsLine: {
    height: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    padding: 14,
    color: "#1A1A2E",
    fontSize: 16,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 16,
  },
  switchLabel: {
    fontSize: 15,
    color: "#1A1A2E",
  },
});
