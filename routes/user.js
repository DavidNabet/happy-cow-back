const express = require("express");
const User = require("../models/User");
const uid2 = require("uid2");
const isAuthenticated = require("../middleware/isAuthenticated");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const router = express.Router();

// Inscription
router.post("/signup", async (req, res) => {
  try {
    // location
    const { email, username, password, location } = req.fields;
    let userExist = await User.findOne({ email });
    if (!userExist) {
      if (email && password && username) {
        // le salt
        const salt = uid2(16);
        // le password hashé
        const hashPassword = SHA256(salt + password).toString(encBase64);
        // le token
        const token = uid2(64);
        // Déclaration de l'utilisateur
        const newUser = new User({
          email: email,
          username: username,
          token: token,
          hash: hashPassword,
          salt: salt,
          location: [0, 0],
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
          location: newUser.location,
        });
      } else {
        return res.status(400).json({ error: "Remplissez chaque champs !" });
      }
    } else {
      return res.status(409).json({ error: "Cet utilisateur existe déjà" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Informations d'identification invalides" });
    } else {
      const newHash = SHA256(user.salt + password).toString(encBase64);
      if (user.hash === newHash) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          email: user.email,
          username: user.username,
          location: user.location,
        });
      } else {
        res.status(401).json({ message: "Mot de passe Incorrect" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

// Mise à jour des informations de l'utilisateur
router.put("/update/:id", isAuthenticated, async (req, res) => {
  try {
    const { email, username, location } = req.fields;
    const updateUser = {};
    if (email) updateUser.email = email;
    if (username) updateUser.username = username;
    if (location) updateUser.location = [location[0], location[1]];
    if (req.params.id) {
      const userUpdated = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateUser },
        { new: true }
      );

      res.json(201).json(userUpdated);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
