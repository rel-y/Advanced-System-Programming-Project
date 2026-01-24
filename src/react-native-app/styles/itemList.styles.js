// app/(tabs)/style.js
import { StyleSheet } from "react-native";

export function createStyles(theme) {
  return StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },

    listContent: {
      paddingVertical: theme.spacing.md,
    },

    separator: {
      height: 8,
      backgroundColor: "transparent",
      marginHorizontal: theme.spacing.sm,
    },
  });
}
