import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./MoodDetector.css";
import axios from "axios";

export default function MoodDetector({ setTracks }) {
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
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => console.error("Error accessing webcam: ", err));
        };

        loadModels().then(startVideo);
    }, []);

    async function detectMood() {
        if (!videoRef.current) return;

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

        console.log("Detected Mood:", mostProbableExpression);

        //api hit karege using axios GET server response according to mood detected
        axios
            .get(`http://localhost:3000/songs?mood=${mostProbableExpression}`)
            .then((res) => {
                console.log(res.data.songs);
                setTracks(res.data.songs)
            });
    }

    return (
        <section className="mood-detector">
            <h1 className="mood-detector__heading">Live Mood Detection</h1>

            <div className="mood-detector__body">
                {/* Live Webcam video stream */}
                <div className="mood-detector__camera">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="mood-detector__video"
                        aria-label="Webcam live video feed"
                    />
                </div>

                {/* Info panel + Detect button */}
                <div className="mood-detector__info">
                    <h2 className="mood-detector__info-title">
                        Live Mood Detection
                    </h2>
                    <p className="mood-detector__info-desc">
                        Your current mood is being analyzed in real-time. Enjoy
                        music tailored to your feelings.
                    </p>
                    <button
                        id="start-listening-btn"
                        className="mood-detector__btn"
                        onClick={detectMood}
                    >
                        Start Listening
                    </button>
                </div>
            </div>
        </section>
    );
}
