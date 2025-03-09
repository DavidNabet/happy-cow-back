import dotenv from "dotenv";
// Dependancies
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import formidable from "express-formidable";
// Routes
import userRoute from "./routes/user.js";
import restaurantsRoute from "./routes/restaurants.js";
dotenv.config();
const app = express();
const { NODE_ENV, MONGO_LOCAL_URI, PORT, MONGO_URI } = process.env;

// Database connection
mongoose.connect(NODE_ENV === "development" ? MONGO_LOCAL_URI : MONGO_URI);

app.use(formidable());
app.use(cors());
app.use(express.urlencoded({ extended: false, limit: "1600kb" }));
app.use(express.json({ limit: "1600kb" }));

app.use("/user", userRoute);
app.use(restaurantsRoute);

app.get("/", (req, res) => {
  res.json("Welcome to Happy Cow API !");
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Cette page n'existe pas !" });
});

app.listen(PORT, () => {
  console.log("Server proccess");
});
