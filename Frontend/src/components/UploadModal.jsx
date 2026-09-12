import React, { useState } from "react";
import axios from "axios";
import "./UploadModal.css";
import { MOOD_DISPLAY_MAP } from "../data/mockData";

const API_BASE_URL = "http://localhost:3000";

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [mood, setMood] = useState("happy");
    const [audioFile, setAudioFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    if (!isOpen) return null;

    // Audio file select hone par auto-fill title
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAudioFile(file);
            setErrorMessage("");
            // Agar title khali hai to file name se auto extract karo
            if (!title) {
                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                setTitle(cleanName);
            }
        }
    };

    // Upload submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile) {
            setErrorMessage("Kripya audio file (.mp3) select karein");
            return;
        }
        if (!title.trim()) {
            setErrorMessage("Song title daalna zaroori hai");
            return;
        }

        try {
            setIsUploading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const formData = new FormData();
            formData.append("audio", audioFile);
            formData.append("title", title.trim());
            formData.append("artist", artist.trim() || "Independent Artist");
            formData.append("mood", mood);

            const res = await axios.post(`${API_BASE_URL}/songs`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccessMessage("Song successfully upload ho gaya!");
            if (onUploadSuccess) {
                onUploadSuccess(res.data.song);
            }

            // 1.2s baad modal close karo
            setTimeout(() => {
                setTitle("");
                setArtist("");
                setAudioFile(null);
                setSuccessMessage("");
                onClose();
            }, 1200);
        } catch (err) {
            setErrorMessage(err.response?.data?.error || err.message || "Upload me error aaya");
        } finally {
            setIsUploading(false);
        }
    };

    const moodList = Object.keys(MOOD_DISPLAY_MAP);

    return (
        <div className="upload-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="upload-modal__header">
                    <div className="upload-modal__title-box">
                        <span className="upload-modal__icon">🎵</span>
                        <h2>Upload New Song</h2>
                    </div>
                    <button
                        type="button"
                        className="upload-modal__close-btn"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="upload-modal__form">
                    {/* Audio File Input */}
                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Audio Track (MP3 / WAV)</label>
                        <div className="upload-modal__file-drop">
                            <input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                id="audio-file-input"
                                className="upload-modal__file-input"
                                disabled={isUploading}
                            />
                            <label htmlFor="audio-file-input" className="upload-modal__file-label">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>{audioFile ? audioFile.name : "Click to choose audio file"}</span>
                                {audioFile && (
                                    <span className="upload-modal__file-size">
                                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Song Title</label>
                        <input
                            type="text"
                            placeholder="e.g., Midnight City Lights"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="upload-modal__input"
                            required
                            disabled={isUploading}
                        />
                    </div>

                    {/* Artist */}
                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Artist / Creator</label>
                        <input
                            type="text"
                            placeholder="e.g., Synthwave Collective"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            className="upload-modal__input"
                            disabled={isUploading}
                        />
                    </div>

                    {/* Mood Selector */}
                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Associated Emotion / Vibe</label>
                        <div className="upload-modal__mood-grid">
                            {moodList.map((m) => {
                                const meta = MOOD_DISPLAY_MAP[m];
                                const isSelected = mood === m;
                                return (
                                    <button
                                        type="button"
                                        key={m}
                                        className={`upload-modal__mood-btn ${isSelected ? "upload-modal__mood-btn--active" : ""}`}
                                        style={{
                                            borderColor: isSelected ? meta.color : undefined,
                                            backgroundColor: isSelected ? `${meta.color}22` : undefined,
                                            color: isSelected ? meta.color : undefined,
                                        }}
                                        onClick={() => setMood(m)}
                                        disabled={isUploading}
                                    >
                                        ● {meta.label.split(" ")[0]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Feedback Messages */}
                    {errorMessage && <div className="upload-modal__error">{errorMessage}</div>}
                    {successMessage && <div className="upload-modal__success">{successMessage}</div>}

                    {/* Actions */}
                    <div className="upload-modal__actions">
                        <button
                            type="button"
                            className="upload-modal__cancel-btn"
                            onClick={onClose}
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="upload-modal__submit-btn"
                            disabled={isUploading || !audioFile}
                        >
                            {isUploading ? (
                                <span className="upload-modal__uploading-text">
                                    <span className="upload-modal__spinner" /> Uploading to Cloud...
                                </span>
                            ) : (
                                "Upload Song"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
