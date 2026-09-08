import React, { useState } from "react";
import Navbar from "./components/Navbar";
import MoodDetector from "./components/MoodDetector";
import TrackList from "./components/TrackList";

export default function App() {
    const [Tracks, setTracks] = useState([]);

    return (
        <>
            <Navbar />
            <main>
                <MoodDetector setTracks={setTracks} />
                <TrackList tracks={Tracks} />
            </main>
        </>
    );
}
