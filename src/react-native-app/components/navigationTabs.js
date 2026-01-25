import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/navigationTabs.styles";
import { fetchFromWebServer } from "../api/api";
import { SERVER_URL } from "../config";
import StarSvg from "../assets/icons/star.svg";
import homeSVG from "../assets/icons/house-door.svg";
import UsersSvg from "../assets/icons/users.svg";
import FilesSvg from "../assets/icons/folder2.svg";
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
                <IconHome color={theme.colors.text} />
                <Text style={styles.text} >home</Text>
            </Pressable>
            <Pressable
                onPress={() => OnItemPress("/starred")}
                style={[styles.tab, currentTab === "star" && styles.selectedTab]}
            >
                <IconStar color={theme.colors.text} />
                <Text style={styles.text} >Starred</Text>
            </Pressable>
            <Pressable
                onPress={() => OnItemPress("/shared")}
                style={[styles.tab, currentTab === "shared" && styles.selectedTab]}
            >
                <IconShared color={theme.colors.text} />
                <Text style={styles.text} >Shared</Text>
            </Pressable>
            <Pressable
                onPress={() => OnItemPress("/mydrive")}
                style={[styles.tab, currentTab === "myDrive" && styles.selectedTab]}
            >
                <IconFiles color={theme.colors.text} />
                <Text style={styles.text} >Files</Text>
            </Pressable>

        </View>

    );
}

function IconSvg({ Svg, color }) {
    return (
        <View style={{alignItems: "center", justifyContent: "center" }}>
            <Svg  fill={color} />
        </View>
    );
}
function IconHome({ color }) {
    return <IconSvg Svg={homeSVG} color={color} />;
}
function IconStar({ color }) {
    return <IconSvg Svg={StarSvg} color={color} />;
}
function IconShared({ color }) {
    return <IconSvg Svg={UsersSvg} color={color} />;
}
function IconFiles({ color }) {
    return <IconSvg Svg={FilesSvg} color={color} />;
}