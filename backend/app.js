const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/products", productRouter);

//.json() autosets the application content-type as json
app.get("/", (req, res) => {
    res.status(200).json({ message: "hello world", app: "hello" });
});

module.exports = app;
