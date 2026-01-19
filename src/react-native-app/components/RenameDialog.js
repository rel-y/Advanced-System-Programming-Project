// src/components/RenameDialog.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, TextInput, View, useColorScheme } from "react-native";
import { getTheme } from "../styles/Theme";
import { makeRenameStyles } from "../styles/renameDialog.styles";
import {fetchFromWebServer} from "../api/api";
export default function RenameDialog({ visible, onClose, node, onNodeUpdate }) {
  const scheme = useColorScheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => makeRenameStyles(theme), [theme]);

  const [value, setValue] = useState(node?.name ?? "");

  useEffect(() => {
    if (visible) setValue(node?.name ?? "");
  }, [visible]);

  async function onRenamePress() {
    if(value == node?.name) return;
    try{
        const response = await fetchFromWebServer(`http://10.0.2.2:8080/api/files/${node?.id}`, {
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ // only include fields if user inputted them. 
                    ...(value ? { name: value} : {}),
                }),
                method: 'PATCH'
        });
    if(response.ok){
        onNodeUpdate({...node, name: value});
        onClose();}
    else
        console.error("error renaming file, response:", response)
    }catch(e){
        console.error("error renaming file, response:", e)
    }
  }

  const title = node?.type === "FOLDER" ? "Rename folder" : "Rename file";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.centerWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>

          <TextInput
            value={value}
            onChangeText={setValue}
            autoFocus
            style={styles.input}
            selectionColor={theme.colors.primary}
            placeholder="Name"
            placeholderTextColor={theme.colors["text-muted"]}
          />

          <View style={styles.actionsRow}>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}>
              <Text style={styles.actionText}>Cancel</Text>
            </Pressable>

            <Pressable onPress={onRenamePress} style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}>
              <Text style={styles.actionText}>Rename</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
