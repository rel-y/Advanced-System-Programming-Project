// NodeListScreen.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, View } from "react-native";
import { useRouter } from "expo-router";

import { createStyles } from "../../styles/itemList.styles";
import { useTheme } from "../../scheme";
import { getTheme } from "../../styles/Theme";
import NodeList from "../../components/itemList";

export default function MainPage() {
    const router = useRouter();
    const folderStackRef = useRef([]); // stack of older file ids
    const { scheme } = useTheme();

    const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [idList, setIdlist] = useState([]);

    const [page, setPage] = useState("home");

    function saveList(folder, ids, saveMemory = true) {
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
        <View style={{ flex: 1 }}>
            <NodeList ids={idList} page={page} SaveList={saveList} />
        </View>
    );
}
