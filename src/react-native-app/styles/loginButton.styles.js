import { StyleSheet } from "react-native";
export function createStyles(theme) {
    return StyleSheet.create({
        buttonEnter: {
            backgroundColor: theme.colors.primary,
            padding: theme.spacing.md,
            borderColor: theme.colors.primaryBorder,
            borderWidth: 2,
            borderRadius: theme.radii.sm,
            margin: theme.spacing.xs
        },
        textEnter: {
            textAlign: 'center',
            fontWeight: theme.font["weight-semibold"],
            fontSize: theme.font["size-md"],
        },
        buttonMovePage: {
            backgroundColor: theme.colors["primary-weak"],
            padding: theme.spacing["2xs"],
            borderRadius: theme.radii.sm,
            padding: theme.spacing.md,

        },
        textMovePage: {
            textAlign: 'center',
            fontWeight: theme.font["weight-semibold"],

        }
    });
}