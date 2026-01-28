import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [scheme, setScheme] = useState("dark");
  const [searchValueFolder, setSearchValueFolder] = useState("");//when updated the list is updated too
  return (
    <ThemeContext.Provider value={{ scheme, setScheme, searchValueFolder, setSearchValueFolder }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx;
}

export function useSearchValueFolder() {
  const ctx = useContext(ThemeContext);
  return ctx;
}