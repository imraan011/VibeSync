# 🎵 VibeSync — Biometric Mood-Adaptive Music Player

> **VibeSync** is a modern, full-stack mood-based music player that analyzes your facial expressions in real time through your webcam and instantly streams songs that match how you feel.
> **No manual playlists, no endless searching** — just glance at the camera, and VibeSync curates the sonic vibe (Calm, Happy, Reflective, Energetic, Intense, Tense, Raw) directly in your browser.

 
 
## ✨ Features

- 🎭 **Client-Side Face Expression Detection** — Uses pre-trained neural networks (`face-api.js` with `TinyFaceDetector` and `FaceExpressionNet`) to classify facial landmarks into 7 distinct emotional states in real time.
- 💿 **Interactive Spinning Vinyl Player** — Features a realistic spinning vinyl record disc with concentric acoustic grooves, animated soundwave equalizer bars, and dynamic mood-colored glowing aura.
- 🖼️ **Album Cover Art Support** — Embedded album artwork positioned in the center spindle of the vinyl record with automatic mood-tinted ambient reflections.
- 🎛️ **Precision Player Bar** — Timeline seek scrubber with live timestamp progress, quick `↺ 5s` rewind and `↻ 5s` forward skip buttons, variable playback speed cycles (`1x`, `1.25x`, `1.5x`, `2x`, `0.75x`), and horizontal volume/mute sliders.
- 🔄 **Smart Fallback & Uninterrupted Queue** — After every track ends, the app re-scans your expression and picks a fresh (randomized) track from the matching mood; if a face is temporarily out of frame or the camera is blocked, it falls back to a random track from the current mood so music never gets stuck.
- ⬆️ **Dual-Media Song Upload** — Upload custom audio tracks (`.mp3` / `.wav`) alongside custom cover art (`.jpg` / `.png`) with auto-title extraction and mood tagging.
- ☁️ **Cloud Storage Integration** — Audio tracks and album cover images are streamed via ImageKit cloud storage (`/songs` and `/covers`).
- 🎨 **Minimalist Design System** — Sleek, ultra-clean white aesthetic powered by vanilla CSS variables and responsive glassmorphism touches.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│                   React Frontend (Vite)                │
│                                                        │
│  ┌───────────────────────┐    ┌─────────────────────┐  │
│  │   Webcam Stream &     │    │  NowPlayingDisk     │  │
│  │  face-api.js Edge AI  │    │  (Spinning Vinyl)   │  │
│  └───────────┬───────────┘    └──────────▲──────────┘  │
│              │                           │             │
│              └────────────┐   ┌──────────┘             │
│                           ▼   │                        │
│                     ┌───────────────┐                  │
│                     │  PlayerBar    │                  │
│                     │ (Audio State) │                  │
│                     └───────┬───────┘                  │
└─────────────────────────────┼──────────────────────────┘
                              │ REST API Requests
                              ▼
┌────────────────────────────────────────────────────────┐
│                   Express Backend (Node.js)            │
│                                                        │
│  ┌───────────────────────┐    ┌─────────────────────┐  │
│  │  Multer File Stream   │───▶│   ImageKit Cloud    │  │
│  │   (Memory Storage)    │    │  (/songs & /covers) │  │
│  └───────────┬───────────┘    └─────────────────────┘  │
│              │                                         │
│              ▼                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │    MongoDB Atlas (MoodyPlayer DB / songs col)    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

1. **Camera Feed & Initialization** — On page load, the browser initializes the webcam and loads lightweight client-side Face-API model weights into memory.
2. **Biometric Emotion Extraction** — The client-side detector evaluates facial expressions and determines the dominant emotion along with a confidence match score (e.g., `92% Match`).
3. **Dynamic Playlist Query** — The detected mood triggers a request to the backend (`GET /songs?mood=:mood`), fetching curated tracks stored in MongoDB.
4. **Instant Vinyl Playback** — The matched song loads into the spinning vinyl disc, animated equalizer, and bottom player bar without manual intervention.
5. **Seamless Loop on Track End** — When a song completes, the system automatically scans for updated facial expressions and picks a fresh (randomized) track from the matching mood; if no face is detected, it smoothly continues with a random track from the active mood instead.
6. **Song Upload Modal** — Users can upload new audio files and cover art with mood tagging, which get uploaded to ImageKit and saved in MongoDB.

---

## 🎨 The Emotional Spectrum

| Emotion | Display Label | Signature Color | Acoustic Archetype |
| :--- | :--- | :--- | :--- |
| **Neutral** | Calm & Centered | `#0d9488` (Teal) | Lo-Fi, Ambient, Chillstep |
| **Happy** | Happy & Uplifting | `#d97706` (Amber) | Upbeat Grooves, Pop, Feel-Good |
| **Sad** | Reflective & Melancholic | `#9333ea` (Purple) | Neo-Classical Piano, Slow Acoustics |
| **Surprised** | Energetic & Surprised | `#e11d48` (Rose) | Future Bass, Electronic, Dance |
| **Angry** | Intense & Focused | `#dc2626` (Red) | Hard Rock, Heavy Distortion, Driving Bass |
| **Fearful** | Tense & Suspenseful | `#7c3aed` (Violet) | Cinematic Mystery, Dark Ambient |
| **Disgusted** | Raw & Alternative | `#db2777` (Pink) | Grunge, Alternative, Indie Rock |

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Tooling**: React 19, Vite
- **Edge Biometric AI**: `face-api.js` (`TinyFaceDetector` + `FaceExpressionNet`)
- **API Client**: Axios
- **Styling**: Vanilla CSS with custom tokens, modern typography (`Plus Jakarta Sans`), and keyframe animations

### Backend
- **Server Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ORM
- **File Handling**: Multer (Memory Storage)
- **Cloud Storage & CDN**: ImageKit Node SDK (v7+)
- **Security & Config**: CORS, Dotenv

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/songs` | Uploads an audio file (`audio`) and optional cover image (`cover`) via multipart form data |
| `GET` | `/songs` | Fetches all songs stored in the database |
| `GET` | `/songs?mood=:mood` | Fetches all songs matching a specific mood category |

---

## 📂 Project Structure

```
Moody Player/
├── Backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── db.js                 # MongoDB connection logic
│   │   ├── models/
│   │   │   └── song.model.js         # Mongoose schema for songs
│   │   ├── routes/
│   │   │   └── song.routes.js        # GET & POST /songs API routes
│   │   ├── service/
│   │   │   └── storage.service.js    # ImageKit upload service
│   │   └── app.js                    # Express application configuration
│   ├── server.js                     # Backend HTTP server entry
│   └── package.json
│
├── Frontend/
│   ├── public/
│   │   └── models/                   # Pre-trained face-api.js neural network weights
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraFeed.jsx        # Camera stream viewport & scan button
│   │   │   ├── CameraFeed.css
│   │   │   ├── Navbar.jsx            # Top navigation brand & upload trigger
│   │   │   ├── Navbar.css
│   │   │   ├── NowPlayingDisk.jsx    # Spinning vinyl disc with cover art & equalizer
│   │   │   ├── NowPlayingDisk.css
│   │   │   ├── PlayerBar.jsx         # Bottom audio timeline, 5s skip, speed & volume
│   │   │   ├── PlayerBar.css
│   │   │   ├── UploadModal.jsx       # Multi-part modal for audio & cover art upload
│   │   │   └── UploadModal.css
│   │   ├── data/
│   │   │   └── mockData.js           # Mood display labels, colors & mappings
│   │   ├── App.jsx                   # Core state, biometric scan loop & audio orchestrator
│   │   ├── index.css                 # Clean minimal white design system & typography
│   │   └── main.jsx                  # React application root mount
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (local or MongoDB Atlas)
- An ImageKit account (public key, private key, URL endpoint)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd "Moody Player"
```

### 2. Backend setup
```bash
cd Backend
npm install
```
Create `Backend/.env` (use `.env.example` as reference) with:
```
MONGO_URI=<your MongoDB connection string>
IMAGEKIT_PUBLIC_KEY=<your ImageKit public key>
IMAGEKIT_PRIVATE_KEY=<your ImageKit private key>
IMAGEKIT_URL_ENDPOINT=<your ImageKit URL endpoint>
FRONTEND_URL=http://localhost:5173
PORT=3000
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd Frontend
npm install
```
Create `Frontend/.env` with:
```
VITE_API_BASE_URL=http://localhost:3000
```
Start the frontend:
```bash
npm run dev
```

The app should now be running at `http://localhost:5173`, connected to the backend at `http://localhost:3000`.

---

## ☁️ Deployment

### Backend (Render)
- Root directory: `Backend/`
- Build command: `npm install`
- Start command: `npm start` (or `node server.js`)
- Environment variables to set: `MONGO_URI`, `FRONTEND_URL`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` (`PORT` is set automatically by Render)

### Frontend (Vercel)
- Root directory: `Frontend/`
- Environment variable to set: `VITE_API_BASE_URL` = your deployed Render backend URL
- `vercel.json` handles SPA routing so client-side routes don't 404 on refresh

After deploying both, update the **Live Demo** and **Backend Health Check** links at the top of this README.

---

## 📄 License

*This project is available for educational and portfolio purposes*
