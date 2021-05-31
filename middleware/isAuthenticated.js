const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  //   console.log("Middleware");
  if (req.headers.authorization) {
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token });
    // console.log(user);
    if (!user) {
      res.status(400).json({ error: "Connectez-vous !" });
    } else {
      req.user = user;
      next();
    }
  } else {
    res.status(401).json({ error: "Non authorisé !" });
  }
};

module.exports = isAuthenticated;
