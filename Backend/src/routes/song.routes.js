const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songmodel = require("../models/song.model");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

router.post(
    "/songs",
    upload.fields([
        { name: "audio", maxCount: 1 },
        { name: "cover", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const audioFile = req.files?.audio?.[0];
            const coverFile = req.files?.cover?.[0];

            if (!audioFile) {
                return res.status(400).json({ error: "audio file required hai" });
            }

            // Audio upload karo
            const audioData = await uploadFile(audioFile, "/songs");

            // Cover art image upload karo agar provide kiya hai
            let coverUrl = req.body.cover || "";
            if (coverFile) {
                const coverData = await uploadFile(coverFile, "/covers");
                coverUrl = coverData?.url || "";
            }

            const song = await songmodel.create({
                title: req.body.title,
                artist: req.body.artist,
                audio: audioData.url,
                cover: coverUrl,
                mood: req.body.mood,
            });

            res.status(201).json({
                response: "song created successfully",
                song: song,
            });
        } catch (err) {
            console.error("Upload error:", err.message);
            res.status(500).json({ error: err.message });
        }
    }
);


// Mood-based or all songs fetch
router.get("/songs", async (req, res) => {
    try {
        const { mood } = req.query;
        const query = mood ? { mood } : {};
        const songs = await songmodel.find(query);

        res.status(200).json({
            message: "Songs fetched successfully",
            songs,
            total: songs.length,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
