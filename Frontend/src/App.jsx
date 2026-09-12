import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import Navbar from "./components/Navbar";
import CameraFeed from "./components/CameraFeed";
import NowPlayingDisk from "./components/NowPlayingDisk";
import PlayerBar from "./components/PlayerBar";
import UploadModal from "./components/UploadModal";

const API_BASE_URL = "http://localhost:3000";

export default function App() {
    const videoRef = useRef(null);

    // Sirf core essentials state rakhi hai
    const [mood, setMood] = useState("neutral");
    const [matchScore, setMatchScore] = useState(92);
    const [activeTrack, setActiveTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Mood ke hisaab se agla gaana fetch & play karo (exclude current track if available)
    const loadSong = async (targetMood = mood, shouldPlay = true, excludeId = null) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/songs?mood=${targetMood}`);
            const list = res.data.songs || [];
            if (list.length > 0) {
                const pool = excludeId ? list.filter((t) => (t._id || t.id) !== excludeId) : list;
                const finalPool = pool.length > 0 ? pool : list;
                const random = finalPool[Math.floor(Math.random() * finalPool.length)];
                setActiveTrack(random);
                if (shouldPlay) setIsPlaying(true);
            }
        } catch (err) {
            console.error("Song fetch error:", err.message);
        }
    };

    // Face detection scan trigger (agar face na mile to same mood ka agla gaana play karo)
    const handleScanFace = async () => {
        const currentId = activeTrack?._id || activeTrack?.id;
        const video = videoRef.current;

        if (video && video.readyState >= 2 && video.videoWidth > 0) {
            try {
                const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.25 });
                const detection = await faceapi.detectSingleFace(video, options).withFaceExpressions();

                if (detection) {
                    const expressions = detection.expressions;
                    let dominant = "neutral";
                    let maxScore = 0;
                    for (const [exp, score] of Object.entries(expressions)) {
                        if (score > maxScore) {
                            maxScore = score;
                            dominant = exp;
                        }
                    }

                    setMood(dominant);
                    setMatchScore(Math.round(maxScore * 100));
                    loadSong(dominant, true, currentId);
                    return;
                }
            } catch (err) {
                console.warn("Scan error:", err);
            }
        }

        // Face detect na hone par ya error aane par same mood ka agla gaana continue karo
        loadSong(mood, true, currentId);
    };

    // Initial models load and start default playback
    useEffect(() => {
        const initApp = async () => {
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
                await faceapi.nets.faceExpressionNet.loadFromUri("/models");
            } catch (err) {
                console.warn("Models load error:", err);
            }
            loadSong("neutral", true);
        };
        initApp();
    }, []);

    return (
        <div className="app-container">
            <Navbar onOpenUpload={() => setIsUploadOpen(true)} />

            <main className="main-content">
                {/* Left: Camera Feed */}
                <div className="left-panel">
                    <CameraFeed videoRef={videoRef} onScan={handleScanFace} />
                </div>

                {/* Right: Vinyl Disc & Mood Display */}
                <div className="right-panel">
                    <NowPlayingDisk
                        track={activeTrack}
                        mood={mood}
                        matchScore={matchScore}
                        isPlaying={isPlaying}
                    />
                </div>
            </main>

            {/* Bottom Audio Controller */}
            <PlayerBar
                track={activeTrack}
                mood={mood}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onSongEnd={handleScanFace}
            />

            {/* Song Upload Modal */}
            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={(newSong) => {
                    if (newSong?.mood === mood) {
                        setActiveTrack(newSong);
                        setIsPlaying(true);
                    }
                }}
            />
        </div>
    );
}

