import { StyleSheet } from "react-native";
export function createStyles(theme) {
    return StyleSheet.create({
        tab: {
            backgroundColor: theme.colors.border,
            padding: theme.spacing.sm,
            width: "25%",
            alignItems: "center",
        },
        selectedTab: {
            backgroundColor: theme.colors.hover
        },
        text: {
            fontWeight: theme.font["weight-semibold"],
            color: theme.colors.text
        },
    });
}