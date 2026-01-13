// TopBar.jsx
import "./TopBarComponent.css";
import SearchBar from "../Search/SearchComponent.jsx"; // adjust path to your project
import fetchFromWebServer from "../../api.js";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


export default function TopBar() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  async function logout() {
    const url = "/api/users/logout";
     try {
      const res = await fetchFromWebServer(url, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      navigate("/api/users/login");
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  }

  async function getProfilePictureUrl() {
    const url = "/api/users";
    try {
      const res = await fetchFromWebServer(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setImage(data.photo);
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  }

  useEffect(() => {
    getProfilePictureUrl();
  }, []);

  // close when clicking outside
  useEffect(() => {
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        <span className="topbar__title">Drive</span>
      </div>

      <div className="topbar__center">
        <SearchBar />
      </div>

      <div className="topbar__right" ref={menuRef}>
        <ThemeToggle />

        <button
          className="topbar__profileBtn"
          type="button"
          onClick={() => setOpen(o => !o)}
        >
          {image && <img src={image} alt="profile" />}
        </button>

        {open && (
          <div className="topbar__menu">
            <button onClick={logout} className="btn topbar__menuItem">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function ThemeToggle() {
  // minimal local toggle; wire to your app theme system if you already have one
  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <button className="topbar__toggle" type="button" onClick={toggleTheme}>
      Light / Dark
    </button>
  );
}
