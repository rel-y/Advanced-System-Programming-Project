// src/styles/fileEdit.styles.js
export function makeFileEditStyles(theme, insets = { bottom: 0, top: 0 }) {
  const bg = theme.colors.bg;
  const text = theme.colors.text;
  const topbar = theme.mode === "dark" ? "#1b1b1e" : "#ffffff";

  return {
    page: { flex: 1, backgroundColor: bg },

    // banner
    banner: {
      position: "absolute",
      top: insets.top + 6,
      left: 12,
      right: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 12,
      zIndex: 999,
    },
    bannerSuccess: { backgroundColor: "#1f7a33" },
    bannerError: { backgroundColor: "#b3261e" },
    bannerText: { color: "#fff", fontSize: 14, fontWeight: "700" },

    topBar: {
      height: 64,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: topbar,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    iconBtn: { padding: 10, borderRadius: 10 },
    iconText: { color: text, fontSize: 18 },
    pressed: { opacity: 0.65 },

    titleWrap: { flex: 1, marginHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    title: { color: text, fontSize: 20, fontWeight: "600" },

    rightActions: { flexDirection: "row", alignItems: "center", gap: 10 },

    pillBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: theme.colors["chip-bg"] ?? (theme.mode === "dark" ? "#2a2a2f" : "#e9eefb"),
    },
    pillText: { color: text, fontSize: 14, fontWeight: "600" },

    editorWrap: { flex: 1, padding: 18 },
    editor: { flex: 1, color: text, fontSize: 18, lineHeight: 26, padding: 0 },

    // IMPORTANT: lift above Android nav bar + give extra room
    bottomBar: {
      paddingHorizontal: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: topbar,
    },

    submitBtn: {
      height: 46,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
    },
    submitPressed: { opacity: 0.8 },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  };
}
