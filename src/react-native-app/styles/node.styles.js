// src/styles/nodeActionsSheet.styles.js
export function makeSheetStyles(theme) {
  const c = theme.colors;

  return {
    // Used by icon components above
    _iconColor: c["text-muted"],

    backdrop: {
      flex: 1,
      backgroundColor: theme.mode === "dark" ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
    },

    sheet: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,

      backgroundColor: c.surface,
      borderTopLeftRadius: theme.radii.lg,
      borderTopRightRadius: theme.radii.lg,
      borderTopWidth: 1,
      borderColor: c.border,

      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xl,

      // Android
      elevation: theme.mode === "dark" ? 18 : 12,

      // iOS
      shadowColor: "#000",
      shadowOpacity: theme.mode === "dark" ? 0.45 : 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: -6 },
    },

    handle: {
      alignSelf: "center",
      width: 46,
      height: 5,
      borderRadius: 999,
      backgroundColor: c.border,
      marginBottom: theme.spacing.sm,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.md,
    },

    headerIconWrap: {
      width: 44,
      height: 44,
      borderRadius: theme.radii.md,
      backgroundColor: c["surface-2"],
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },

    headerIcon: {
      width: 24,
      height: 24,
    },

    headerTitle: {
      flex: 1,
      minWidth: 0,
      color: c.text,
      fontSize: theme.font["size-xl"],
      fontWeight: String(theme.font["weight-medium"]),
    },

    row: {
      height: 54,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    rowPressed: {
      backgroundColor: c.hover,
    },

    rowIcon: {
      width: 32,
      alignItems: "center",
      justifyContent: "center",
    },

    rowText: {
      color: c.text,
      fontSize: theme.font["size-md"],
      fontWeight: String(theme.font["weight-regular"]),
    },

    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: theme.spacing.xs,
      marginLeft: theme.spacing.lg + 32 + theme.spacing.md, // align under text (after icon)
      marginRight: theme.spacing.lg,
      opacity: theme.mode === "dark" ? 0.85 : 1,
    },

    cancelBtn: {
      marginTop: theme.spacing.md,
      marginHorizontal: theme.spacing.lg,
      height: 48,
      borderRadius: theme.radii.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c["surface-2"],
      borderWidth: 1,
      borderColor: c.border,
    },

    cancelText: {
      color: c.text,
      fontSize: theme.font["size-md"],
      fontWeight: String(theme.font["weight-medium"]),
    },
  };
}
