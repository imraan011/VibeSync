import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpression.css";
export default function FacialExpression() {
    const videoRef = useRef();
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

        loadModels().then(startVideo);
    }, []);
    async function detectMood() {
        const detections = await faceapi
            .detectAllFaces(
                videoRef.current,
                new faceapi.TinyFaceDetectorOptions(),
            )
            .withFaceExpressions();

        let mostProbableExp = 0;
        let mostProbableExpression = "";
        if (detections.length === 0) {
            console.log("No face detected");
            return;
        }
        for (const expression in detections[0].expressions) {
            if (detections[0].expressions[expression] > mostProbableExp) {
                mostProbableExp = detections[0].expressions[expression];
                mostProbableExpression = expression;
            }
        }

        console.log(mostProbableExpression);
    }
    return (
        <>
            <div className="mood-element">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="user-video-feed"
                    style={{ width: "720px", height: "560px" }}
                />
            </div>
            <button onClick={detectMood}>Detect Mode</button>
        </>
    );
}
