import { StyleSheet } from "react-native";
export function createStyles(theme) {
    return StyleSheet.create({
        tab: {
            backgroundColor: theme.colors.border,
            padding: theme.spacing.sm,
            width: "25%",
            alignItems: "center",
        },
        activeTab: {
            backgroundColor: theme.colors.active,
            borderRadius: 5,
            paddingLeft: 15,
            paddingRight: 15,
        },
        iconPart: {
            paddingTop: 3,
            paddingBottom: 3,
        },
        text: {
            fontWeight: theme.font["weight-semibold"],
            color: theme.colors.text
        },
    });
}