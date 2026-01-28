// components/AddItemButton.jsx
import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "../scheme";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/AddButton.styles";
import { SERVER_URL } from "../config";
import { fetchFromWebServer } from "../api/api";

// icons (react-native-svg-transformer)
import FileIcon from "../assets/fileLight.svg";
import FolderIcon from "../assets/folderLight.svg";

export default function AddItemButton({ page = "home", AddNode = (node) => { } }) {
    const { scheme } = useTheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    const parentId = page;

    async function createNode(type) {
        try {
            const url = `${SERVER_URL}/api/files/`;
            const base =
                type === "FILE"
                    ? {
                        type: "FILE",
                        name: "new file",
                        content: "write somthing",
                    }
                    : {
                        type: "FOLDER",
                        name: "new folder",
                    };

            const body = (page.length < 20)
                ? base
                : { ...base, parent: parentId };

            const res = await fetchFromWebServer(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "content-type": "application/json",
                },
                body: JSON.stringify(body),
            });
            console.log("create node response:", res);
            if (res.ok) {
                const data = await res.json();
                console.log("created node:", data);
                AddNode(data[0]);
                close();
            } else {
                const err = await res.text().catch(() => "");
                console.error("create node failed:", res.status, err);
            }
        } catch (e) {
            console.error("create node error:", e);
        }
    }

    return (
        <View style={styles.root} pointerEvents="box-none">
            {/* Backdrop to close on outside press */}
            {open && (
                <Pressable style={styles.backdrop} onPress={close} />
            )}

            {/* Menu */}
            {open && (
                <View style={styles.menu}>
                    <Pressable
                        onPress={() => createNode("FOLDER")}
                        style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    >
                        <Text style={styles.menuText}>Folder</Text>
                        <FolderIcon width={18} height={18} />
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable
                        onPress={() => createNode("FILE")}
                        style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    >
                        <Text style={styles.menuText}>File</Text>
                        <FileIcon width={18} height={18} />
                    </Pressable>
                </View>
            )}

            {/* Floating Add button */}
            <Pressable
                onPress={() => setOpen((v) => !v)}
                style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
            >
                <Text style={styles.plus}>+</Text>
            </Pressable>
        </View>
    );
}
