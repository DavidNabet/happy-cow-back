require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const { NODE_ENV, MONGO_LOCAL_URI, PORT } = process.env;

mongoose.connect(NODE_ENV === "development" ? MONGO_LOCAL_URI : MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(formidable());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// app.use("/user", require("./routes/user"));
app.use(require("./routes/restaurants"));

app.get("/", (req, res) => {
  res.json("Welcome to Happy Cow API !");
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Cette route n'existe pas !" });
});

app.listen(PORT || 3200, () => {
  console.log("Server proccess");
});
