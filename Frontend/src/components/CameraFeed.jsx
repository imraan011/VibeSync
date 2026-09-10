import React, { useEffect, useState } from "react";
import "./CameraFeed.css";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80";

export default function CameraFeed({ videoRef, isScanning = false, onManualScan }) {
    const [hasStream, setHasStream] = useState(false);

    useEffect(() => {
        let stream = null;
        if (navigator.mediaDevices?.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: "user",
                    },
                })
                .then((mediaStream) => {
                    stream = mediaStream;
                    if (videoRef?.current) {
                        videoRef.current.srcObject = mediaStream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current.play().catch(() => {});
                        };
                        setHasStream(true);
                    }
                })
                .catch(() => {
                    setHasStream(false);
                });
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [videoRef]);

    return (
        <section className="camera-section">
            {/* Top Status Indicators */}
            <div className="camera-section__header">
                <div className="camera-section__status">
                    <span className="camera-section__dot" aria-hidden="true" />
                    <span>Camera Active</span>
                </div>
                <div className="camera-section__actions-top">
                    <span className="camera-section__meta">
                        {isScanning ? "Scanning face expression..." : "Reading expression"}
                    </span>
                    {onManualScan && (
                        <button
                            type="button"
                            className="camera-section__scan-btn"
                            onClick={onManualScan}
                            title="Instant Face Scan"
                        >
                            ⚡ Scan Now
                        </button>
                    )}
                </div>
            </div>

            {/* Video Viewport Container */}
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
                    <div className="camera-section__fallback">
                        <img
                            src={FALLBACK_IMAGE}
                            alt="Facial expression feed preview"
                            className="camera-section__poster"
                        />
                        <div className="camera-section__vignette" />
                    </div>
                )}
            </div>
        </section>
    );
}
