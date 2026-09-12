import React from "react";
import "./Navbar.css";

export default function Navbar({ onOpenUpload }) {
    return (
        <header className="navbar">
            {/* Logo & Subtitle */}
            <div className="navbar__brand">
                <span className="navbar__logo">VibeSync</span>
                <span className="navbar__subtitle">Mood-Adaptive Audio</span>
            </div>

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


