import { createContext, useContext, useMemo, useState } from "react";

const NodesContext = createContext(null);

export function NodesProvider({ children }) {
  const [nodes, setNodes] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(0); 

  const value = useMemo(
    () => ({ nodes, setNodes, currentFolder, setCurrentFolder }),
    [nodes, currentFolder]
  );

  return <NodesContext.Provider value={value}>{children}</NodesContext.Provider>;
}

export function useNodes() {
  const ctx = useContext(NodesContext);
  if (!ctx) throw new Error("useNodes must be used inside <NodesProvider>");
  return ctx;
}
