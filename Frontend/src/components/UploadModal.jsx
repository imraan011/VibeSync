import React, { useState } from "react";
import axios from "axios";
import "./UploadModal.css";
import { MOOD_DISPLAY_MAP } from "../data/mockData";

const API_BASE_URL = "http://localhost:3000";

export default function UploadModal({ isOpen, onClose, onSuccess }) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [mood, setMood] = useState("happy");
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

    if (!isOpen) return null;

    const handleAudio = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAudioFile(file);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
    };

    const handleCover = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!audioFile || !title.trim()) {
            setStatusMsg({ type: "error", text: "Audio file aur Title zaroori hai" });
            return;
        }

        try {
            setIsUploading(true);
            setStatusMsg({ type: "", text: "" });

            const data = new FormData();
            data.append("audio", audioFile);
            if (coverFile) data.append("cover", coverFile);
            data.append("title", title.trim());
            data.append("artist", artist.trim() || "Independent Artist");
            data.append("mood", mood);

            const res = await axios.post(`${API_BASE_URL}/songs`, data);
            setStatusMsg({ type: "success", text: "Song upload ho gaya!" });

            if (onSuccess) onSuccess(res.data.song);

            setTimeout(() => {
                setTitle("");
                setArtist("");
                setAudioFile(null);
                setCoverFile(null);
                setCoverPreview("");
                setStatusMsg({ type: "", text: "" });
                onClose();
            }, 1000);
        } catch (err) {
            setStatusMsg({ type: "error", text: err.response?.data?.error || "Upload failed" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload-modal-overlay" onClick={onClose} role="dialog">
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                <div className="upload-modal__header">
                    <div className="upload-modal__title-box">
                        <span className="upload-modal__icon">🎵</span>
                        <h2>Upload Song & Cover</h2>
                    </div>
                    <button type="button" className="upload-modal__close-btn" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="upload-modal__form">
                    <div className="upload-modal__files-row">
                        <div className="upload-modal__field upload-modal__field--flex">
                            <label className="upload-modal__label">1. Audio Track (MP3) *</label>
                            <div className="upload-modal__file-drop">
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleAudio}
                                    id="audio-input"
                                    className="upload-modal__file-input"
                                    disabled={isUploading}
                                />
                                <label htmlFor="audio-input" className="upload-modal__file-label">
                                    <span className="upload-modal__file-text">
                                        {audioFile ? audioFile.name : "Select Audio File"}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="upload-modal__field upload-modal__field--cover">
                            <label className="upload-modal__label">2. Cover Art</label>
                            {coverPreview ? (
                                <div className="upload-modal__cover-preview-box">
                                    <img src={coverPreview} alt="Cover Preview" className="upload-modal__cover-img" />
                                    <button
                                        type="button"
                                        onClick={() => { setCoverFile(null); setCoverPreview(""); }}
                                        className="upload-modal__remove-cover-btn"
                                    >✕</button>
                                </div>
                            ) : (
                                <div className="upload-modal__file-drop upload-modal__file-drop--cover">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCover}
                                        id="cover-input"
                                        className="upload-modal__file-input"
                                        disabled={isUploading}
                                    />
                                    <label htmlFor="cover-input" className="upload-modal__file-label">
                                        <span className="upload-modal__file-text">Choose Cover</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Song Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Tum Hi Ho"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="upload-modal__input"
                            required
                        />
                    </div>

                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Artist Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Arijit Singh"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            className="upload-modal__input"
                        />
                    </div>

                    <div className="upload-modal__field">
                        <label className="upload-modal__label">Emotion / Mood</label>
                        <div className="upload-modal__mood-grid">
                            {Object.keys(MOOD_DISPLAY_MAP).map((m) => {
                                const isSel = mood === m;
                                return (
                                    <button
                                        type="button"
                                        key={m}
                                        className={`upload-modal__mood-btn ${isSel ? "upload-modal__mood-btn--active" : ""}`}
                                        style={{ borderColor: isSel ? MOOD_DISPLAY_MAP[m].color : undefined }}
                                        onClick={() => setMood(m)}
                                    >
                                        ● {MOOD_DISPLAY_MAP[m].label.split(" ")[0]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {statusMsg.text && (
                        <div className={`upload-modal__${statusMsg.type === "error" ? "error" : "success"}`}>
                            {statusMsg.text}
                        </div>
                    )}

                    <div className="upload-modal__actions">
                        <button type="button" className="upload-modal__cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="upload-modal__submit-btn" disabled={isUploading || !audioFile}>
                            {isUploading ? "Uploading..." : "Upload Song"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

