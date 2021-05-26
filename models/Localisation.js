const mongoose = require("mongoose");

const Localisation = mongoose.model("Localisation", {
  location: {
    type: [Number], // Longitude et latitude
    index: "2d",
  },
});

module.exports = Localisation;
