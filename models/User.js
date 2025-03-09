import { Schema, model } from "mongoose";
const User = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  hash: String,
  token: String,
  salt: String,
  location: {
    type: [Number], // Longitude et latitude
    index: "2d",
  },
});

export default model("User", User);
