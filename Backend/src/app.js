const express = require("express");
const cors = require("cors");
const songRoute = require("./routes/song.routes");

const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/", songRoute);

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "VibeSync Audio Backend API is running",
    });
});

module.exports = app;
