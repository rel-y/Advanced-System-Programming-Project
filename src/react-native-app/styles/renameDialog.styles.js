export function makeRenameStyles(theme) {
  return {
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.35)",
    },

    centerWrap: {
      position: "absolute",
      inset: 0,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 18,          // a bit tighter
    },

    card: {
      width: "86%",                   // smaller than before
      maxWidth: 340,                  // cap on tablets
      borderRadius: 16,
      backgroundColor: theme.colors.bg,
      paddingHorizontal: 16,          // reduced padding
      paddingTop: 14,
      paddingBottom: 12,
      elevation: 6,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },

    title: {
      fontSize: 18,                   // smaller title
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 10,
    },

    input: {
      height: 46,                     // smaller input
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderRadius: 10,
      paddingHorizontal: 12,
      fontSize: 16,
      color: theme.colors.text,
      backgroundColor: theme.colors["surface"] ?? theme.colors.bg,
      marginBottom: 12,
    },

    actionsRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 14,                        // smaller gap
      paddingTop: 2,
    },

    actionBtn: {
      paddingVertical: 8,             // smaller buttons
      paddingHorizontal: 10,
      borderRadius: 10,
    },

    actionText: {
      fontSize: 16,                   // smaller text
      fontWeight: "600",
      color: theme.colors.primary,
    },

    pressed: {
      opacity: 0.65,
    },
  };
}
