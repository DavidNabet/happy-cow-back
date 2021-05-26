const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  hash: String,
  token: String,
  salt: String,
  location: {
    type: [Number],
    index: "2d",
  },
});

module.exports = User;
