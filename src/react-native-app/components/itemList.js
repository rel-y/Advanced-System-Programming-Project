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
export default function NodeList({ SaveList = () => { }, page = "home", ids = ["dba130f5ec2a6ca4c03fb3d3b8b48820", "85112fb27209bfa1bb2e52f30e592ab0", "98a5dbd43b2197d0dc5b4554a5757247", "92a9d9d53eaf4d887b542f0e443d073e", "4d334f4767991c19c8515bd28c52b948", "ea18f60adea9e3a32b5fa4a095b3f04c", "15991964f09df519cac3a1e5b5ff056a", "88d4fec4c719eea6b3989c3d462c54c2", "33c6ea82dae767a9068ab7486bb70d6a", "996d6dc33ee2ed9d4de5f4b5ca945ab1", "22871fa6dcb8bd83d44b2ba30919557e"] }) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [idAndReason, setIdTORemove] = useState({ id: "", Reason: "" });//id to delete and the reason

  useEffect(() => {
    if (idAndReason.Reason === null || idAndReason.Reason === undefined) return;//no reason no responce still rerender
    if (idAndReason.Reason === "delete")
      SaveList(page, ids.filter(id => id !== idAndReason.id), false);
    if (idAndReason.Reason === "toTrash" && page !== "bin")
      SaveList(page, ids.filter(id => id !== idAndReason.id), false);
    if (idAndReason.Reason === "RemoveFromTrash" && page === "bin")
      SaveList(page, ids.filter(id => id !== idAndReason.id), false);
    if (idAndReason.Reason === "unstar" && page === "star")
      SaveList(page, ids.filter(id => id !== idAndReason.id), false);
  }, [idAndReason]);
  return (
    <View style={styles.page}>
      <FlatList
        data={ids}
        keyExtractor={(id, idx) => String(id ?? idx)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item: id }) => <Node id={id} onListUpdate={setIdTORemove} onFolderUpdate={SaveList} />}
      />
    </View>
  );
}
