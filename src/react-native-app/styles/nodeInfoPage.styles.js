// src/styles/nodeInfoPage.styles.js
export function makeInfoStyles(theme) {
  const c = theme.colors;

  return {
    page: {
      flex: 1,
      backgroundColor: c.bg,
    },

    topBar: {
      paddingTop: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.bg,
    },

    backBtn: {
      width: 44,
      height: 44,
      borderRadius: theme.radii.pill,
      alignItems: "center",
      justifyContent: "center",
    },

    backIcon: {
      color: c["text-muted"],
      fontSize: 26,
      marginTop: -2,
    },

    pressed: {
      backgroundColor: c.hover,
    },

    topTitle: {
      flex: 1,
      minWidth: 0,
      color: c.text,
      fontSize: 34,
      fontWeight: "500",
    },

    previewWrap: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },

    previewInner: {
      borderRadius: 18,
      backgroundColor: c["surface-2"],
      borderWidth: 1,
      borderColor: c.border,
      padding: theme.spacing.lg,
      height: 260,
      justifyContent: "center",
    },

    previewIconWrap: {
      width: 64,
      height: 64,
      borderRadius: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      left: theme.spacing.lg,
      top: theme.spacing.lg,
    },

    previewIcon: {
      width: 30,
      height: 30,
    },

    previewSheet: {
      alignSelf: "center",
      width: "82%",
      height: "72%",
      borderRadius: 10,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,

      // subtle shadow
      elevation: theme.mode === "dark" ? 10 : 6,
      shadowColor: "#000",
      shadowOpacity: theme.mode === "dark" ? 0.35 : 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },

    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },

    label: {
      color: c["text-muted"],
      fontSize: 22,
      marginBottom: 4,
    },

    value: {
      color: c.text,
      fontSize: 30,
      fontWeight: "400",
    },

    rowInline: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
      marginTop: 2,
    },

    locationIconBox: {
      width: 42,
      height: 42,
      borderRadius: 10,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      justifyContent: "center",
    },

    locationIcon: {
      color: c["text-muted"],
      fontSize: 20,
    },

    twoColRow: {
      flexDirection: "row",
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      gap: theme.spacing.xl,
    },

    col: {
      flex: 1,
    },
  };
}
