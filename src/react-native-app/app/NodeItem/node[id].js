// app/node/[id].jsx
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { getTheme } from "../../styles/Theme";
import { createStyles } from "../../styles/nodeHeader.styles";

export default function NodeHeaderScreen() {
  const { id } = useLocalSearchParams(); // id from route: /node/:id
  const scheme = useColorScheme();
  const theme = useMemo(() => getTheme("dark"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [node, setNode] = useState(null);

  useEffect(() => {
    async function load() {
      // TODO: call your server here (assume it works)
      // const res = await fetchNodeById(id);
      // setNode(res);

      // Placeholder example shape (remove when real fetch is wired):
      setNode({
        id,
        name: "A",
        type: "FOLDER", // or "FOLDER"
        subtitle: "You opened",
        timeText: "15:20",
      });
    }

    load();
  }, [id]);

  function OnItemPress(_node) {
    // TODO: implement
  }

  function OnDotsPress(_node) {
    // TODO: implement
  }

  const iconSource = useMemo(() => {
    const isDark = scheme === "dark";
    const type = node?.type;

    if (type === "FILE") {
      return isDark
        ? require("../../assets/fileDark.jpg")
        : require("../../assets/fileLight.jpg");
    }

    // default: folder
    return isDark
      ? require("../../assets/folderDark.jpg")
      : require("../../assets/folderLight.jpg");
  }, [node?.type, scheme]);

  if (!node) {
    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconWrap} />
            <View style={styles.textCol}>
              <View style={styles.skeletonLineLg} />
              <View style={styles.skeletonLineSm} />
            </View>
            <View style={styles.dotsHit} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.row}>
          {/* Left clickable item */}
          <Pressable
            style={({ pressed }) => [styles.leftHit, pressed && styles.leftHitPressed]}
            onPress={() => OnItemPress(node)}
            android_ripple={{ color: theme.colors.hover, borderless: false }}
          >
            <View style={styles.iconWrap}>
              <Image source={iconSource} style={styles.icon} resizeMode="contain" />
            </View>

            <View style={styles.textCol}>
              <Text style={styles.title} numberOfLines={1}>
                {node.name}
              </Text>

              <Text style={styles.subtitle} numberOfLines={1}>
                {node.subtitle}
                <Text style={styles.dotSep}>{"  •  "}</Text>
                {node.timeText}
              </Text>
            </View>
          </Pressable>

          {/* 3-dots */}
          <Pressable
            style={({ pressed }) => [styles.dotsHit, pressed && styles.dotsHitPressed]}
            onPress={() => OnDotsPress(node)}
            android_ripple={{ color: theme.colors.hover, borderless: true }}
            hitSlop={10}
          >
            <Text style={styles.dotsText}>⋮</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
