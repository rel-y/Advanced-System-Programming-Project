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
export default function NodeListScreen({ ids = ["56e95ad81802e038d2b777dcd68c8009","f8f4aabaa0e7a266806cad00b8210e53","a8f751c6a089fbcbe615cea54ef060b1","f34a935a126dc32736f280bf5a64b31a","f33805d6a982913089fe5123bca3b37f","65c4bd13ac1cc0257257760337200c96","4bc14f8ceb3fa6be5a5952c4abf86a34","72e856ef1a54841380381921777529f6","2f1ae4a920cf3a6766bea094a318cbf6","19870ea7280ea86ae5f4288f2e96cd18","964f62581df075f4f29a5edffbea3d24"], page="home"}) {
  const { scheme, setScheme } = useTheme();
  const theme = useMemo(() => getTheme(scheme === "dark" ? "dark" : "light"), [scheme]);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [idList, setIdlist] = useState(ids);
  const [idAndReason, setIdTORemove] = useState({id:"", Reason:""});//id to delete and the reason
  useEffect(() => {
    if(idAndReason.Reason === null || idAndReason.Reason === undefined) return;//no reason no responce still rerender
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
        renderItem={({ item: id }) => <Node id={id} onListUpdate={setIdTORemove} onFolderUpdate={setIdlist}/>}
      />
    </View>
  );
}
