require("dotenv").config();
// Dependancies
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { NODE_ENV, MONGO_LOCAL_URI, PORT, MONGO_URI } = process.env;

// Database connection
mongoose.connect(NODE_ENV === "development" ? MONGO_LOCAL_URI : MONGO_URI);

app.use(formidable());
app.use(cors());

app.use("/user", require("./routes/user"));
app.use(require("./routes/restaurants"));

app.get("/", (req, res) => {
  res.json("Welcome to Happy Cow API !");
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Cette page n'existe pas !" });
});

app.listen(PORT, () => {
  console.log("Server proccess");
});
