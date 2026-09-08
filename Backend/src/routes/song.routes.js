const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songmodel = require("../models/song.model");

const router = express.Router();

// RAM me temporary store karo — multer memoryStorage
const upload = multer({
    storage: multer.memoryStorage(),
});

router.post("/songs", upload.single("audio"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "audio file required hai" });
        }

        const fileData = await uploadFile(req.file);

        const song = await songmodel.create({
            title: req.body.title,
            artist: req.body.artist,
            audio: fileData.url,
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
});

router.get("/songs", async (req, res) => {
    const mood = req.query.mood;

    const songs = await songmodel.find({
        mood: mood,
    });
    res.status(200).json({
        message: "song fetched sucessfully",
        songs,
    });
});

module.exports = router;
