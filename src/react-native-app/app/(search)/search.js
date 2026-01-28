// app/search.jsx   (or app/search.js)
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTheme } from "../../scheme";
import { getTheme } from "../../styles/Theme";
import { createStyles } from "../../styles/Search.styles";
import { fetchFromWebServer } from "../../api/api";
import { SERVER_URL } from "../../config";
import { useSearchValueFolder } from "../../scheme";

async function searchOnServer(query) {
  try {
    const url = `${SERVER_URL}/api/search/${encodeURIComponent(query)}`;
    const res = await fetchFromWebServer(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error("error searching:", e);
  }
  return [];
}

export default function SearchScreen() {
  const router = useRouter();
  const { scheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);
const {searchValueFolder, setSearchValueFolder} = useSearchValueFolder();
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const reqSeq = useRef(0);

  useEffect(() => {
    const query = q.trim();
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const t = setTimeout(async () => {
      const mySeq = ++reqSeq.current;
      setLoading(true);
      try {
        const data = await searchOnServer(query);
        if (mySeq !== reqSeq.current) return;
        setResults(Array.isArray(data) ? data : []);
      } finally {
        if (mySeq === reqSeq.current) setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [q]);

  const onItemPress = (item) => {
    console.log(item);
    const folder = (item?.type === "FILE")? item?.parent:item?.id;
    console.log(folder);
    setSearchValueFolder(folder);
    router.back();
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.searchWrap}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search"
            placeholderTextColor={theme.colors["text-muted"]}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          {loading ? <ActivityIndicator /> : null}
        </View>
      </View>

      <View style={styles.listWrap}>
        <FlatList
          data={results}
          keyExtractor={(it) => String(it.id)}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onItemPress(item)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.type}>{String(item.type)}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            q.trim() && !loading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No results</Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}
