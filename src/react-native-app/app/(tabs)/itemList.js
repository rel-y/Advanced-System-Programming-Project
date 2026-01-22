// NodeListScreen.jsx
import React, { useEffect, useMemo, useState } from "react";
import { View, FlatList } from "react-native";
import Node from "../../components/node";
import { createStyles } from "../../styles/itemList.styles";
import { useTheme } from "../../scheme";
import { getTheme } from "../../styles/Theme";

/**
 * Props:
 *  - ids: array of node ids (string/number)
 */
export default function NodeListScreen({ ids = ["9bb9a4dede7c57ccaaa06a606b9eda57","277f5c229dcb54dc2ad765c08adf2be6","35da5cebef1254c735bf587e35f6bd19",
    "fecdfb607c2041de86b17c1959de40c7","263cfe1d5fedac02afc191f3e17f1adb","3bdf7ad2128f6b0b74f24857ee334cee"], page="home"}) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [idList, setIdlist] = useState(ids);
  const [idAndReason, setIdTORemove] = useState({id:"", Reason:""});//id to delete and the reason
  useEffect(() => {
    if(idAndReason.Reason === null || idAndReason.Reason === undefined) return;//no reason no responce
    if(idAndReason.Reason === "delete")
        setIdlist(prev =>
            prev.filter(idL => idL !== idAndReason.id)
        );
    if(idAndReason.Reason === "toTrash" && page !== "bin")
        setIdlist(prev =>
            prev.filter(idL => idL !== idAndReason.id)
        );
    if(idAndReason.Reason === "RemoveFromTrash" && page === "bin")
        setIdlist(prev =>
            prev.filter(idL => idL !== idAndReason.id)
        );
    if(idAndReason.Reason === "unstar" && page === "star")
        setIdlist(prev =>
            prev.filter(idL => idL !== idAndReason.id)
        );
}, [idAndReason]);
   return (
    <View style={styles.page}>
      <FlatList
        data={idList}
        keyExtractor={(id, idx) => String(id ?? idx)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item: id }) => <Node id={id} onListUpdate={setIdTORemove}/>}
      />
    </View>
  );
}
