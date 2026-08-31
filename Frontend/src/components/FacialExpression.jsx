import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
export default function FacialExpression() {
    const videoRef = useRef();
    const canvasRef = useRef();
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        };
        const startVideo = () => {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                })
                .catch((err) => console.error("Error accessing webcam: ", err));
        };
        const handleVideoPlay = () => {
            setInterval(async () => {
                const detections = await faceapi
                    .detectAllFaces(
                        videoRef.current,
                        new faceapi.TinyFaceDetectorOptions(),
                    )
                    .withFaceExpressions();
            console.log(detections[0].expressions);
            }, 3000);
        };
        loadModels().then(startVideo);
        videoRef.current &&
            videoRef.current.addEventListener("play", handleVideoPlay);
    }, []);
    return (
        <div style={{ position: "relative" }}>
            <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: "720px", height: "560px" }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "720px",
                    height: "560px",
                }}
            />
        </div>
    );
}
