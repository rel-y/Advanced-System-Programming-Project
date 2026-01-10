import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useNodes } from "./nodeListContext.jsx";
import "./SidebarComponent.css";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { id } = useParams();          
  const { setNodes } = useNodes();     

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

    const url = `/api/folders/${id}${item.suffix}`;

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setNodes(Array.isArray(data) ? data : data.nodes ?? data.files ?? []);
    } catch (err) {
      console.error("Filter fetch failed:", err);
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__header">Drive</div>

      <Link to="/files" className="sidebar__newLink">
        + New
      </Link>

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
