const mongoose = require("mongoose");

function connectdb() {
    mongoose
        // dbName explicitly set — warna default 'test' db me data jaata hai
        .connect(process.env.MONGODB_URL, { dbName: "MoodyPlayer" })
        .then(() => {
            console.log("db started — MoodyPlayer database connected");
        })
        .catch((err) => {
            console.error("DB connection failed:", err.message);
        });
}
module.exports = connectdb;
