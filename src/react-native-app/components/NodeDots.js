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
  ScrollView,
} from "react-native";
import { getTheme } from "../styles/Theme";
import { makeSheetStyles } from "../styles/node.styles";
import RenameDialog from "./RenameDialog";
import NodeInfoPage from "./NodeInfoPage";
import {fetchFromWebServer} from "../api/api"; // <-- make sure this path is correct
import { File, Paths } from "expo-file-system";
import * as FS from "expo-file-system/legacy";
import { SERVER_URL } from "../config";
//#region images
import ShareSvg from "../assets/icons/share.svg";
import InfoSvg from "../assets/icons/info.svg";
import UsersSvg from "../assets/icons/users.svg";
import StarSvg from "../assets/icons/star.svg";
import DownloadSvg from "../assets/icons/download.svg";
import CopySvg from "../assets/icons/copy.svg";
import EditSvg from "../assets/icons/edit.svg";
import MoveSvg from "../assets/icons/move.svg";
import TrashSvg from "../assets/icons/trash.svg";
import RestoreSvg from "../assets/icons/restore.svg";
import FolderDarkSvg from "../assets/folderDark.svg";
import FolderLightSvg from "../assets/folderLight.svg";
import FileDarkSvg from "../assets/fileDark.svg"; 
import FileLightSvg from "../assets/fileLight.svg";
import { useTheme } from "../scheme";
//#endregion

export default function NodeDots({ visible, onClose, node, onNodeUpdate,onListUpdate }) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme), [scheme]);
  const styles = useMemo(() => makeSheetStyles(theme), [theme]);

  const iconColor = theme.colors["text-muted"] ?? theme.colors.text;
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
const IconComponent = useMemo(() => {

  if (node?.type === "FOLDER") {
    return FolderLightSvg;
  }

  return FileLightSvg;
}, [node, theme.mode]);


  // --- Actions ---
  function onShare(n) {} //to do by who ever does premmissions
  function onManageAccess(n) {}//to do by who ever does premmissions

  async function onAddToStarred(n) {
    if (!n?.id) return;

    try {
      const response = await fetchFromWebServer(`${SERVER_URL}/api/files/${n.id}`, {
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

  function onMakeCopy(n) {}//might be removed

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

  function onMove(n) {}//TO DO by who ever does the list or by me after the list is made
  function onInfo(n) {
    if (!n) return;
    setInfoOpen(true);
  }
  async function onTrash(n){
        try {
            const response = await fetchFromWebServer(`${SERVER_URL}/api/files/${n.id}`, {
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
        const response = await fetchFromWebServer(`${SERVER_URL}/api/files/${n.id}`, {
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
    <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconWrap}>
            <View style={styles.typeIcon}>
              <IconComponent width={32} height={32} />
            </View>
          </View>

          <Text numberOfLines={1} style={styles.headerTitle}>
            {node?.name ?? (loadingNode ? "Loading..." : "")}
          </Text>

          {loadingNode && <ActivityIndicator />}
        </View>

        {/* Actions (disable by guarding node) */}
        <Row icon={<IconShare />} label="Share" onPress={() => node && onShare(node)} />
        <Row icon={<IconUsers />} label="Manage access" onPress={() => node && onManageAccess(node)} />
        <Row icon={<IconStar  />} label={node?.isStarred?"remove from favorite":"Add to favorite"} onPress={() => node && onAddToStarred(node)} />

        <Row
          icon={<IconDownload />}
          label={isDownloading ? "Downloading..." : "Download"}
          onPress={() => node && onDownload(node)}
          showDivider
          hidden={node?.type !== "FILE"}
        />

        <Row
          icon={<IconCopy />}
          label="Make a copy"
          onPress={() => node && onMakeCopy(node)}
          hidden={node?.type !== "FILE"}
        />

        <Row icon={<IconEdit />} label="Rename" onPress={() => node && onRename(node)} />
        <Row icon={<IconInfo />} label="Info" onPress={() => node && onInfo(node)} />
        <Row icon={<IconMove />} label="Move" onPress={() => node && onMove(node)} />
        <Row icon={<IconTrash />} hidden={node?.isInTrash} label={"Move to trash"} onPress={() => node && onTrash(node)} />
        <Row icon={<IconRestore />} hidden={!node?.isInTrash} label={"Remove from trash"} onPress={() => node && onTrash(node)} />
        <Row icon={<IconTrash />} hidden={!node?.isInTrash} label={"Delete"} onPress={() => node && onDelete(node)} />

        <Pressable onPress={onClose} style={({ pressed }) => [styles.cancelBtn, pressed && styles.rowPressed]}>
          <Text style={styles.cancelText}>Close</Text>
        </Pressable>
        </ScrollView>
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
        location={node?.parent}
        size={node?.size}
        lastAccessed={node?.timeText}
      />
      
    </Modal>
  );
}

function IconSvg({ Svg, color }) {
  return (
    <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
      <Svg width={20} height={20} fill={color} />
    </View>
  );
}

// --- Icons ---
function IconShare({ color = "#666" }) {
  return <IconSvg Svg={ShareSvg} color={color} />;
}
function IconInfo({ color = "#666" }) {
  return <IconSvg Svg={InfoSvg} color={color} />;
}
function IconUsers({ color = "#666" }) {
  return <IconSvg Svg={UsersSvg} color={color} />;
}
function IconStar({ color = "#666" }) {
  return <IconSvg Svg={StarSvg} color={color} />;
}
function IconDownload({ color = "#666" }) {
  return <IconSvg Svg={DownloadSvg} color={color} />;
}
function IconCopy({ color = "#666" }) {
  return <IconSvg Svg={CopySvg} color={color} />;
}
function IconEdit({ color = "#666" }) {
  return <IconSvg Svg={EditSvg} color={color} />;
}
function IconMove({ color = "#666" }) {
  return <IconSvg Svg={MoveSvg} color={color} />;
}
function IconTrash({ color = "#666" }) {
  return <IconSvg Svg={TrashSvg} color={color} />;
}
function IconRestore({ color = "#666" }) {
  return <IconSvg Svg={RestoreSvg} color={color} />;
}
  function toBase64(str) {
  return global.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(parseInt(p1, 16))
    )
  );
}
