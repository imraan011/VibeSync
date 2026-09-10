import React, { useEffect, useRef, useState } from "react";
import "./PlayerBar.css";

export default function PlayerBar({
    currentTrack,
    isPlaying = false,
    onTogglePlay,
    onSongEnd,
}) {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(75);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);

    // Audio play/pause sync
    useEffect(() => {
        if (!audioRef.current || !currentTrack?.audio) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, currentTrack]);

    // Volume change handler
    const handleVolumeChange = (newVol) => {
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol / 100;
        }
    };

    // Format seconds to mm:ss
    const formatTime = (secs) => {
        if (isNaN(secs) || secs === 0) return "00:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 40;

    return (
        <footer className="player-bar" aria-label="Audio Playback Bar">
            {/* Native Audio Element for Playback */}
            {currentTrack?.audio && (
                <audio
                    ref={audioRef}
                    src={currentTrack.audio}
                    onTimeUpdate={() => {
                        if (audioRef.current) {
                            setCurrentTime(audioRef.current.currentTime);
                            setDuration(audioRef.current.duration || 0);
                        }
                    }}
                    onEnded={onSongEnd}
                />
            )}

            {/* Top Accent Progress Line */}
            <div className="player-bar__progress-rail">
                <div
                    className="player-bar__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="player-bar__container">
                {/* Left: Track Information */}
                <div className="player-bar__left">
                    <div className="player-bar__art-box">
                        {currentTrack?.cover ? (
                            <img src={currentTrack.cover} alt="Cover" style={{ width: "100%", height: "100%", borderRadius: "8px", objectFit: "cover" }} />
                        ) : (
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        )}
                    </div>
                    <div className="player-bar__info">
                        <span className="player-bar__title">{currentTrack?.title || "No Track Selected"}</span>
                        <span className="player-bar__artist">{currentTrack?.artist || "Unknown Artist"}</span>
                    </div>
                </div>

                {/* Center: Controls & Time */}
                <div className="player-bar__center">
                    <div className="player-bar__controls">
                        <button
                            type="button"
                            className={`player-bar__btn ${isShuffle ? "player-bar__btn--active" : ""}`}
                            onClick={() => setIsShuffle(!isShuffle)}
                            title="Shuffle"
                            aria-label="Shuffle"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="16 3 21 3 21 8" />
                                <line x1="4" y1="20" x2="21" y2="3" />
                                <polyline points="21 16 21 21 16 21" />
                                <line x1="15" y1="15" x2="21" y2="21" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="player-bar__btn"
                            title="Previous Track"
                            aria-label="Previous Track"
                            onClick={onSongEnd}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <polygon points="19 20 9 12 19 4 19 20" />
                                <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2.5" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="player-bar__play-main"
                            onClick={onTogglePlay}
                            title={isPlaying ? "Pause" : "Play"}
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="#000000">
                                    <rect x="6" y="5" width="3.5" height="14" rx="1" />
                                    <rect x="14.5" y="5" width="3.5" height="14" rx="1" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="#000000" style={{ transform: "translateX(1px)" }}>
                                    <polygon points="7 4 19 12 7 20 7 4" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            className="player-bar__btn"
                            title="Next Track (Triggers Mood Scan)"
                            aria-label="Next Track"
                            onClick={onSongEnd}
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <polygon points="5 4 15 12 5 20 5 4" />
                                <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className={`player-bar__btn ${isRepeat ? "player-bar__btn--active" : ""}`}
                            onClick={() => setIsRepeat(!isRepeat)}
                            title="Repeat"
                            aria-label="Repeat"
                        >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="17 1 21 5 17 9" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <polyline points="7 23 3 19 7 15" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                            </svg>
                        </button>
                    </div>

                    <span className="player-bar__time">
                        {currentTrack?.audio && duration > 0
                            ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                            : `${currentTrack?.currentDuration || "03:24"} / ${currentTrack?.duration || currentTrack?.totalDuration || "08:12"}`}
                    </span>
                </div>

                {/* Right: Volume & Queue */}
                <div className="player-bar__right">
                    <div className="player-bar__volume-box">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolumeChange(Number(e.target.value))}
                            className="player-bar__volume-slider"
                            aria-label="Volume Slider"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}
