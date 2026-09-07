import React from "react";
import Navbar from "./components/Navbar";
import MoodDetector from "./components/MoodDetector";
import TrackList from "./components/TrackList";

const TRACKS = [
  { id: 1,  title: "Sunrise Serenade",   artist: "Ava Carter"      },
  { id: 2,  title: "Midnight Groove",    artist: "Ethan Blake"     },
  { id: 3,  title: "Electric Pulse",     artist: "Olivia Hayes"    },
  { id: 4,  title: "Tranquil Echoes",    artist: "Noah Bennett"    },
  { id: 5,  title: "Rhythmic Heartbeat", artist: "Sophia Reed"     },
  { id: 6,  title: "Dreamy Horizons",    artist: "Liam Foster"     },
  { id: 7,  title: "Urban Flow",         artist: "Isabella Morgan" },
  { id: 8,  title: "Soulful Journey",    artist: "Caleb Parker"    },
  { id: 9,  title: "Cosmic Dance",       artist: "Grace Ellis"     },
  { id: 10, title: "Velvet Nights",      artist: "Owen Mitchell"   },
];

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <MoodDetector />
        <TrackList tracks={TRACKS} />
      </main>
    </>
  );
}
