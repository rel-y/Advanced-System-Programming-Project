// components/TopBar.styles.js
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";

export function createStyles(theme) {
        const AVATAR_SIZE = 36; // or whatever size you want

    return StyleSheet.create({
        bar: {
            height: theme.layout["topbar-height"],
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            flexDirection: "row",
            alignItems: "center",
            overflow: "visible",
            position: "relative",
            paddingHorizontal: theme.spacing.md,
            gap: theme.spacing.sm,
        },

        iconBtn: {
            width: 40,
            height: 40,
            borderRadius: theme.radii.pill,
            alignItems: "center",
            justifyContent: "center",
        },
        iconBtnPressed: {
            backgroundColor: theme.colors.hover,
        },

        hamburger: {
            width: 18,
            height: 14,
            justifyContent: "space-between",
        },
        hLine: {
            height: 2,
            borderRadius: 2,
            backgroundColor: theme.colors.text,
            opacity: 0.85,
        },

        searchWrap: {
            flex: 1,
            height: 40,
            borderRadius: theme.radii.pill,
            backgroundColor: theme.colors["surface-2"],
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: theme.spacing.md,
            justifyContent: "center",
        },
        searchPressed: {
            backgroundColor: theme.colors.hover,
        },
        searchInput: {
            color: theme.colors.text,
            fontSize: theme.font["size-md"],
            paddingVertical: 0,
        },

        avatarWrap: {
            width: AVATAR_SIZE+4,
            height: AVATAR_SIZE+4,
            borderRadius: theme.radii.pill,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        portalDropdown: {
            position: "absolute",
            zIndex: 9999,
            elevation: 9999,
        },
        avatarPressed: {
            opacity: 0.9,
        },
        avatar: {
            width: "100%",
            height: "100%",
        },
        avatarPlaceholder: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors["surface-2"],
        },

        menu: {
            alignSelf: "flex-end",
            marginTop: theme.spacing.xs,
            marginRight: theme.spacing.md,
            width: 240,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radii.md,
            padding: theme.spacing.md,
        },

        menuLine: {
            marginBottom: theme.spacing.xs,
            color: theme.colors.text,
            fontSize: theme.font["size-sm"],
        },

        avatarCircle: {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            overflow: "hidden",          // IMPORTANT: clips the image to circle
            backgroundColor: "#333",     // fallback background
            alignItems: "center",
            justifyContent: "center",
        },

        avatarImage: {
            width: "100%",
            height: "100%",
            resizeMode: "cover",
        },

        avatarPlaceholder: {
            width: "100%",
            height: "100%",
            backgroundColor: "#555",
        },

        menuLabel: {
            color: theme.colors["text-muted"],
            fontWeight: String(theme.font["weight-medium"]),
        },
        menuValue: {
            color: theme.colors.text,
        },

        logoutBtn: {
            marginTop: theme.spacing.sm,
            height: 40,
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors["primary-weak"],
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: theme.colors.primaryBorder,
        },
        logoutPressed: {
            opacity: 0.9,
        },
        logoutText: {
            color: theme.colors.primary,
            fontWeight: String(theme.font["weight-semibold"]),
            fontSize: theme.font["size-md"],
        },
    });
}
