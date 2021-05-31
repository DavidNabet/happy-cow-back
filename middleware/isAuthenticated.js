const { response } = require("express");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  //   console.log("Middleware");
  try {
    if (req.headers.authorization) {
      const user = await User.findOne({
        token: req.headers.authorization.replace("Bearer ", ""),
      });
      // console.log(user);
      console.log(user);
      if (!user) {
        // res.status(400).json({ error: "Connectez-vous !" });
        console.log("Connectez-vous !");
      } else {
        req.user = user;
        return next();
      }
    } else {
      console.log("Unauthorized");
      // return res.status(401).json({ error: "Non authorisé !" });
    }
  } catch (error) {
    // res.status(400).json({ message: error.message });
    console.log(error);
  }
};

module.exports = isAuthenticated;
