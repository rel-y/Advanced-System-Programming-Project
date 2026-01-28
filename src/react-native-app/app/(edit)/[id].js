// app/file/[id].jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { getTheme } from "../../styles/Theme";
import { makeFileEditStyles } from "../../styles/fileEdit.styles";
import RenameDialog from "../../components/RenameDialog";
import { fetchFromWebServer } from "../../api/api";
import { SERVER_URL } from "../../config";
import { useTheme } from "../../scheme";

export default function FileEditPage() {
  const { id } = useLocalSearchParams();
  const { scheme } = useTheme();
  const router = useRouter();

  // Keep using insets for internal padding (e.g., bottom bar, banner)
  const insets = useSafeAreaInsets();

  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => makeFileEditStyles(theme, insets), [theme, insets]);

  const [node, setNode] = useState(null);
  const [content, setContent] = useState("");
  const [renameOpen, setRenameOpen] = useState(false);

  // status banner
  const [status, setStatus] = useState(null); // { type: "success"|"error", text: string }
  const bannerY = useRef(new Animated.Value(-50)).current;
  const hideTimer = useRef(null);

  function showBanner(type, text) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setStatus({ type, text });
    Animated.timing(bannerY, { toValue: 0, duration: 180, useNativeDriver: true }).start();

    hideTimer.current = setTimeout(() => {
      Animated.timing(bannerY, { toValue: -50, duration: 180, useNativeDriver: true }).start(() => {
        setStatus(null);
      });
    }, 2200);
  }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchFromWebServer(`${SERVER_URL}/api/files/${id}`, {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });

        if (!res.ok) {
          const data = await res.json();
          if (data.error === "user has no read permissions for this file/folder") {
            router.replace("/(authentication)/login");
            return;
          }
          console.error("unknown error");
          setNode({ id: "0", name: "error", data: "error" });
          setContent("error");
          console.error(res);
          return;
        }

        const data = await res.json();
        setNode(data);
        setContent(data.content ?? "");
      } catch (e) {
        console.error("Failed to load file:", e);
      }
    }
    load();
  }, [id, router]);

  async function onSubmit() {
    try {
      let contentToSubmit = content === "" ? " " : content;

      const res = await fetchFromWebServer(`${SERVER_URL}/api/files/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ data: contentToSubmit }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showBanner("success", "File updated successfully");
    } catch (e) {
      console.error("Failed to submit:", e);
      showBanner("error", "Error while saving changes");
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* SafeAreaView should be the outer layout container */}
      <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            {/* Status banner */}
            {status && (
              <Animated.View
                style={[
                  styles.banner,
                  status.type === "success" ? styles.bannerSuccess : styles.bannerError,
                  { transform: [{ translateY: bannerY }] },
                ]}
              >
                <Text style={styles.bannerText}>{status.text}</Text>
              </Animated.View>
            )}

            {/* Top bar */}
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                hitSlop={10}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              >
                <Text style={styles.iconText}>✕</Text>
              </Pressable>

              {/* Name -> opens RenameDialog */}
              <Pressable
                onPress={() => node && setRenameOpen(true)}
                style={({ pressed }) => [styles.titleWrap, pressed && styles.pressed]}
              >
                <Text numberOfLines={1} style={styles.title}>
                  {node?.name ?? ""}
                </Text>
              </Pressable>
            </View>

            {/* Editor */}
            <View style={styles.editorWrap}>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Start typing..."
                placeholderTextColor={theme.colors["text-muted"]}
                style={styles.editor}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* Bottom bar */}
            <View style={styles.bottomBar}>
              <Pressable onPress={onSubmit} style={({ pressed }) => [styles.submitBtn, pressed && styles.submitPressed]}>
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>
            </View>

            <RenameDialog visible={renameOpen} onClose={() => setRenameOpen(false)} node={node} onNodeUpdate={setNode} />
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  );
}
