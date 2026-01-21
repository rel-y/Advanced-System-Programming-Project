// src/components/NodeInfoPage.jsx
import React, { useMemo, useState,useEffect } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  Image,
  useColorScheme,
  ScrollView,
  
} from "react-native";
import { getTheme } from "../styles/Theme";
import { makeInfoStyles } from "../styles/nodeInfoPage.styles";
import {fetchFromWebServer} from "../api/api";
import { SERVER_URL } from "../config";
import FolderDarkSvg from "../assets/folderDark.svg";
import FolderLightSvg from "../assets/folderLight.svg";
import FileDarkSvg from "../assets/fileDark.svg";
import FileLightSvg from "../assets/fileLight.svg";
import { useTheme } from "../scheme";


// DD Mon YYYY (ex: 16 Dec 2025)
function formatDriveTime(input) {
  if (!input) return "";

  // Handle string / number / Date
  let date;
  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "string" || typeof input === "number") {
    date = new Date(input);
  } else if (input?.$date) {
    date = new Date(input.$date);
  } else {
    return "";
  }

  if (isNaN(date.getTime())) return "";

  const now = new Date();

  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  if (year === now.getFullYear()) {
    return `${day} ${month}`;
  }

  return `${day} ${month} ${year}`;
}

export default function NodeInfoPage({
  visible,
  onClose,
  name,
  type, // "FILE" | "FOLDER"
  location,
  size,
  lastAccessed, // Date | string
  id,
}) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => makeInfoStyles(theme), [theme]);
  const [parentFolder, setParentFolder] = useState("My-Drive")
  const isFolder = type === "FOLDER";

const IconComponent = useMemo(() => {
  const isDark = theme.mode === "dark";

  if (type === "FOLDER") {
    return isDark ? FolderDarkSvg : FolderLightSvg;
  }

  return isDark ? FileDarkSvg : FileLightSvg;
}, [type, theme.mode]);


useEffect(() => {
    async function load() {
      if(location == 0){
        setParentFolder("My-Drive");
        return;
      }
      try{
      let url = `${SERVER_URL}/api/files/${location}/permissions`;
      let res = await fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if(!res.ok){
        setParentFolder("shared with me");
        return;
      }
      url = `${SERVER_URL}/api/files/${location}`;
      res = await fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json",access: "false" },
      });
      const node = await res.json();
      setParentFolder(node.name);
    }catch(e){
      console.error("error reciving node data:",e)
    }
    }

    load();
  }, [id]);


  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.page}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <Pressable onPress={onClose} hitSlop={10} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
              <Text style={styles.backIcon}>←</Text>
            </Pressable>

            <Text numberOfLines={1} style={styles.topTitle}>
              {name ?? ""}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.label}>Type</Text>

            <View style={styles.typeRow}>
              <View style={styles.typeIcon}>
                <IconComponent width={32} height={32} />
              </View>
              <Text style={styles.value}>{isFolder ? "Folder" : "File"}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>location</Text>
            <View style={styles.rowInline}>
              <Text style={styles.value}>{parentFolder ?? ""}</Text>
            </View>
          </View>

          <View style={styles.twoColRow}>
            <View style={styles.col}>
              <Text style={styles.label}>Size</Text>
              <Text style={styles.value}>{size ?? ""}</Text>
            </View>

            {/* Storage used removed as requested */}
            <View style={styles.col} />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Last accessed</Text>
            <Text style={styles.value}>{lastAccessed}</Text>
          </View>
        </View>
    </Modal>
  );
}
