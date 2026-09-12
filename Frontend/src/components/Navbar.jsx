import React from "react";
import { NAV_LINKS } from "../data/mockData";
import "./Navbar.css";

export default function Navbar({ activeTab = "live-space", onTabChange, onOpenUpload }) {
    return (
        <header className="navbar">
            {/* Logo & Subtitle */}
            <div className="navbar__brand" onClick={() => onTabChange && onTabChange("live-space")} style={{ cursor: "pointer" }}>
                <span className="navbar__logo">VibeSync</span>
                <span className="navbar__subtitle">Mood-Adaptive Audio</span>
            </div>

            {/* Center Navigation Tabs */}
            <nav className="navbar__tabs" aria-label="Main Navigation">
                {NAV_LINKS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`navbar__tab ${activeTab === tab.id ? "navbar__tab--active" : ""}`}
                        onClick={() => onTabChange && onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Right Status Indicator & Actions */}
            <div className="navbar__actions">
                {onOpenUpload && (
                    <button
                        type="button"
                        className="navbar__upload-btn"
                        onClick={onOpenUpload}
                        title="Upload New Song"
                    >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        <span>Upload Song</span>
                    </button>
                )}

               

                 
            </div>
        </header>
    );
}

