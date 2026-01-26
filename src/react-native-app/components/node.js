// app/node/[id].jsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/nodeHeader.styles";
import NodeDots from "./NodeDots";
import { fetchFromWebServer } from "../api/api";
import { SERVER_URL } from "../config";
import StarSvg from "../assets/icons/star.svg";
import FolderDarkSvg from "../assets/folderDark.svg";
import FolderLightSvg from "../assets/folderLight.svg";
import FileDarkSvg from "../assets/fileDark.svg";
import FileLightSvg from "../assets/fileLight.svg";
import { useTheme } from "../scheme";
import { SafeAreaView } from "react-native-safe-area-context";

//on list update activates when the list needs a refresh i.e moved to trash... yea i think that is all the rest
//of the instances only the item needs a refresh like while staring
export default function Node({ id, onListUpdate = () => { }, onFolderUpdate = () => { } }) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [node, setNode] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
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


  useEffect(() => {
    async function load() {
      try {
        const url = `${SERVER_URL}/api/files/${id}`;
        const res = await fetchFromWebServer(url, {
          method: "GET",
          headers: { Accept: "application/json", access: "false" },
        });
        console.log(res);
        const node = await res.json();
        console.log(node.lastAccess);

        node.subtitle = "you opened";
        node.timeText = formatDriveTime(node.lastAccess);
        setNode(node);
      } catch (e) {
        console.error("error reciving node data:", e)
      }
    }

    load();
  }, [id]);
  async function OnItemPress(node) {
    if (node?.type === "FILE") {
      //TO DO by who ever is doing the file edit
    } else {
      const url = `${SERVER_URL}/api/folders/${node?.id}`;
      const res = await fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json", access: "false" },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        onFolderUpdate(node.id,data);
      } else
        console.error("failed fetching children")
    }
  }

  function OnDotsPress() {
    setSelectedId(node?.id ?? String(id ?? ""));
    setIsSheetOpen(true);
  }

  const IconComponent = useMemo(() => {

    if (node?.type === "FOLDER") {
      return FolderLightSvg;
    }

    return FileLightSvg;
  }, [node, theme.mode]);


  return (

    <View>
      <Pressable
        onPress={() => OnItemPress(node)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.leftHit}>
          <View style={styles.iconWrap}>
            <View style={styles.typeIcon}>
              <IconComponent width={32} height={32} fill={"#90D5FF"} strokeWidth={2} />
            </View>
          </View>

          <View style={styles.textCol}>
            <Text numberOfLines={1} style={styles.title}>
              {node?.name ?? ""}
            </Text>
            <View style={styles.subtitle}>
              <Text numberOfLines={1} style={styles.subtitle}>
                {node?.isStarred && <IconStar />}
                last accessed by you • {node?.timeText}
              </Text>

            </View>
          </View>
        </View>

        <Pressable hitSlop={10} onPress={OnDotsPress}
          style={({ pressed }) => [styles.dotsBtn, pressed && styles.dotsHitPressed]}
        >
          <Text style={styles.dotsText}>⋮</Text>
        </Pressable>
      </Pressable>

      <NodeDots
        visible={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        node={node}
        onNodeUpdate={setNode}
        onListUpdate={onListUpdate}
        theme={theme}
      />
    </View>

  );
}

function IconSvg({ Svg, color }) {
  return (
    <View style={{ width: 24, height: 15, alignItems: "center", justifyContent: "center" }}>
      <Svg width={12} height={12} fill={color} />
    </View>
  );
}
function IconStar({ color = "#90D5FF" }) {
  return <IconSvg Svg={StarSvg} color={color} />;
}