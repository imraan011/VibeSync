import React from "react";
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

// Placeholder — onPlay baad me connect hoga audio player se
export default function TrackItem({ title, artist }) {
  return (
    <li className="track-item">
      <div className="track-item__meta">
        <span className="track-item__title">{title}</span>
        <span className="track-item__artist">{artist}</span>
      </div>
      <button
        className="track-item__play-btn"
        aria-label={`Play ${title} by ${artist}`}
      >
        <PlayIcon />
      </button>
    </li>
  );
}
