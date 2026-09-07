import React from "react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <span className="navbar__icon" aria-hidden="true">◼</span>
        <span className="navbar__title">VibeSync</span>
      </div>
    </nav>
  );
}
