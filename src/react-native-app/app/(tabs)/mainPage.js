// NodeListScreen.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, View } from "react-native";
import { useRouter } from "expo-router";

import { createStyles } from "../../styles/itemList.styles";
import { useSearchValueFolder, useTheme } from "../../scheme";
import { getTheme } from "../../styles/Theme";
import NodeList from "../../components/itemList";
import { SERVER_URL } from "../../config";
import { fetchFromWebServer } from "../../api/api";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/tobBar";


export default function MainPage() {
    const router = useRouter();
    const folderStackRef = useRef([]); // stack of older file ids
    const { scheme } = useTheme();

    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [idList, setIdlist] = useState([]);
    const { searchValueFolder, setSearchValueFolder } = useSearchValueFolder("");//to be used by the TopBar
    useEffect(() => {
        let cancelled = false;

        async function load() {
            const url = `${SERVER_URL}/api/folders/0`;
            const res = await fetchFromWebServer(url, {
                method: "GET",
                headers: { Accept: "application/json", access: "false" },
            });

            if (!cancelled && res.ok) {
                const data = await res.json();
                const ids = data
                    .filter(node => node?.id && !node?.isInTrash)
                    .map(node => node.id);

                setIdlist(ids);
            }
        }

        load();

        return () => { cancelled = true; };
    }, []);
    useEffect(() => {
        if(searchValueFolder==="" || searchValueFolder === undefined) return;
        console.log("searchValueFolder changed:", searchValueFolder);
        async function update() {
            const url = `${SERVER_URL}/api/folders/${searchValueFolder}`;
            const res = await fetchFromWebServer(url, {
                method: "GET",
                headers: { Accept: "application/json", access: "false" },
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                saveNodeList(searchValueFolder,data);
            } else
                console.error("failed fetching children")
        }
        update()
    }, [searchValueFolder]);


    const [page, setPage] = useState("home");

    function saveNodeList(folder, nodes, saveMemory = true) {
        if (saveMemory) {
            folderStackRef.current.push({ ids: idList, folder: page });
        }
        let ids;
        ids = nodes.filter(node => node?.id && !node?.isInTrash)
            .map(node => node.id);
        if (page === "star")
            ids = nodes.filter(node => node?.id && node?.isStarred && !node?.isInTrash).map(node => node.id);
        else if (page !== "bin")
            ids = nodes.filter(node => node?.id && !node?.isInTrash).map(node => node.id);
        if (page === "bin")
            ids = nodes.filter(node => node?.id && node?.isInTrash).map(node => node.id);
        setIdlist(ids);
        setPage(folder);
    }
    function saveIdList(folder, ids, saveMemory = true) {//to be used by the tabs
        if (saveMemory) {
            folderStackRef.current.push({ ids: idList, folder: page });
        }
        setIdlist(ids);
        setPage(folder);
    }

    const goBackFolder = useCallback(() => {
        const stack = folderStackRef.current;
        if (stack.length > 0) {
            const prevPage = stack.pop();
            setIdlist(prevPage.ids);
            setPage(prevPage.folder);
            return true;
        }
        return false;
    }, []);

    useEffect(() => {
        const sub = BackHandler.addEventListener("hardwareBackPress", () => {
            const handled = goBackFolder();
            if (handled) return true;
            return false; // let router/system handle
        });
        return () => sub.remove();
    }, [goBackFolder]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: styles.page.backgroundColor }}>
                <View style={{ flex: 1 }}>
                    <View style={{ zIndex: 1000, elevation: 1000, position: "relative" }}>
                        <TopBar onListChange={(nodes) => saveNodeList(page, nodes)} />
                    </View>
                    <View style={{ flex: 1, zIndex: 0, elevation: 0, position: "relative" }}>
                        <NodeList ids={idList} page={page} SaveNodeList={saveNodeList} SaveIdList={saveIdList} />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}
