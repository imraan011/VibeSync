// VibeSync static configuration for navigation and mood mappings

export const NAV_LINKS = [
    { id: "live-space", label: "Live Space", active: true },
    { id: "library", label: "Library", active: false },
    { id: "soundscapes", label: "Soundscapes", active: false },
];

export const MOOD_DISPLAY_MAP = {
    neutral: { label: "Calm & Centered", color: "#2dd4bf", id: "neutral" },
    happy: { label: "Happy & Uplifting", color: "#f59e0b", id: "happy" },
    sad: { label: "Reflective & Melancholic", color: "#a855f7", id: "sad" },
    surprised: { label: "Energetic & Surprised", color: "#f43f5e", id: "surprised" },
    angry: { label: "Intense & Focused", color: "#ef4444", id: "angry" },
    fearful: { label: "Tense & Suspenseful", color: "#8b5cf6", id: "fearful" },
    disgusted: { label: "Raw & Alternative", color: "#ec4899", id: "disgusted" },
};
