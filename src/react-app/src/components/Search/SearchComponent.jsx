import "./SearchComponent.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchFromWebServer from "../../api";
export default function SearchBar() {
  const navigate = useNavigate();
  //#region --- helpers ---
const getSearchResults = useCallback(async (query) => {
  const url = `/api/search/${encodeURIComponent(query)}`;
  console.log(url);
  try {
    const res = await fetchFromWebServer(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) throw new Error(`Request failed: ${res.status}`);

    const data = await res.json();
    console.log("Search fetch data:", data);
    return Array.isArray(data) ? data : data.nodes ?? data.files ?? [];
  } catch (err) {
    console.error("Search fetch failed:", err);
    return [];
  }
}, []);

function onPick(item) {
  if (item?.type?.toLowerCase().includes("folder")) {
    navigate(`/folder/${item.id}`);
  } else if (item?.type?.toLowerCase().includes("file")) {
    navigate(`/api/files/${item.id}`);
  }
}
//#endregion
  //#region --- visual styles ---

function formatType(t) {
  if (!t) return "";
  const s = String(t).toLowerCase();
  if (s.includes("folder")) return "Folder";
  if (s.includes("file")) return "File";
  return String(t);
}

function formatWhen(v) {
  if (!v) return "";

  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";

  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  return sameDay
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" });
}
//#endregion
  //#region state and refs
  const [q, setQ] = useState("");           // input text
  const [open, setOpen] = useState(false); // dropdown visibility
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);  // search results

  const wrapRef = useRef(null);             // used to detect outside clicks
  const reqId = useRef(0);                 // tracks latest request
  //#endregion
  //#region effects and handlers
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);
  function onKeyDown(e) {
    if (!open) return;
    else if (e.key === "Escape") {
      setOpen(false);
    }
  }
  /**
   * Debounced search on query change
   */
  useEffect(() => {
    const query = q.trim();

    if (!query) {
      setItems([]);
      setLoading(false);
      return;
    }

    const id = ++reqId.current;
    setLoading(true);

    const t = setTimeout(async () => {
      try {
        const res = await getSearchResults(query);
        if (reqId.current === id) {
          setItems(Array.isArray(res) ? res : []);
        }
      } catch {
        if (reqId.current === id) setItems([]);
      } finally {
        if (reqId.current === id) setLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [q, getSearchResults]);

  /**
   * Handle selecting a result
   */
  function pick(item) {
    setOpen(false);
    onPick(item);
  }
  //#endregion
  return (
    <div className="sb-wrap" ref={wrapRef}>
      {/* Search bar */}
      <div className="sb-bar">
        <span className="sb-icon">🔍</span>

        <input
          className="sb-input"
          value={q}
          placeholder="Search..."
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {q && (
          <button
            className="sb-clear"
            onClick={() => {
              setQ("");
              setItems([]);
              setOpen(false);
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && q.trim() !== "" && (
        <div className="sb-dropdown">
          {loading && <div className="sb-row sb-muted">Searching…</div>}

          {!loading && items.length === 0 && (
            <div className="sb-row sb-muted">No results</div>
          )}

          {!loading &&
            items.map((item) => (
              <button
                key={item.id}
                className="sb-row sb-item"
                onMouseDown={(e) => e.preventDefault()} // keep input focused
                onClick={() => pick(item)}
              >
                <div className="sb-left">
                  <div className="sb-title">{item.name}</div>
                  <div className="sb-sub">
                    {item.parentname ?? "My Drive"}
                    {item.isInTrash ? " • Trash" : ""}
                    {item.isStarred ? " • Starred" : ""}
                  </div>
                </div>

                <div className="sb-right">
                  <div className="sb-meta">
                    {formatWhen(item.lastAccess ?? item.createdAt)}
                  </div>
                  <div className="sb-meta">
                    {formatType(item.type)}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
