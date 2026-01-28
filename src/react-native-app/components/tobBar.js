// components/TopBar.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import { useTheme } from "../scheme"; // adjust path if needed
import { getTheme } from "../styles/Theme"; // your Theme/getTheme file
import { createStyles } from "../styles/topBar.styles";
import { useRouter } from "expo-router";
import { fetchFromWebServer } from "../api/api";
import { SERVER_URL } from "../config";
// If you use react-native-svg-transformer, these imports work:
import SearchBarWithResults from "./searchBar";

export default function TopBar({ onListChange = (nodes) => { } }) {
  const router = useRouter();
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // placeholder user data
  const [user, setUser] = useState({
    name: "loading...",
    nickname: "loading...",
    photoUri: null,
  });

  // placeholder effect for user's picture
  useEffect(() => {
    const load = async () => {
      try {
        const url = `${SERVER_URL}/api/users/`;
        const res = await fetchFromWebServer(url, {
          method: "GET",
          headers: { Accept: "application/json", access: "false" },
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.username || "No Name",
            nickname: data.nickname || "No Nickname",
            photoUri: data.photo || null,
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    load();
  }, []);


  // empty functions (as requested)
  const onHamburgerPress = () => { };
  const onSearchPress = () => { };
  async function onLogout() {
    try {
      const url = `${SERVER_URL}/api/users/logout`;
      const res = await fetchFromWebServer(url, {
        method: "POST",
        headers: { Accept: "application/json", access: "false" },
      });
      if (res.ok) {
        // Redirect to login page

        router.replace("/(authentication)/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }
  return (
    <View>
      <View style={styles.bar}>
        {/* Hamburger */}
        <Pressable
          onPress={onHamburgerPress}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          hitSlop={10}
        >
          <View style={styles.hamburger}>
            <View style={styles.hLine} />
            <View style={styles.hLine} />
            <View style={styles.hLine} />
          </View>
        </Pressable>

        {/* Search */}
        <SearchBarWithResults onListChange={onListChange} />


        {/* User picture */}
        <Pressable
          onPress={() => setMenuOpen((v) => !v)}
          style={({ pressed }) => [styles.avatarWrap, pressed && styles.avatarPressed]}
          hitSlop={8}
        >
          {user.photoUri ? (
            <View style={styles.avatarCircle}>
              <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
            </View>
          ) : (
            <View style={styles.avatarPlaceholder} />
          )}
        </Pressable>
      </View>

      {/* Dropdown */}
      {menuOpen && (
        <View style={styles.menu}>
          <Text style={styles.menuLine}>
            <Text style={styles.menuLabel}>Name: </Text>
            <Text style={styles.menuValue}>{user.name}</Text>
          </Text>
          <Text style={styles.menuLine}>
            <Text style={styles.menuLabel}>Nickname: </Text>
            <Text style={styles.menuValue}>{user.nickname}</Text>
          </Text>

          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutPressed]}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
