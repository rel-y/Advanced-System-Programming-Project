import { StyleSheet, Platform } from "react-native";

export function createStyles(theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.bg,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },

    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
        },
        android: {
          elevation: 3,
        },
      }),
        flexDirection: "row",          
        alignItems: "center",          
        justifyContent: "space-between", 
    },
    cardPressed: {
    backgroundColor: theme.colors.hover,
    transform: [{ scale: 0.995 }],
    opacity: 0.96,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },

    leftHit: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      borderRadius: theme.radii.lg,
      paddingVertical: 6,
      paddingHorizontal: 6,
      marginRight: theme.spacing.xs,
    },

    leftHitPressed: {
      backgroundColor: theme.colors.hover,
    },

    iconWrap: {
      width: 52,
      height: 52,
      borderRadius: theme.radii.lg,
      backgroundColor: theme.colors.surface-2 ?? theme.colors.surface, // fallback if you removed surface-2
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      marginRight: theme.spacing.md,
      overflow: "hidden",
    },

    icon: {
      width: 30,
      height: 30,
    },

    textCol: {
      flex: 1,
      minWidth: 0,
    },

    title: {
      color: theme.colors.text,
      fontSize: theme.font["size-xl"] ?? 20,
      fontWeight: String(theme.font["weight-medium"] ?? 500),
      lineHeight: 24,
    },

    subtitle: {
      marginTop: 2,
      color: theme.colors["text-muted"],
      fontSize: theme.font["size-md"] ?? 16,
      lineHeight: 20,
    },

    dotSep: {
      color: theme.colors["text-muted"],
    },

    dotsHit: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },

    dotsHitPressed: {
      backgroundColor: theme.colors.hover,
    },

    dotsText: {
    fontSize: 24,                 // bigger
    lineHeight: 24,
    fontWeight: "700",            // thicker
    color: theme.colors.text,     // stronger contrast than muted
    opacity: 0.85,
    },

    dotsBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: "auto",   // <<< push to right edge
    },

    star: {
    color: "#fbbc04", // Google yellow star
    fontSize: 14,
    marginTop: 1,
    },
   });
}
