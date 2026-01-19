// app/node/[id].jsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/nodeHeader.styles";
import NodeDots from "../components/NodeDots";
import fetchFromWebServer from "../api/api";
//on list update activates when the list needs a refresh i.e moved to trash... yea i think that is all the rest
//of the instances only the item needs a refresh like while staring
export default function NodeHeaderScreen({id, onListUpdate = ()=>{}}) {
  const scheme = useColorScheme();
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
      try{
      const url = `http://10.0.2.2:8080/api/files/${id}`;
      const res = await fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      console.log(res);
      const node = await res.json();
      console.log(node.lastAccess);

      node.subtitle = "you opened";
      node.timeText = formatDriveTime(node.lastAccess);
      setNode(node);
    }catch(e){
      console.error("error reciving node data:",e)
    }
    }

    load();
  }, [id]);

  function OnItemPress(node) {
    if(node?.type === "FILE"){
      //TO DO by who ever is doing the file edit
    } else {
      //TO DO by who ever is doing the list of nodes
    }
  }

  function OnDotsPress(_node) {
    setSelectedId(node?.id ?? String(id ?? ""));
    setIsSheetOpen(true);
  }

  const iconSource = useMemo(() => {
    const isDark = scheme === "dark";
    const type = node?.type;

    if (type === "FILE") {
      return isDark
        ? require("../assets/fileDark.jpg")
        : require("../assets/fileLight.jpg");
    }

    // default: folder
    return isDark
      ? require("../assets/folderDark.jpg")
      : require("../assets/folderLight.jpg");
  }, [node?.type, scheme]);

  // if (!node) {
  //   return (
  //     <View style={styles.screen}>
  //       <View style={styles.card}>
  //         <View style={styles.row}>
  //           <View style={styles.iconWrap} />
  //           <View style={styles.textCol}>
  //             <View style={styles.skeletonLineLg} />
  //             <View style={styles.skeletonLineSm} />
  //           </View>
  //           <View style={styles.dotsHit} />
  //         </View>
  //       </View>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.page}>
      <Pressable
        onPress={OnItemPress(node)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.leftHit}>
          <View style={styles.iconWrap}>
            <Image source={iconSource} style={styles.icon} resizeMode="contain" />
          </View>

          <View style={styles.textCol}>
            <Text numberOfLines={1} style={styles.title}>
              {node?.name ?? ""}
            </Text>
            <View style={styles.subtitle}>
            <Text numberOfLines={1} style={styles.subtitle}>
              {!node?.isStarred && <Text style={styles.star}>★ </Text>}
              You opened • {node?.timeText}
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