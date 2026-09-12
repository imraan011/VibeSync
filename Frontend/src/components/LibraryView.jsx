import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import "./LibraryView.css";
import { MOOD_DISPLAY_MAP } from "../data/mockData";

const API_BASE_URL = "http://localhost:3000";
const PAGE_LIMIT = 20;

export default function LibraryView({ onOpenUpload }) {
    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [totalSongs, setTotalSongs] = useState(0);
    const [selectedMoodFilter, setSelectedMoodFilter] = useState("all");
    const observerRef = useRef(null);

    // Lazy load songs batch
    const fetchLibraryBatch = useCallback(async (pageNum, moodFilter, reset = false) => {
        try {
            setIsLoading(true);
            const moodQuery = moodFilter && moodFilter !== "all" ? `&mood=${moodFilter}` : "";
            const res = await axios.get(`${API_BASE_URL}/songs?page=${pageNum}&limit=${PAGE_LIMIT}${moodQuery}`);

            const newSongs = res.data.songs || [];
            setTotalSongs(res.data.total || 0);
            setHasMore(res.data.hasMore || false);

            if (reset) {
                setSongs(newSongs);
            } else {
                setSongs((prev) => [...prev, ...newSongs]);
            }
        } catch (err) {
            console.error("Library fetch error:", err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load and filter change
    useEffect(() => {
        setPage(1);
        fetchLibraryBatch(1, selectedMoodFilter, true);
    }, [selectedMoodFilter, fetchLibraryBatch]);

    // Intersection observer for automatic lazy loading on scroll
    const lastElementRef = useCallback(
        (node) => {
            if (isLoading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => {
                        const nextPage = prevPage + 1;
                        fetchLibraryBatch(nextPage, selectedMoodFilter, false);
                        return nextPage;
                    });
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [isLoading, hasMore, selectedMoodFilter, fetchLibraryBatch]
    );

    const moodFilterKeys = ["all", "happy", "neutral", "sad", "surprised", "angry", "fearful", "disgusted"];

    return (
        <section className="library-view" aria-label="Music Library Collection">
            {/* Header */}
            <div className="library-view__header">
                <div>
                    <h1 className="library-view__title">Music Library</h1>
                    <p className="library-view__subtitle">
                        Showing {songs.length} of {totalSongs} audio tracks in collection
                    </p>
                </div>

                {onOpenUpload && (
                    <button
                        type="button"
                        onClick={onOpenUpload}
                        className="library-filter-chip library-filter-chip--active"
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.45rem 1rem", cursor: "pointer" }}
                    >
                        <span>+</span> Upload Track
                    </button>
                )}

                {/* Mood Quick Filter Chips */}
                <div className="library-view__filters">

                    {moodFilterKeys.map((key) => {
                        const label = key === "all" ? "All Moods" : MOOD_DISPLAY_MAP[key]?.label || key;
                        const isSelected = selectedMoodFilter === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                className={`library-filter-chip ${isSelected ? "library-filter-chip--active" : ""}`}
                                onClick={() => setSelectedMoodFilter(key)}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Song Grid */}
            <div className="library-view__grid">
                {songs.map((song, idx) => {
                    const isLast = idx === songs.length - 1;
                    const moodMeta = MOOD_DISPLAY_MAP[song.mood] || {
                        label: song.mood || "General",
                        color: "#2dd4bf",
                    };

                    return (
                        <div
                            key={song._id || idx}
                            ref={isLast ? lastElementRef : null}
                            className="library-card"
                        >
                            {/* Artwork Box */}
                            <div className="library-card__art" style={{ background: `radial-gradient(circle, ${moodMeta.color}22 0%, #161824 100%)` }}>
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ color: moodMeta.color }}>
                                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                </svg>
                            </div>

                            {/* Details */}
                            <div className="library-card__details">
                                <h3 className="library-card__title" title={song.title}>
                                    {song.title}
                                </h3>
                                <p className="library-card__artist" title={song.artist}>
                                    {song.artist}
                                </p>
                            </div>

                            {/* Mood Tag */}
                            <div className="library-card__tag-wrap">
                                <span
                                    className="library-card__mood-tag"
                                    style={{
                                        color: moodMeta.color,
                                        borderColor: `${moodMeta.color}44`,
                                        backgroundColor: `${moodMeta.color}11`,
                                    }}
                                >
                                    ● {moodMeta.label.split(" ")[0]}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Loading / Pagination Indicator */}
            {isLoading && (
                <div className="library-view__loading">
                    <span className="library-view__spinner" />
                    <span>Lazy loading tracks from server...</span>
                </div>
            )}

            {!hasMore && songs.length > 0 && (
                <div className="library-view__footer">
                    <span>✓ All {totalSongs} library tracks loaded</span>
                </div>
            )}
        </section>
    );
}
