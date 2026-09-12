import React from "react";
import "./NowPlayingDisk.css";
import { MOOD_DISPLAY_MAP } from "../data/mockData";

export default function NowPlayingDisk({
    activeTrack,
    activeMoodId = "neutral",
    matchScore = 92,
    isPlaying = false,
}) {
    const moodInfo = MOOD_DISPLAY_MAP[activeMoodId] || {
        label: activeMoodId.toUpperCase(),
        color: "#2dd4bf",
    };

    return (
        <section className="now-playing-panel" aria-label="Now Playing Track Display">
            {/* Top Header Badge */}
            <div className="now-playing-panel__header">
                <div
                    className="now-playing-panel__mood-badge"
                    style={{
                        borderColor: `${moodInfo.color}55`,
                        backgroundColor: `${moodInfo.color}12`,
                    }}
                >
                    <span
                        className="now-playing-panel__mood-dot"
                        style={{
                            backgroundColor: moodInfo.color,
                            boxShadow: `0 0 10px ${moodInfo.color}`
                        }}
                    />
                    <span className="now-playing-panel__mood-text">{moodInfo.label}</span>
                    <span className="now-playing-panel__match">{matchScore}% Match</span>
                </div>
            </div>

            {/* Centered Vinyl Disc Container */}
            <div className="now-playing-panel__disk-wrapper">
                <div className={`vinyl-record ${isPlaying ? "vinyl-record--spinning" : ""}`}>
                    {/* Concentric Groove Rings */}
                    <div className="vinyl-record__groove groove-1" />
                    <div className="vinyl-record__groove groove-2" />
                    <div className="vinyl-record__groove groove-3" />
                    <div className="vinyl-record__groove groove-4" />

                    {/* Center Album Art Label */}
                    <div className="vinyl-record__center">
                        <div
                            className="vinyl-record__art"
                            style={{
                                background: `radial-gradient(circle, ${moodInfo.color}33 0%, #161824 100%)`
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" style={{ color: moodInfo.color }}>
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        {/* Spindle hole */}
                        <div className="vinyl-record__hole" />
                    </div>
                </div>

                {/* Ambient Glow behind the Disc */}
                <div
                    className="now-playing-panel__ambient-glow"
                    style={{ background: `radial-gradient(circle, ${moodInfo.color}22 0%, transparent 70%)` }}
                />
            </div>

            {/* Song Meta Information */}
            <div className="now-playing-panel__meta">
                <h2 className="now-playing-panel__title">
                    {activeTrack?.title || "Listening for Facial Mood..."}
                </h2>
                <p className="now-playing-panel__artist">
                    {activeTrack?.artist || "Look at camera to curate music"}
                </p>

                {/* Animated Audio Equalizer Bars */}
                {isPlaying && (
                    <div className="now-playing-panel__equalizer" aria-hidden="true">
                        <span className="eq-bar bar-1" style={{ backgroundColor: moodInfo.color }} />
                        <span className="eq-bar bar-2" style={{ backgroundColor: moodInfo.color }} />
                        <span className="eq-bar bar-3" style={{ backgroundColor: moodInfo.color }} />
                        <span className="eq-bar bar-4" style={{ backgroundColor: moodInfo.color }} />
                        <span className="eq-bar bar-5" style={{ backgroundColor: moodInfo.color }} />
                    </div>
                )}
            </div>
        </section>
    );
}
