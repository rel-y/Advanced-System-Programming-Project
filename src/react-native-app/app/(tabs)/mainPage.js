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
import AddItemButton from "../../components/AddButton";


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
        if (searchValueFolder === "" || searchValueFolder === undefined) return;
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
                saveNodeList(searchValueFolder, data);
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
        setPage(folder);
        ids = nodes.filter(node => node?.id && !node?.isInTrash)
            .map(node => node.id);
        if (folder === "star")
            ids = nodes.filter(node => node?.id && node?.isStarred && !node?.isInTrash).map(node => node.id);
        else if (folder !== "bin")
            ids = nodes.filter(node => node?.id && !node?.isInTrash).map(node => node.id);
        if (folder === "bin")
            ids = nodes.filter(node => node?.id && node?.isInTrash).map(node => node.id);
        setIdlist(ids);
    }
    function saveIdList(folder, ids, saveMemory = true) {//to be used by the tabs
        if (saveMemory) {
            folderStackRef.current.push({ ids: idList, folder: page });
        }
        setIdlist(ids);
        setPage(folder);
    }
    function AddItem(node) {
        if (page === "star" || page === "bin" || page === "shared") return;//do not show new item in these pages
        setIdlist((prevIds) => [...prevIds, node.id]);
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
                    <TopBar onListChange={(nodes) => saveNodeList(page, nodes)} />
                    <View style={{ flex: 1, position: 'relative' }}>
                        <NodeList ids={idList} page={page} SaveNodeList={saveNodeList} SaveIdList={saveIdList} />
                        <AddItemButton page={page} AddNode={AddItem} />
                        {/*the is so that the button apears only on top of the list and not on top of the nav bar or other items */}
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}
