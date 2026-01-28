// styles/searchScreen.styles.js
import { StyleSheet } from "react-native";

export function createStyles(theme) {
  return StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },

    header: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      gap: theme.spacing.sm,
    },

    backBtn: {
      alignSelf: "flex-start",
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors["surface-2"],
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    backText: {
      color: theme.colors.text,
      fontWeight: String(theme.font["weight-medium"]),
    },

    searchWrap: {
      height: 44,
      borderRadius: theme.radii.pill,
      backgroundColor: theme.colors["surface-2"],
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    input: {
      flex: 1,
      minWidth: 0,
      color: theme.colors.text,
      fontSize: theme.font["size-md"],
      paddingVertical: 0,
    },

    listWrap: {
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },

    gap: { height: 8 },

    row: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
    },
    rowPressed: { backgroundColor: theme.colors.hover },

    name: {
      color: theme.colors.text,
      fontSize: theme.font["size-md"],
      fontWeight: String(theme.font["weight-medium"]),
    },
    type: {
      marginTop: 2,
      color: theme.colors["text-muted"],
      fontSize: theme.font["size-sm"],
    },

    empty: { paddingVertical: theme.spacing.md },
    emptyText: { color: theme.colors["text-muted"] },
  });
}
