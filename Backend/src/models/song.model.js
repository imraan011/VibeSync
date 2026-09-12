const mongoose = require("mongoose");

const songschema = new mongoose.Schema({
    title: String,
    artist: String,
    audio: String,
    cover: String,
    mood: String,
});

const song = mongoose.model("song", songschema);

module.exports = song;

