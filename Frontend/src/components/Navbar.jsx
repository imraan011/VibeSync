import React from "react";
import { NAV_LINKS } from "../data/mockData";
import "./Navbar.css";

export default function Navbar({ activeTab = "live-space", onTabChange }) {
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
                <div className="navbar__status-badge">
                    <span className="navbar__status-dot" aria-hidden="true" />
                    <span>Reading your expression</span>
                </div>

                <button
                    type="button"
                    className="navbar__icon-btn"
                    title="Audio Equalizer & Settings"
                    aria-label="Settings"
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="21" x2="4" y2="14" />
                        <line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" />
                        <line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="1" y1="14" x2="7" y2="14" />
                        <line x1="9" y1="8" x2="15" y2="8" />
                        <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                </button>

                <div className="navbar__avatar" title="User Profile" aria-label="User Profile">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            </div>
        </header>
    );
}
