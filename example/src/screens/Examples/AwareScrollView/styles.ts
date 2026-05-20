import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingTop: 24,
    paddingBottom: 50,
  },
  progressContainer: {
    marginBottom: 24,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    width: "33%",
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  formTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#9CA3AF",
    marginBottom: 32,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#007AFF",
    marginTop: 16,
    marginBottom: 16,
    letterSpacing: 0.8,
    textTransform: "uppercase",
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
