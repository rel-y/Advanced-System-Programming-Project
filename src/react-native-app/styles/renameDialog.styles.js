// src/styles/renameDialog.styles.js
export function makeRenameStyles(theme) {
  const c = theme.colors;

  return {
    backdrop: {
      flex: 1,
      backgroundColor: theme.mode === "dark" ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
    },

    centerWrap: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
    },

    card: {
      backgroundColor: c.surface,
      borderRadius: 28,
      paddingHorizontal: theme.spacing.xl,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: c.border,

      // Android
      elevation: theme.mode === "dark" ? 18 : 12,

      // iOS
      shadowColor: "#000",
      shadowOpacity: theme.mode === "dark" ? 0.45 : 0.18,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 10 },
    },

    title: {
      color: c.text,
      fontSize: 34,
      fontWeight: "700",
      marginBottom: theme.spacing.lg,
    },

    input: {
      height: 92,
      borderRadius: 12,
      borderWidth: 4,
      borderColor: theme.mode === "dark" ? c.primary : "#415a8b", // close to screenshot
      backgroundColor: theme.mode === "dark" ? c["surface-2"] : "#e7ebf5",
      color: c.text,
      fontSize: 42,
      paddingHorizontal: theme.spacing.lg,
    },

    actionsRow: {
      marginTop: theme.spacing.xl,
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: theme.spacing.xl,
    },

    actionBtn: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 999,
    },

    pressed: {
      backgroundColor: c.hover,
    },

    actionText: {
      color: theme.mode === "dark" ? c.primary : "#415a8b",
      fontSize: 32,
      fontWeight: "600",
    },
  };
}
