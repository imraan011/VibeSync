// VibeSync static configuration for navigation and mood mappings

export const NAV_LINKS = [
    { id: "live-space", label: "Live Space", active: true },
    { id: "library", label: "Library", active: false },
];

export const MOOD_DISPLAY_MAP = {
    neutral: { label: "Calm & Centered", color: "#0d9488", id: "neutral" },
    happy: { label: "Happy & Uplifting", color: "#d97706", id: "happy" },
    sad: { label: "Reflective & Melancholic", color: "#9333ea", id: "sad" },
    surprised: { label: "Energetic & Surprised", color: "#e11d48", id: "surprised" },
    angry: { label: "Intense & Focused", color: "#dc2626", id: "angry" },
    fearful: { label: "Tense & Suspenseful", color: "#7c3aed", id: "fearful" },
    disgusted: { label: "Raw & Alternative", color: "#db2777", id: "disgusted" },
};

