import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";
import { useRouter, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getTheme } from "../../styles/Theme";
import { makeFileEditStyles } from "../../styles/filePermissionEdit.styles";
import RenameDialog from "../../components/RenameDialog";
import { fetchFromWebServer } from "../../api/api";
import { SERVER_URL } from "../../config";
import { useTheme } from "../../scheme";
import DropDownPicker from "react-native-dropdown-picker";

export default function FileEditPage() {
  const { id } = useLocalSearchParams();
  const { scheme } = useTheme();
  const router = useRouter();

  const insets = useSafeAreaInsets();

  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => makeFileEditStyles(theme, insets), [theme, insets]);
  const [username, setUsername] = useState("");
  const [node, setNode] = useState(null);
  const [error, setError] = useState("");

  const [userPermissionsOpen, setUserPermissionsOpen] = useState(false);
  const [userPermissionsValue, setUserPermissionsValue] = useState("NON");
  const [userPermissionsItems, setUserPermissionsItems] = useState([
    { label: "None", value: "NON" },
    { label: "Viewer", value: "VIEWER" },
    { label: "Writer", value: "WRITER" },
    { label: "File Manager", value: "FILE_MANAGER" }
  ]);

  const [generalPermissionsOpen, setGeneralPermissionsOpen] = useState(false);
  const [generalPermissionsValue, setGeneralPermissionsValue] = useState(null);
  const [generalPermissionsItems, setGeneralPermissionsItems] = useState([
    { label: "None", value: "NON" },
    { label: "Viewer", value: "VIEWER" },
    { label: "Writer", value: "WRITER" },
  ]);

  const savePermissions = async () => {
    setError("");
    try {
      const response = await fetchFromWebServer(
        `${SERVER_URL}/api/files/${id}/permissions/${username}`,
        {
          method: "PATCH",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePermission: userPermissionsValue })
        }
      );

      if (!response.ok) {
        setError('Failed to update permissions');
      }
    } catch (err) {
      setError(`Server error while updating permissions ${err}`);
    }
  };
  const saveGeneralPermissions = async () => {
    setError('');

    try {
      const response = await fetchFromWebServer(
        `${SERVER_URL}/api/files/${id}/permissions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filePermission: generalPermissionsValue })
        }
      );

      if (!response.ok) {
        setError('Failed to update permissions');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while updating permissions');
    }

  };
  const saveAllPermissions = async () => {
    if (username && userPermissionsValue) {
      console.log(`changed ${username} permissions to ${userPermissionsValue}`);
      await savePermissions();
    }
    if (generalPermissionsValue) {
      console.log(`changed general permissions to ${generalPermissionsValue}`);
      await saveGeneralPermissions();
    }
  };
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
          console.error(res);
          return;
        }

        const data = await res.json();
        setNode(data)
        console.log(data);
      } catch (e) {
        console.error("Failed to load file:", e);
      }
    }
    load();
  }, [id, router]);

  async function onSubmit() {
    try {
      await saveAllPermissions()
      router.back();
    } catch (e) {
      console.error("Failed to submit:", e);
    }
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.page} edges={["top", "bottom"]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          >
            <Text style={styles.iconText}>✕</Text>
          </Pressable>
          <View
            style={styles.titleWrap}
          >
            <Text numberOfLines={1} style={styles.title}>
              {node?.name ?? ""}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <View style={styles.filedTitle}>
            <Text numberOfLines={1} style={styles.title}>
              Username
            </Text>
          </View>
          <TextInput value={username}
            onChangeText={(username) => { setUsername(username) }}
            style={[styles.input]}
            placeholder='Enter Username'
            placeholderTextColor={theme.colors["text-muted"]}
            autoCapitalize="none">
          </TextInput>

          <View style={styles.filedTitle}>
            <Text numberOfLines={1} style={styles.title}>
              User Permission
            </Text>
          </View>
          <View style={styles.userDropDown}>
            <DropDownPicker
              open={userPermissionsOpen}
              value={userPermissionsValue}
              items={userPermissionsItems}
              setOpen={setUserPermissionsOpen}
              setValue={setUserPermissionsValue}
              setItems={setUserPermissionsItems}
              onOpen={() => setGeneralPermissionsOpen(false)}
              onBlur={() => setUserPermissionsOpen(false)}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              textStyle={{ color: theme.colors.text }}
              labelStyle={{ color: theme.colors.text }}
              placeholderStyle={{ color: theme.colors["text-muted"] }}
              arrowIconStyle={{ tintColor: theme.colors.text }}
              tickIconStyle={{ tintColor: theme.colors.text }}
              listItemContainerStyle={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
            >
            </DropDownPicker>
          </View>
          <View style={styles.filedTitle}>
            <Text numberOfLines={1} style={styles.title}>
              general permissions
            </Text>
          </View>
          <View style={styles.generalDropDown}>
            <DropDownPicker
              open={generalPermissionsOpen}
              value={generalPermissionsValue}
              items={generalPermissionsItems}
              setOpen={setGeneralPermissionsOpen}
              setValue={setGeneralPermissionsValue}
              setItems={setGeneralPermissionsItems}
              onOpen={() => setUserPermissionsOpen(false)}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownMenu}
              textStyle={{ color: theme.colors.text }}
              labelStyle={{ color: theme.colors.text }}
              placeholderStyle={{ color: theme.colors["text-muted"] }}
              arrowIconStyle={{ tintColor: theme.colors.text }}
              tickIconStyle={{ tintColor: theme.colors.text }}
              listItemContainerStyle={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
            </DropDownPicker>
          </View>
          <View style={styles.submitBar}>
            <Pressable onPress={onSubmit} style={({ pressed }) => [styles.submitBtn, pressed && styles.submitPressed]}>
              <Text style={styles.submitText}>Submit</Text>
            </Pressable>
          </View>
          {error && <Text style={styles.submitText}>{error}</Text>}
        </View >
      </SafeAreaView >
    </>
  );
}
