import React from "react";
import { useNavigate } from 'react-router-dom';
import Element from "./Element"
import "./Sidebar.css";

export default function Sidebar({ buttons = [] }) {
  return (
    <div className="sidebar">
      {buttons.map((btn, i) => (
        <button
          key={i}
          className="sidebar-button"
          onClick={btn.onClick}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
