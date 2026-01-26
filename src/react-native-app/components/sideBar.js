import React, { useEffect, useMemo, useState } from "react";
import { Switch, ScrollView, Modal, View, Text, Image, Pressable } from "react-native";
import { getTheme } from "../styles/Theme";
import { createStyles } from "../styles/sideBar.styles";
import { fetchFromWebServer } from "../api/api";
import { SERVER_URL } from "../config";
import TrashSvg from "../assets/icons/trash.svg";
import RecentSVG from "../assets/icons/clock.svg";
import LightSvg from "../assets/icons/sun.svg";
import DarkSVG from "../assets/icons/moon.svg";
import { useTheme } from "../scheme";

export default function SideBar({ visible, onClose = () => { console.log("hi") }, onTabUpdate = () => { } }) {
    const { scheme, setScheme } = useTheme();
    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [currentTab, setCurrentTab] = useState("home");
    const FOLDERNAMES = {
        "/trash": "bin",
        "/recent": "recent",
    };
    async function OnItemPress(item) {
        const url = `${SERVER_URL}/api/folders/0${item}`;
        const res = await fetchFromWebServer(url, {
            method: "GET",
            headers: { Accept: "application/json", access: "false" },
        });
        if (res.ok) {
            const data = await res.json();
            setCurrentTab(FOLDERNAMES[item]);
            onTabUpdate(FOLDERNAMES[item], data.filter(node => node?.id).map(node => node.id), false);
        } else
            console.error("failed fetching files")
    }

    const LightDarkSwitch = () => {
        const [isEnabled, setIsEnabled] = useState(scheme === "dark");
        //dark = true
        //light = false
        const toggleSwitch = () => {
            if (scheme === "dark") {
                setIsEnabled(false);
                setScheme("light");
            } else {
                setIsEnabled(true);
                setScheme("dark");
            }
        }

        return (
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#1a73e8" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        );
    }
    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.sheet}>
                <ScrollView>
                    <View style={styles.rowElement}>
                        <Pressable
                            onPress={() => OnItemPress("/recent")}
                            style={styles.tab}
                        >
                            <View style={[styles.iconPart, currentTab === "Recent" && styles.activeTab]}>
                                <IconRecent color={theme.colors.text} />
                            </View>
                            <Text style={styles.text} >Recent</Text>
                        </Pressable>
                    </View>

                    <View style={styles.rowElement}>
                        <Pressable
                            onPress={() => OnItemPress("/trash")}
                            style={styles.tab}
                        >
                            <View style={[styles.iconPart, currentTab === "trash" && styles.activeTab]}>
                                <IconTrash color={theme.colors.text} />
                            </View>
                            <Text style={styles.text} >Trash</Text>
                        </Pressable >
                    </View>

                    <View style={styles.rowElement}>
                        <View style={styles.tab}>
                            {scheme !== "dark" &&
                                <View style={styles.iconPart}>
                                    <IconLight color={theme.colors.text} />
                                </View>
                            }
                            {scheme === "dark" &&
                                <View style={styles.iconPart}>
                                    <IconDark color={theme.colors.text} />
                                </View>}
                            <Text style={[styles.text, { textTransform: "capitalize" }]} >{scheme} mode</Text>
                            <LightDarkSwitch />
                        </View>
                    </View>
                </ScrollView >
            </View >

        </Modal >
    );
}

function IconSvg({ Svg, color }) {
    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Svg fill={color} />
        </View>
    );
}
function IconRecent({ color }) {
    return <IconSvg Svg={RecentSVG} color={color} />;
}
function IconTrash({ color }) {
    return <IconSvg Svg={TrashSvg} color={color} />;
}
function IconLight({ color }) {
    return <IconSvg Svg={LightSvg} color={color} />;
}
function IconDark({ color }) {
    return <IconSvg Svg={DarkSVG} color={color} />;
}