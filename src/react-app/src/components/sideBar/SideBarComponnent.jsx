import React from "react";
import { useNavigate } from 'react-router-dom';
import Element from "./Element"
import Sidebar from "Sidebar.jsx";

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        buttons={[
        //to do buttons 
          { label: "add", onClick: () => console.log("add") },
          { label: "home", onClick: () => console.log("home") },
          { label: "shared with me", onClick: () => console.log("shared with me") },
          { label: "recent", onClick: () => console.log("recent") },
          { label: "starred", onClick: () => console.log("starred") },
          { label: "trash", onClick: () => console.log("trash") },
        ]}
        //replace functions with side bar buttons functionality
      />
      <main style={{ padding: "20px" }}>Content</main>
    </div>
  );
}
