const express = require("express");
const songRoute = require("./routes/song.routes");
const cors = require("cors");

const app = express();

//middelware for express requtest read
app.use(express.json());
app.use(cors());
//routes
app.use("/", songRoute);

app.get("/", (req, res) => {
    res.json({
        Response: " fuck you",
    });
});

module.exports = app;
