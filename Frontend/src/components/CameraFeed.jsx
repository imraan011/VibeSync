import React, { useEffect, useState } from "react";
import "./CameraFeed.css";

export default function CameraFeed({ videoRef, onScan }) {
    const [hasStream, setHasStream] = useState(false);

    useEffect(() => {
        let stream = null;
        if (navigator.mediaDevices?.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" } })
                .then((mediaStream) => {
                    stream = mediaStream;
                    if (videoRef?.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current.play().then(() => setHasStream(true)).catch(() => {});
                        };
                    }
                })
                .catch(() => setHasStream(false));
        }

        return () => {
            if (stream) stream.getTracks().forEach((t) => t.stop());
        };
    }, [videoRef]);

    return (
        <section className="camera-section">
            <div className="camera-section__header">
                <div className="camera-section__status">
                    <span className="camera-section__dot" aria-hidden="true" />
                    <span>Camera {hasStream ? "Active" : "Connecting..."}</span>
                </div>
                {onScan && (
                    <button type="button" className="camera-section__scan-btn" onClick={onScan} title="Instant Face Scan">
                        ⚡ Scan Mood
                    </button>
                )}
            </div>

            <div className="camera-section__viewport">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`camera-section__video ${hasStream ? "camera-section__video--active" : ""}`}
                    aria-label="Live Camera Stream"
                />

                {!hasStream && (
                    <div className="camera-section__loading-screen">
                        <div className="camera-section__radar-pulse" />
                        <span className="camera-section__loading-text">Initializing Camera Feed...</span>
                    </div>
                )}
            </div>
        </section>
    );
}

