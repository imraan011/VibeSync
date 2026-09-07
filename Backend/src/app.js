const express = require("express");
const songRoute = require("./routes/song.routes");

const app = express();

//middelware for express requtest read
app.use(express.json());

//routes
app.use("/", songRoute);

app.get("/", (req, res) => {
    res.json({
        Response: " fuck you",
    });
});

module.exports = app;
