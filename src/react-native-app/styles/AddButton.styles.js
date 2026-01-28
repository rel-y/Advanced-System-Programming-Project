// styles/AddButton.styles.js
import { StyleSheet } from "react-native";

export function createStyles(theme) {
  return StyleSheet.create({
    root: {
      position: "absolute",
      left: "0%",
      top: "0%",
      right: "0%",
      bottom: "0%",
      zIndex: 9999,
      elevation: 9999,
    },

    // closes menu when pressing outside
    backdrop: {
      position: "absolute",
      left: "0%",
      top: "0%",
      right: "0%",
      bottom: "0%",
      backgroundColor: "transparent",
    },

    // Floating action button: use percentage offsets
    fab: {
      position: "absolute",
      right: "6%",
      bottom: "4%",
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.primaryBorder,
    },
    fabPressed: {
      backgroundColor: theme.colors.primaryBorder,
    },
    plus: {
      color: theme.colors["on-primary"],
      fontSize: 30,
      lineHeight: 30,
      fontWeight: String(theme.font["weight-bold"]),
    },

    // Menu above the button (also absolute with percentages)
    menu: {
      position: "absolute",
      right: "6%",
      bottom: "12%",
      width: 180,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },

    menuItem: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.surface,
    },
    menuItemPressed: {
      backgroundColor: theme.colors.hover,
    },

    menuText: {
      color: theme.colors.text,
      fontSize: theme.font["size-md"],
      fontWeight: String(theme.font["weight-medium"]),
    },

    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },
  });
}
