const express = require("express");
const multer = require("multer");
const uploadFile = require("../service/storage.service");

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

        res.status(201).json({
            response: "song created successfully",
            song: req.body,
            url: fileData.url,
        });
    } catch (err) {
        console.error("Upload error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
