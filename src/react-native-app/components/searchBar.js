// components/searchBarPreview.jsx
import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../scheme";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/SearchBar.styles";

export default function SearchBarPreview({ placeholder = "Search" }) {
  const router = useRouter();
  const { scheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={() => router.push("/(search)/search")}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <Text style={styles.text} numberOfLines={1}>
        {placeholder}
      </Text>
    </Pressable>
  );
}
