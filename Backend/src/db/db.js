const mongoose = require("mongoose");

function connectdb() {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("db started");
        })
        .catch((err) => {
            console.error("DB connection failed:", err.message);
        });
}
module.exports = connectdb;
 