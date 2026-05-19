import { Platform, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  title: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  icons: {
    fontSize: 18,
    marginLeft: 12,
  },
  badge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
