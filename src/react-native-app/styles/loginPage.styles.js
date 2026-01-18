import { StyleSheet } from "react-native";
export function createStyles(theme) {
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.bg,
            width: "100%"
        },
        page: {
            flex: 1,
            padding: 30,
            justifyContent: 'center',
            backgroundColor: theme.colors.bg,
        },
        AppName: {
            color: theme.colors.text,
            marginBottom: theme.spacing['2xl'],
            fontSize: theme.font["size-xl"],
            textAlign: 'center',
            fontWeight: theme.font["weight-semibold"],
        },
        input: {
            backgroundColor: theme.colors.surface,
            margin: theme.spacing.xs,
            borderRadius: theme.radii.sm,
        },
        text: {
            alignItems: 'center',
            color: theme.colors.text,
            padding: theme.spacing['xs'],
            textAlign: 'start',
            alignSelf: "center",
        },
        inline: {
            marginTop: theme.spacing["2xl"],
        },
        inputError: {
            borderColor: theme.colors.danger,
            borderWidth: 1,
        },
        inputTextError: {
            color: theme.colors.danger,
            marginLeft: theme.spacing.xs,
        },
        selectedInput: {
            borderColor: theme.colors["text-muted"],
            borderWidth: 1,
        }
    });
}