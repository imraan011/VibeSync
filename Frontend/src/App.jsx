import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import * as faceapi from "face-api.js";
import Navbar from "./components/Navbar";
import CameraFeed from "./components/CameraFeed";
import NowPlayingDisk from "./components/NowPlayingDisk";
import LibraryView from "./components/LibraryView";
import PlayerBar from "./components/PlayerBar";
import UploadModal from "./components/UploadModal";
import { MOOD_DISPLAY_MAP } from "./data/mockData";

const API_BASE_URL = "http://localhost:3000";

export default function App() {
    const videoRef = useRef(null);
    const hasInitialScannedRef = useRef(false);

    const [activeTab, setActiveTab] = useState("live-space");
    const [activeMoodId, setActiveMoodId] = useState("neutral");
    const [currentMoodLabel, setCurrentMoodLabel] = useState("Calm & Centered");
    const [matchScore, setMatchScore] = useState(92);
    const [tracks, setTracks] = useState([]);
    const [activeTrack, setActiveTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Random track selector helper
    const pickRandomTrack = (list, excludeId) => {
        if (!list || list.length === 0) return null;
        const pool = list.filter((t) => (t._id || t.id) !== excludeId);
        if (pool.length === 0) return list[0];
        return pool[Math.floor(Math.random() * pool.length)];
    };

    // MongoDB se songs fetch karo aur auto-play trigger karo
    const fetchSongsByMood = useCallback(async (mood, autoPlay = true) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/songs?mood=${mood}`);
            const fetched = res.data.songs || [];
            setTracks(fetched);

            if (fetched.length > 0 && autoPlay) {
                const randomTrack = pickRandomTrack(fetched, null);
                setActiveTrack(randomTrack);
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Backend fetch error:", err.message);
        }
    }, []);

    // FaceAPI models load karo initial render par
    useEffect(() => {
        const loadModelsAndInit = async () => {
            try {
                const MODEL_URL = "/models";
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
                setIsModelsLoaded(true);
            } catch (err) {
                console.warn("FaceAPI models load failed:", err);
            }
        };
        loadModelsAndInit();
        fetchSongsByMood("neutral", false);
    }, [fetchSongsByMood]);

    /**
     * Executes single face detection scan from camera stream
     */
    const detectFace = useCallback(async () => {
        if (!videoRef.current || !isModelsLoaded) return null;
        const video = videoRef.current;

        if (video.readyState < 2 || video.paused || video.ended || video.videoWidth === 0) {
            return null;
        }

        try {
            setIsScanning(true);
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.25 });
            const detections = await faceapi
                .detectAllFaces(video, options)
                .withFaceExpressions();

            if (!detections || detections.length === 0) return null;

            const primaryFace = detections.reduce((prev, curr) => {
                const prevArea = prev.box.width * prev.box.height;
                const currArea = curr.box.width * curr.box.height;
                return currArea > prevArea ? curr : prev;
            });

            let maxScore = 0;
            let dominant = null;
            for (const [exp, score] of Object.entries(primaryFace.expressions)) {
                if (score > maxScore) {
                    maxScore = score;
                    dominant = exp;
                }
            }

            return { mood: dominant, confidence: Math.round(maxScore * 100) };
        } catch (err) {
            console.warn("Face detection error:", err);
            return null;
        } finally {
            setIsScanning(false);
        }
    }, [isModelsLoaded]);

    // Camera ready callback
    const handleCameraReady = useCallback(() => {
        setIsCameraReady(true);
    }, []);

    // Auto-detect emotion on page load/reload jaise hi models aur camera ready ho
    useEffect(() => {
        if (isModelsLoaded && isCameraReady && !hasInitialScannedRef.current) {
            const autoInitialScan = async () => {
                // Video frame settle hone ke liye 600ms buffer
                await new Promise((r) => setTimeout(r, 600));
                const result = await detectFace();
                if (result && result.mood) {
                    hasInitialScannedRef.current = true;
                    const moodInfo = MOOD_DISPLAY_MAP[result.mood] || {
                        label: result.mood.toUpperCase(),
                        id: result.mood,
                    };
                    setActiveMoodId(result.mood);
                    setCurrentMoodLabel(moodInfo.label);
                    setMatchScore(result.confidence || 90);
                    fetchSongsByMood(result.mood, true);
                } else {
                    // Agar face turant nahi mila to neutral playlist play kar do
                    fetchSongsByMood("neutral", true);
                }
            };
            autoInitialScan();
        }
    }, [isModelsLoaded, isCameraReady, detectFace, fetchSongsByMood]);

    // Song end par automatically face detect karke agla gaana queue karo
    const handleSongEnd = async () => {
        const finishedId = activeTrack?._id || activeTrack?.id;
        const result = await detectFace();

        if (result && result.mood && result.mood !== activeMoodId) {
            const moodInfo = MOOD_DISPLAY_MAP[result.mood] || {
                label: result.mood.toUpperCase(),
                id: result.mood,
            };
            setActiveMoodId(result.mood);
            setCurrentMoodLabel(moodInfo.label);
            setMatchScore(result.confidence || 90);
            fetchSongsByMood(result.mood, true);
            return;
        }

        const nextTrack = pickRandomTrack(tracks, finishedId);
        if (nextTrack) {
            setActiveTrack(nextTrack);
            setIsPlaying(true);
        }
    };

    // Instant manual face scan trigger
    const handleManualScan = async () => {
        const result = await detectFace();
        if (result && result.mood) {
            const moodInfo = MOOD_DISPLAY_MAP[result.mood] || {
                label: result.mood.toUpperCase(),
                id: result.mood,
            };
            setActiveMoodId(result.mood);
            setCurrentMoodLabel(moodInfo.label);
            setMatchScore(result.confidence || 90);
            fetchSongsByMood(result.mood, true);
        }
    };

    // New song upload success handler
    const handleUploadSuccess = (newSong) => {
        if (newSong && newSong.mood === activeMoodId) {
            setTracks((prev) => [newSong, ...prev]);
        }
    };

    return (
        <div className="app-container">
            {/* Top Navigation Bar with Upload Button */}
            <Navbar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onOpenUpload={() => setIsUploadModalOpen(true)}
            />

            <main className="main-content">
                {activeTab === "live-space" ? (
                    <>
                        {/* Left Panel: Camera Stream View with pure black background on load */}
                        <div className="left-panel">
                            <CameraFeed
                                videoRef={videoRef}
                                isScanning={isScanning}
                                onManualScan={handleManualScan}
                                onCameraReady={handleCameraReady}
                            />
                        </div>

                        {/* Right Panel: Now Playing Spinning Vinyl Disc & Mood Info */}
                        <div className="right-panel">
                            <NowPlayingDisk
                                activeTrack={activeTrack}
                                activeMoodId={activeMoodId}
                                matchScore={matchScore}
                                isPlaying={isPlaying}
                            />
                        </div>
                    </>
                ) : (
                    /* Full-width Lazy Loaded Music Library View */
                    <div style={{ gridColumn: "1 / -1", width: "100%" }}>
                        <LibraryView onOpenUpload={() => setIsUploadModalOpen(true)} />
                    </div>
                )}
            </main>

            {/* Persistent Audio Player Bar */}
            <PlayerBar
                currentTrack={activeTrack}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(!isPlaying)}
                onSongEnd={handleSongEnd}
            />

            {/* Song Upload Modal */}
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    );
}

