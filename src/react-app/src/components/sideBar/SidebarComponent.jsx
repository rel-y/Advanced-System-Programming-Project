import { Link, useLocation } from "react-router-dom";
import React from "react";
import { useState } from "react";
import "./SidebarComponent.css";
const [nodes, setNodes] = useState([]);
const { id } = useParams(); // <-- folder id from URL

export default function Sidebar() {
  const { pathname } = useLocation();

const items = [
  { key: "home", label: "Home", suffix: "" },
  { key: "shared", label: "Shared with me", suffix: "/shared" },
  { key: "recent", label: "Recent", suffix: "/recent" },
  { key: "starred", label: "Starred", suffix: "/starred" },
  { key: "trash", label: "Trash", suffix: "/trash" },
  { key: "mydrive", label: "My Drive", suffix: "/mydrive" },
];


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
async function filter(item) {
    const url = `api/folders/${id}/${item.suffix}`;
    try{
     const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status}`);
    }

    const data = await res.json();

    // Save result in state
    setNodes(Array.isArray(data) ? data : data.nodes ?? data.files);
  } catch (err) {
    console.error("Filter fetch failed:", err);
  }
}

export { Sidebar, items };
