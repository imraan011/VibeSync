import React, { useState } from "react";
import "./TrackItem.css";

function PlayIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="track-item__play-icon"
            aria-hidden="true"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    );
}
function PauseIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="track-item__play-icon"
            aria-hidden="true"
        >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
        </svg>
    );
}

// Placeholder — onPlay baad me connect hoga audio player se
function TrackItem({ title, artist, audio }) {
    const [isPlaying, setisPlaying] = useState(false);

    const handlePlayPause = (idx) => {
        if (isPlaying) {
            setisPlaying(false);
        } else {
            setisPlaying(true);
        }
    };
    return (
        <li className="track-item">
            <div className="track-item__meta">
                <span className="track-item__title">{title}</span>
                <span className="track-item__artist">{artist}</span>
            </div>
            <div>
                <audio
                    key={isPlaying}
                    src={audio}
                    style={{ display: "none" }}
                    autoPlay={isPlaying}
                ></audio>

                <button
                    className="track-item__play-btn"
                    onClick={handlePlayPause}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
            </div>
        </li>
    );
}
export default TrackItem;
