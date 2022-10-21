const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Env variables
dotenv.config({ path: "./config.env" });
// Own imports
const app = require("./app");

const db = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
    .connect(db, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("DB Connected");
    });

// Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
