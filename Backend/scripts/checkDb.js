require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const songModel = require("../src/models/song.model");

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { dbName: "MoodyPlayer" });
        console.log("Connected to MongoDB!");
        const count = await songModel.countDocuments();
        console.log("Total songs in database:", count);
        const moods = await songModel.distinct("mood");
        console.log("Distinct moods in database:", moods);
        for (const mood of moods) {
            const moodCount = await songModel.countDocuments({ mood });
            console.log(`Mood '${mood}': ${moodCount} songs`);
        }
    } catch (err) {
        console.error("Error checking DB:", err);
    } finally {
        await mongoose.disconnect();
    }
}

check();
