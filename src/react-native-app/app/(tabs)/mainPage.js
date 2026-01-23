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

    const [idList, setIdlist] = useState(["dfce4b0f3f3ff854e6167523b63bd7fd", "e3afae6d8074b976ddc70c651f7265a4", "6e0a93c58957906679df19f30e4b0c25", "956a5a9f14d66cc346313ddba5e20ca3", "2e6f6806582e0ae84d948a740dca469d", "ec3c4cead7939b4af2800433ee796f80", "6e427941a6df938f56fa19ad4ba59a71", "f75c31651afe45e94209bae279cb8380", "4e4080c765c1b66dce579ab35383a8e9", "bf67f003cffb3ec12ec1c1f5f7347e12", "12b46cdfb5311d9cda349231314f5c1a"]);

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
