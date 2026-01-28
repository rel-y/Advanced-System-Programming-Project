import { StyleSheet } from "react-native";
export function createStyles(theme) {
    return StyleSheet.create({
        backdrop: {
            flex: 1,
            backgroundColor: theme.mode === "dark" ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.35)",
        },
        sheet: {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: "75%",
            backgroundColor: theme.colors["surface-2"],
            borderTopRightRadius: theme.radii.lg,
            borderBottomRightRadius: theme.radii.lg,
        },
        tab: {
            height: 70,
            paddingHorizontal: theme.spacing.lg,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: theme.spacing.md,
            borderColor: theme.colors.border,
            borderBottomWidth: 1
        },
        iconPart: {
            width: 32,
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            fontWeight: theme.font["weight-semibold"],
            color: theme.colors.text
        },
    });
}