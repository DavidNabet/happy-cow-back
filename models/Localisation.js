const mongoose = require("mongoose");

const Localisation = mongoose.model("Localisation", {
  location: {
    type: [Number],
  },
});

module.exports = Localisation;
