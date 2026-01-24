// NodeListScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList } from "react-native";
import Node from "./node";
import { createStyles } from "../styles/itemList.styles";
import { useTheme } from "../scheme";
import { getTheme } from "../styles/Theme";

/**
 * Props:
 *  - ids: array of node ids (string/number)
 */
export default function NodeList({SaveIdList = ()=>{}, SaveNodeList = () => { }, page = "home", ids = [] }) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);

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
  return (
    <View style={styles.page}>
      <FlatList
        data={ids}
        keyExtractor={(id, idx) => String(id ?? idx)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item: id }) => <Node id={id} onListUpdate={setIdTORemove} onFolderUpdate={(nodes) => SaveNodeList(page,nodes)} />}
      />
    </View>
  );
}
