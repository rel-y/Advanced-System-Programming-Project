// NodeListScreen.jsx
import React, { use, useEffect, useMemo, useState } from "react";
import { View, FlatList, Text } from "react-native";
import Node from "./node";
import { createStyles } from "../styles/itemList.styles";
import { useTheme } from "../scheme";
import { getTheme } from "../styles/Theme";
import { fetchFromWebServer } from "../api/api";
import { SERVER_URL } from "../config";
/**
 * Props:
 *  - ids: array of node ids (string/number)
 */
export default function NodeList({ SaveIdList = () => { }, SaveNodeList = () => { }, page = "home", ids = [] }) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [name, setName] = useState("loading ...");
  const [idAndReason, setIdTORemove] = useState({ id: "", Reason: "" });//id to delete and the reason

  useEffect(() => {
    if (idAndReason.Reason === null || idAndReason.Reason === undefined) return;//no reason no responce still rerender
    if (idAndReason.Reason === "delete")
      SaveIdList(page, ids.filter(id => id !== idAndReason.id), false);
    if (idAndReason.Reason === "toTrash" && page !== "bin")
      SaveIdList(page, ids.filter(id => id !== idAndReason.id), false);
    if (idAndReason.Reason === "RemoveFromTrash" && page === "bin")
      SaveIdList(page, ids.filter(id => id !== idAndReason.id), false);
    if (idAndReason.Reason === "unstar" && page === "star")
      SaveIdList(page, ids.filter(id => id !== idAndReason.id), false);
  }, [idAndReason]);
  useEffect(() => {
    if(page == "0") return setName("home");
    if (page.length <= 20) return setName(page);//normal page (ids are at list 32 char long)
    else {setName("loading ...");
      console.log("fetching page name for id:", page);
    }
    try {
      const url = `${SERVER_URL}/api/files/${page}`;
      fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            if (data?.name) setName(data.name);
          });
        }
      });
    } catch (e) { console.log("error fetching page name:", e); }
  }, [page]);
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{name}</Text>
      <FlatList
        data={ids}
        keyExtractor={(id, idx) => String(id ?? idx)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item: id }) => <Node id={id} onListUpdate={setIdTORemove} onFolderUpdate={SaveNodeList} />}
      />
    </View>
  );
}
