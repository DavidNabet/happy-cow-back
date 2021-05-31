const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });

    if (!user) {
      res.status(400).json({ error: "Connectez-vous !" });
      console.log("Connectez-vous !");
    } else {
      req.user = user;
      return next();
    }
  } else {
    res.status(401).json({ error: "Non authorisé !" });
  }
};

module.exports = isAuthenticated;
