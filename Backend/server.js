require("dotenv").config();
const app = require("./src/app");
const connectdb = require("./src/db/db");

connectdb();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
