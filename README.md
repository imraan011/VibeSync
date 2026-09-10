# ✦ VibeSync — Biometric Emotion-Driven Audio Instrument

> **VibeSync** is an intelligent audio-reactive platform that bridges human emotion and sound synthesis. By translating real-time facial micro-expressions into dynamic acoustic frequencies, VibeSync transforms passive music listening into an interactive, emotionally resonant experience.

---

## 👁️ The Vision & Concept

Traditional music streaming requires manual curation — searching playlists, skipping tracks, and guessing what fits your current state of mind. 

**VibeSync inverts this dynamic**:
Instead of searching for music, the instrument **observes and adapts to you**. Using client-side computer vision and real-time facial telemetry, the system continuously gauges your emotional resonance and streams audio tuned to your immediate state.

```
┌─────────────────┐       ┌────────────────────────┐       ┌─────────────────────────┐
│  Live Biometric │ ───▶  │ Real-Time Neural Radar │ ───▶  │ Dynamic Audio Resonance │
│  Webcam Stream  │       │ (Client-Side Edge AI)  │       │ & Mood-Reactive Theming │
└─────────────────┘       └────────────────────────┘       └─────────────────────────┘
```

---

## ⚡ Core Capabilities

### 1. Zero-Friction Instant Playback
The moment the biometric sensor connects, the neural engine evaluates initial facial landmarks, categorizes the dominant emotion, and begins streaming matching soundscapes without requiring a single click.

### 2. Continuous 13-Second Biometric Radar
Operating silently in the background, a non-intrusive scanning sweep analyzes facial expressions at regular intervals. If your mood organically transitions (e.g., from deep focus to high energy), the system updates your vibe queue seamlessly without interrupting the current track.

### 3. Noise-Filtered Debounce Engine
Human facial expressions are naturally dynamic and fleeting. VibeSync employs a confidence-weighted debounce mechanism requiring consecutive verified states to filter out inadvertent blinks or momentary shifts, ensuring stable, reliable playback.

### 4. Vital-Signs Instrument Panel Interface
Moving away from generic dashboard templates, VibeSync adopts an oscilloscope/vital-signs visual identity:
- **Asymmetric Viewfinder**: Biometric reticle targeting, focal crosshairs, and live telemetry feeds.
- **Dynamic Chromatic Adaptation**: The entire interface — from background aura to waveforms and timeline scrubbers — dynamically morphs its color spectrum to reflect the detected mood.
- **Oscillating Waveform Equalizer**: Playback-synchronized soundwave bars reflecting live audio activity.
- **Single-Stream Global Audio Engine**: Centralized audio controller with continuous playback, seamless seek scrubbers, and volume management.

---

## 🎨 The Emotional Spectrum

VibeSync maps facial expression vectors to tailored acoustic spaces and chromatic wavelengths:

| Emotion | Frequency Profile | Chromatic Signature | Acoustic Archetype |
| :--- | :--- | :--- | :--- |
| **Happy** | Uplifting, rhythmic, bright | Warm Amber (`#F5B942`) | Synthwave, Acoustic Pop, Upbeat Grooves |
| **Calm / Neutral** | Smooth, steady, low-tempo | Teal Cyan (`#3FC7C0`) | Lo-Fi, Ambient Textures, Chillstep |
| **Melancholy** | Atmospheric, reflective, minor key | Deep Indigo (`#5B6EE1`) | Neo-Classical Piano, Ambient Solitude |
| **Energetic** | High BPM, punchy dynamics | Magenta Rose (`#E8447A`) | Cyberpunk, Future Bass, Electro Pulse |
| **Fierce** | Heavy distortion, driving bass | Warm Red-Orange (`#E85D4C`) | Hard Rock, Cinematic Trailer |
| **Mystic** | Suspenseful, textured, deep | Muted Violet (`#8A6FE8`) | Dark Ambient, Cinematic Mystery |

---

## 🏛️ System Architecture

```
                                  ┌───────────────────────────┐
                                  │      VibeSync Client      │
                                  │  (React 19 + Vite + CSS)  │
                                  └─────────────┬─────────────┘
                                                │
                         ┌──────────────────────┴──────────────────────┐
                         ▼                                             ▼
            ┌─────────────────────────┐                   ┌──────────────────────────┐
            │   Edge Neural Engine    │                   │   Central Audio State    │
            │ (face-api.js / WebGL)   │                   │  (PlayerBar & Queue UI)  │
            └─────────────────────────┘                   └────────────┬─────────────┘
                                                                       │ REST API
                                                                       ▼
                                                          ┌──────────────────────────┐
                                                          │    Node / Express API    │
                                                          └────────────┬─────────────┘
                                                                       │
                                        ┌──────────────────────────────┴──────────────────────────────┐
                                        ▼                                                             ▼
                           ┌──────────────────────────┐                                  ┌──────────────────────────┐
                           │      MongoDB Atlas       │                                  │   CDN Streaming Buffer   │
                           │  (Mood Catalog Metadata) │                                  │   (Direct Audio Streams) │
                           └──────────────────────────┘                                  └──────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend & Biometrics**:
  - React 19 & Vite
  - `face-api.js` (Tiny Face Detector & Face Expression Recognition Net)
  - Vanilla CSS Design System with custom CSS variables & dynamic keyframe animations
  - Google Fonts (`Space Grotesk` for data/telemetry & `Inter` for UI clarity)

- **Backend & Catalog Service**:
  - Node.js & Express
  - MongoDB & Mongoose ORM
  - Scalable RESTful API standard (`{ success, data }`)
  - ImageKit Cloud Storage Integration

---

## 📦 High-Level Setup Overview

VibeSync is structured as a decoupled client-server architecture:

1. **Backend Service**: Configured with standard MongoDB URI and port bindings. Includes an automated seed catalog for instant out-of-the-box acoustic datasets.
2. **Frontend Client**: Client-side application hosting pre-trained neural network models in the public directory and communicating with the API via environment-driven endpoints.

---

## 📄 License
This project is open-source under the ISC License.
