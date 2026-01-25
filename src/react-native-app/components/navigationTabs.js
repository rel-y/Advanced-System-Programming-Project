import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/navigationTabs.styles";
import { fetchFromWebServer } from "../api/api";
import { SERVER_URL } from "../config";
import StarSvg from "../assets/icons/star.svg";
import { useTheme } from "../scheme";

export default function NavTabs({ onTabUpdate = () => { } }) {
    const { scheme, setScheme } = useTheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [currentTab, setCurrentTab] = useState("home");
    const FOLDERNAMES = {
        "/starred": "star",
        "/mydrive": "myDrive",
        "/shared": "shared"
    };
    async function OnItemPress(item) {
        const url = `${SERVER_URL}/api/folders/0${item}`;
        const res = await fetchFromWebServer(url, {
            method: "GET",
            headers: { Accept: "application/json", access: "false" },
        });
        if (res.ok) {
            const data = await res.json();
            setCurrentTab(FOLDERNAMES[item] ?? "home");
            onTabUpdate(FOLDERNAMES[item] ?? "home", data.filter(node => node?.id).map(node => node.id), false);
        } else
            console.error("failed fetching files")

    }

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <Pressable
                onPress={() => OnItemPress("")}
                style={[styles.tab, currentTab === "home" && styles.selectedTab]}
            >
                <Text style={styles.text} >home</Text>
            </Pressable>
            <Pressable
                onPress={() => OnItemPress("/starred")}
                style={[styles.tab, currentTab === "star" && styles.selectedTab]}
            >
                <Text style={styles.text} >Starred</Text>
            </Pressable>
            <Pressable
                onPress={() => OnItemPress("/shared")}
                style={[styles.tab, currentTab === "shared" && styles.selectedTab]}
            >
                <Text style={styles.text} >Shared</Text>
            </Pressable>
            <Pressable
                onPress={() => OnItemPress("/mydrive")}
                style={[styles.tab, currentTab === "myDrive" && styles.selectedTab]}
            >
                <Text style={styles.text} >Files</Text>
            </Pressable>

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
function IconStar({ color }) {
    return <IconSvg Svg={StarSvg} color={color} />;
}