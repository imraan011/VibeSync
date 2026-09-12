import React, { useEffect, useRef, useState } from "react";
import "./PlayerBar.css";
import { MOOD_DISPLAY_MAP } from "../data/mockData";

const MOOD_EMOJI_MAP = {
    happy: "😄",
    neutral: "😌",
    sad: "🌧️",
    surprised: "⚡",
    angry: "🔥",
    fearful: "🌌",
    disgusted: "🎸",
};

export default function PlayerBar({
    track,
    mood = "happy",
    isPlaying = false,
    onTogglePlay,
    onSongEnd,
}) {
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(80);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    const moodKey = track?.mood || mood || "happy";
    const moodMeta = MOOD_DISPLAY_MAP[moodKey] || { label: "Happy", color: "#f59e0b" };
    const moodEmoji = MOOD_EMOJI_MAP[moodKey] || "😄";

    // Play/Pause synchronization
    useEffect(() => {
        if (!audioRef.current || !track?.audio) return;
        if (isPlaying) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, track]);

    // Volume change
    const handleVolume = (val) => {
        setVolume(val);
        if (audioRef.current) audioRef.current.volume = val / 100;
    };

    // Toggle mute
    const handleToggleMute = () => {
        handleVolume(volume === 0 ? 80 : 0);
    };

    // Skip +/- 5s
    const handleSkip = (seconds) => {
        if (!audioRef.current) return;
        const newTime = Math.min(Math.max(0, audioRef.current.currentTime + seconds), duration || 1000);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    // Cycle playback speed
    const handleCycleSpeed = () => {
        const speeds = [1, 1.25, 1.5, 2, 0.75];
        const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
        setPlaybackSpeed(nextSpeed);
        if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    };

    const formatTime = (secs) => {
        if (isNaN(secs) || secs <= 0) return "0:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <footer className="player-bar" aria-label="Audio Playback Bar">
            {track?.audio && (
                <audio
                    ref={audioRef}
                    src={track.audio}
                    onTimeUpdate={() => {
                        if (audioRef.current) {
                            setCurrentTime(audioRef.current.currentTime);
                            setDuration(audioRef.current.duration || 0);
                        }
                    }}
                    onLoadedMetadata={() => {
                        if (audioRef.current) {
                            setDuration(audioRef.current.duration || 0);
                            audioRef.current.playbackRate = playbackSpeed;
                        }
                    }}
                    onEnded={onSongEnd}
                />
            )}

            <div className="player-bar__container">
                {/* Left: Track Information */}
                <div className="player-bar__left">
                    <div className="player-bar__art-wrap">
                        <div className="player-bar__art-box">
                            {track?.cover ? (
                                <img src={track.cover} alt="Cover" className="player-bar__art-img" />
                            ) : (
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ color: moodMeta.color }}>
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            )}
                        </div>
                        <div className="player-bar__emoji-badge" title={moodMeta.label}>
                            {moodEmoji}
                        </div>
                    </div>

                    <div className="player-bar__info">
                        <span className="player-bar__title" title={track?.title || "No Track Selected"}>
                            {track?.title || "No Track Selected"}
                        </span>
                        <div className="player-bar__mood-tag" style={{ color: moodMeta.color }}>
                            <span>{moodEmoji}</span>
                            <span>{moodMeta.label.split("&")[0].trim()}</span>
                        </div>
                    </div>
                </div>

                {/* Center: Controls + Timeline Slider */}
                <div className="player-bar__center">
                    <div className="player-bar__controls">
                        <button
                            type="button"
                            className="player-bar__skip-btn"
                            onClick={() => handleSkip(-5)}
                            title="Rewind 5 seconds"
                        >
                            <span className="skip-icon">↺</span>
                            <span className="skip-text">5s</span>
                        </button>

                        <button
                            type="button"
                            className="player-bar__play-main"
                            onClick={onTogglePlay}
                            title={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                    <rect x="6" y="5" width="3.5" height="14" rx="1" />
                                    <rect x="14.5" y="5" width="3.5" height="14" rx="1" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ transform: "translateX(1.5px)" }}>
                                    <polygon points="7 4 19 12 7 20 7 4" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            className="player-bar__skip-btn"
                            onClick={() => handleSkip(5)}
                            title="Forward 5 seconds"
                        >
                            <span className="skip-text">5s</span>
                            <span className="skip-icon">↻</span>
                        </button>
                    </div>

                    <div className="player-bar__timeline-row">
                        <span className="player-bar__time">{formatTime(currentTime)}</span>
                        <div className="player-bar__slider-wrap">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                step="0.1"
                                value={currentTime}
                                onChange={(e) => {
                                    const seekVal = Number(e.target.value);
                                    setCurrentTime(seekVal);
                                    if (audioRef.current) audioRef.current.currentTime = seekVal;
                                }}
                                className="player-bar__seek-slider"
                                aria-label="Audio Timeline Scrubber"
                                style={{
                                    background: `linear-gradient(to right, #eab308 0%, #eab308 ${progressPercent}%, rgba(15, 23, 42, 0.15) ${progressPercent}%, rgba(15, 23, 42, 0.15) 100%)`,
                                }}
                            />
                        </div>
                        <span className="player-bar__time">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Right: Speed & Volume */}
                <div className="player-bar__right">
                    <button
                        type="button"
                        className="player-bar__speed-btn"
                        onClick={handleCycleSpeed}
                        title="Change Playback Speed"
                    >
                        {playbackSpeed}x
                    </button>

                    <div className="player-bar__volume-box">
                        <button
                            type="button"
                            className="player-bar__vol-icon-btn"
                            onClick={handleToggleMute}
                            title={volume === 0 ? "Unmute" : "Mute"}
                        >
                            {volume === 0 ? (
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <line x1="23" y1="9" x2="17" y2="15" />
                                    <line x1="17" y1="9" x2="23" y2="15" />
                                </svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    {volume >= 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                                </svg>
                            )}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => handleVolume(Number(e.target.value))}
                            className="player-bar__vol-slider"
                            aria-label="Volume Slider"
                            style={{
                                background: `linear-gradient(to right, #eab308 0%, #eab308 ${volume}%, rgba(15, 23, 42, 0.15) ${volume}%, rgba(15, 23, 42, 0.15) 100%)`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
}

