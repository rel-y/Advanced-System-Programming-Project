// styles/searchBarPreview.styles.js
import { StyleSheet } from "react-native";

export function createStyles(theme) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      minWidth: 0,
      height: 40,
      borderRadius: theme.radii.pill,
      backgroundColor: theme.colors["surface-2"],
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      justifyContent: "center",
    },
    pressed: { backgroundColor: theme.colors.hover },
    text: {
      color: theme.colors["text-muted"],
      fontSize: theme.font["size-md"],
    },
  });
}
