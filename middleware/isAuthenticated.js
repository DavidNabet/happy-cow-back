import User from "../models/User.js";

const isAuthenticated = async (req, res, next) => {
  try {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ error: "Connectez-vous !" });
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default isAuthenticated;
