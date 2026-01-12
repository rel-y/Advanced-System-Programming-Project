import React, { useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useNodes } from "../nodeListContext.jsx";
import "./SidebarComponent.css";
import fetchFromWebServer from "../../api.js";

export default function Sidebar() {
  const { pathname } = useLocation();
  let { id } = useParams();          
  const { setNodes } = useNodes();     

  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState("home"); 

  const items = [
    { key: "home", label: "Home", suffix: "" },
    { key: "shared", label: "Shared with me", suffix: "/shared" },
    { key: "recent", label: "Recent", suffix: "/recent" },
    { key: "starred", label: "Starred", suffix: "/starred" },
    { key: "trash", label: "Trash", suffix: "/trash" },
    { key: "mydrive", label: "My Drive", suffix: "/mydrive" },
  ];

  async function filter(item) {
    setActiveKey(item.key);
    if( id === undefined ) {
        id = 0;
    }
    const url = `/api/folders/${id}${item.suffix}`;

    try {
      const res = await fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      console.log("Filter fetch data:", data);
      setNodes(Array.isArray(data) ? data : data.nodes ?? data.files ?? []);
    } catch (err) {
      console.error("Filter fetch failed:", err);
    }
  }

  async function createFile() {
    try {
      const resCreate = await fetchFromWebServer(`http://localhost:8080/api/files/`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Name...",
          type: "FILE",
          content: "content..."
        })

      });

      if (!resCreate.ok) throw new Error(`Request failed: ${resCreate.status}`);

      const data = await resCreate.json();
      console.log("Filter fetch data:", data);
      
      const newId = data[0].id; // i dont even know why this is an array
      console.log(newId);
      navigate(`/api/files/${newId}/edit`);

    } catch (err) {
      console.error("Filter fetch failed:", err);
    }
  }

  return (
    <aside className="sidebar">

      <button
        type="button"
        className="sidebar__newButton"
        onClick={createFile}
      >
        + New
      </button>

      <nav>
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            className={`sidebar__item ${activeKey === it.key ? "active" : ""}`}
            onClick={() => filter(it)}
          >
            {it.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
