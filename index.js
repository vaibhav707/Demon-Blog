const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;

mongoose
.connect("mongodb://localhost:27017/demonblog")
.then((e) => console.log("MongoDB connected"));

app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
    res.render("Home");
});

app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server started at PORT:${PORT}`);
});