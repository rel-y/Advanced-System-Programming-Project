// src/components/NodeActionsSheet.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
  Image,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { getTheme } from "../styles/Theme";
import { makeSheetStyles } from "../styles/node.styles";
import RenameDialog from "./RenameDialog";
import NodeInfoPage from "./NodeInfoPage";
import fetchFromWebServer from "../api/api"; // <-- make sure this path is correct
import { File, Paths } from "expo-file-system";
import * as FS from "expo-file-system/legacy";


export default function NodeDots({ visible, onClose, node, onNodeUpdate,onListUpdate }) {
  const scheme = useColorScheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => makeSheetStyles(theme), [theme]);

  const [renameOpen, setRenameOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [loadingNode, setLoadingNode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  // Slide animation
  const translateY = useRef(new Animated.Value(999)).current;
  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { toValue: 999, duration: 180, useNativeDriver: true }).start();
      setRenameOpen(false);
      setInfoOpen(false);
    }
  }, [visible, translateY]);

  // Safe iconSource (works even when node is null)
  const iconSource = useMemo(() => {
    const isDark = theme.mode === "dark";
    const type = node?.type;

    if (type === "FOLDER") {
      return isDark
        ? require("../assets/folderDark.jpg")
        : require("../assets/folderLight.jpg");
    }
    return isDark
      ? require("../assets/fileDark.jpg")
      : require("../assets/fileLight.jpg");
  }, [node?.type, theme.mode]);

  // --- Actions ---
  function onShare(n) {}
  function onManageAccess(n) {}

  async function onAddToStarred(n) {
    if (!n?.id) return;

    try {
      const response = await fetchFromWebServer(`http://10.0.2.2:8080/api/files/${n.id}`, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred: !n.isStarred }),
        method: "PATCH",
      });

      if (!response.ok) console.error("error starring item");
      else {
        // optimistic update
        onNodeUpdate({...node, isStarred: !node?.isStarred});
      }
    } catch (err) {
      console.error("Error starring item:", err);
    }
  }

  function onMakeCopy(n) {}

async function onDownload(n) {
  if (!n?.name || n?.content == null) return;

  if (Platform.OS !== "android") {
    Alert.alert("Not supported", "Direct save to Downloads is Android-only without using the share sheet.");
    return;
  }

  try {
    const perm = await FS.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!perm.granted) return;

    const destUri = await FS.StorageAccessFramework.createFileAsync(
      perm.directoryUri,
      n?.name,
      "text/plain"
    );

    // SAF writes need base64
    const base64 = toBase64(n.content);

    await FS.writeAsStringAsync(destUri, base64, {
      encoding: FS.EncodingType.Base64,
    });

    Alert.alert("Downloaded", `Saved to selected folder as ${n.name}`);
  } catch (e) {
    console.error("Download failed:", e);
    Alert.alert("Download failed", String(e?.message ?? e));
  }
}

  function onRename(n) {
    if (!n) return;
    setRenameOpen(true);
  }

  function onMove(n) {}
  function onInfo(n) {
    if (!n) return;
    setInfoOpen(true);
  }
  async function onTrash(n){
        try {
            const response = await fetchFromWebServer(`http://10.0.2.2:8080/api/files/${n.id}`, {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trash: !n.isInTrash
                }),
                method: 'PATCH'
            });
            if (response.ok) {
                onNodeUpdate({...n, isInTrash: !n.isInTrash})
            } else {
                console.error('error removing item from trash');
            }
        } catch (err) {
            console.error('Error fetching file:', err);
        }
    onListUpdate();
  }
  async function onDelete(n){
    try {
        const response = await fetchFromWebServer(`http://10.0.2.2:8080/api/files/${n.id}`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE'
        });
        if (response.ok) {
            onListUpdate();
        } else {
            console.error('error deleting item');
        }
    } catch (err) {
        console.error('Error fetching file:', err);
    }
  }
  const Row = ({ icon, label, onPress, showDivider = false, hidden = false }) => {
    if (hidden) return null;
    return (
      <>
        <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
          <View style={styles.rowIcon}>{icon}</View>
          <Text style={styles.rowText}>{label}</Text>
        </Pressable>
        {showDivider && <View style={styles.divider} />}
      </>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <Image source={iconSource} style={styles.headerIcon} resizeMode="contain" />
          </View>

          <Text numberOfLines={1} style={styles.headerTitle}>
            {node?.name ?? (loadingNode ? "Loading..." : "")}
          </Text>

          {loadingNode && <ActivityIndicator />}
        </View>

        {/* Actions (disable by guarding node) */}
        <Row icon={<IconShare color={styles._iconColor} />} label="Share" onPress={() => node && onShare(node)} />
        <Row icon={<IconUsers color={styles._iconColor} />} label="Manage access" onPress={() => node && onManageAccess(node)} />
        <Row icon={<IconStar color={styles._iconColor} />} label="Add to starred" onPress={() => node && onAddToStarred(node)} />

        <Row
          icon={<IconDownload color={styles._iconColor} />}
          label={isDownloading ? "Downloading..." : "Download"}
          onPress={() => node && onDownload(node)}
          showDivider
          hidden={node?.type !== "FILE"}
        />

        <Row
          icon={<IconCopy color={styles._iconColor} />}
          label="Make a copy"
          onPress={() => node && onMakeCopy(node)}
          hidden={node?.type !== "FILE"}
        />

        <Row icon={<IconEdit color={styles._iconColor} />} label="Rename" onPress={() => node && onRename(node)} />
        <Row icon={<IconInfo color={styles._iconColor} />} label="Info" onPress={() => node && onInfo(node)} />
        <Row icon={<IconMove color={styles._iconColor} />} label="Move" onPress={() => node && onMove(node)} />
        <Row icon={<IconTrash color={styles._iconColor} />} label={node?.isInTrash?"remove from tash": "move to trash"} onPress={() => node && onTrash(node)} />
        <Row icon={<IconTrash color={styles._iconColor} />} visible={node?.isInTrash} label={"delete"} onPress={() => node && onDelete(node)} />

        <Pressable onPress={onClose} style={({ pressed }) => [styles.cancelBtn, pressed && styles.rowPressed]}>
          <Text style={styles.cancelText}>Close</Text>
        </Pressable>
      </Animated.View>

      <RenameDialog
        visible={renameOpen}
        onClose={() => setRenameOpen(false)}
        node={node}
        onNodeUpdate={onNodeUpdate}
      />

      <NodeInfoPage
        visible={infoOpen}
        onClose={() => setInfoOpen(false)}
        name={node?.name}
        type={node?.type}
        location={node?.location}
        size={node?.size}
        lastAccessed={node?.lastAccessed}
      />
    </Modal>
  );
}

/* icons unchanged */
function IconShare({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>⤴</Text>
    </View>
  );
}
function IconInfo({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>🛈</Text>
    </View>
  );
}
function IconUsers({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>👥</Text>
    </View>
  );
}
function IconStar({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>☆</Text>
    </View>
  );
}
function IconDownload({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>⬇</Text>
    </View>
  );
}
function IconCopy({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>⧉</Text>
    </View>
  );
}
function IconEdit({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>✎</Text>
    </View>
  );
}
function IconMove({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>⤢</Text>
    </View>
  );

}
function IconTrash({ color }) {
  return (
    <View style={{ width: 24, height: 24 }}>
      <Text style={{ color, fontSize: 18 }}>🗑</Text>
    </View>
  );

}
  function toBase64(str) {
  return global.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(parseInt(p1, 16))
    )
  );
}
