const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");
const songmodel = require("../models/song.model");

const router = express.Router();

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

// Lazy loaded / paginated & mood-based songs fetch
router.get("/songs", async (req, res) => {
    try {
        const { mood, page, limit } = req.query;
        const query = mood ? { mood } : {};

        if (page || limit) {
            const pageNum = parseInt(page, 10) || 1;
            const limitNum = parseInt(limit, 10) || 20;
            const skip = (pageNum - 1) * limitNum;

            const total = await songmodel.countDocuments(query);
            const songs = await songmodel.find(query).skip(skip).limit(limitNum);

            return res.status(200).json({
                message: "Songs fetched successfully",
                songs,
                page: pageNum,
                totalPages: Math.ceil(total / limitNum),
                total,
                hasMore: skip + songs.length < total,
            });
        }

        const songs = await songmodel.find(query);
        res.status(200).json({
            message: "song fetched sucessfully",
            songs,
            total: songs.length,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
