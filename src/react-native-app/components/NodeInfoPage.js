// src/components/NodeInfoPage.jsx
import React, { useMemo } from "react";
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
}) {
  const scheme = useColorScheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => makeInfoStyles(theme), [theme]);

  const isFolder = type === "FOLDER";

  const iconSource = useMemo(() => {
    const isDark = theme.mode === "dark";
    if (isFolder) {
      return isDark
        ? require("../assets/folderDark.jpg")
        : require("../assets/folderLight.jpg");
    }
    return isDark
      ? require("../assets/fileDark.jpg")
      : require("../assets/fileLight.jpg");
  }, [isFolder, theme.mode]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView>
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

          {/* Preview card (no real content, as requested) */}
          <View style={styles.previewWrap}>
            <View style={styles.previewInner}>
              <View style={styles.previewIconWrap}>
                <Image source={iconSource} style={styles.previewIcon} resizeMode="contain" />
              </View>

              <View style={styles.previewSheet} />
            </View>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{isFolder ? "Folder" : "File"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.rowInline}>
              <View style={styles.locationIconBox}>
                <Text style={styles.locationIcon}>⌂</Text>
              </View>
              <Text style={styles.value}>{location ?? ""}</Text>
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
            <Text style={styles.value}>{formatDriveTime(lastAccessed)}</Text>
          </View>
        </View>
        </ScrollView>
    </Modal>
  );
}
