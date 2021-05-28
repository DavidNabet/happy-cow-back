const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const router = express.Router();
const { haversine } = require("../utils/distance");
// Les 100 premiers résultats
// Ils doivent être filtrés par rapport à la géolocalisation du telephone
// On commencera par les plus pertinents

const User = require("../models/User");

// pagination et sorting
router.get("/restaurants", async (req, res) => {
  try {
    // const { limit } = req.query;
    let { type, rayon, limit } = req.query;
    const user = await User.findOne();
    const response = await axios.get(process.env.HAPPY_COW_API);
    // let limit = 100;
    let page = 1;
    let rayonDefault = 3;
    let resultsType;
    let resultsRayon;
    let limitDefault = 100;
    let results;

    if (rayon === undefined) {
      rayon = rayonDefault;
    }

    if (limit === undefined) {
      limit = limitDefault;
    }
    // Filtre par type
    if (type) {
      resultsType = _(response.data)
        .drop((page - 1) * limit)
        .take(limit)
        .filter({ type: type })
        .orderBy(["name", "rating"], ["asc", "desc"])
        .value();
    } else {
      resultsType = _(response.data)
        .drop((page - 1) * limit)
        .take(limit)
        .orderBy(["name", "rating"], ["asc", "desc"])
        .value();
    }

    // Filtre par rayon
    let result = haversine(user.location, resultsType, rayon);
    resultsRayon = _(result)
      .drop(page - 1 * limit)
      .take(limit)
      .value();

    results = resultsRayon;
    // console.log(results);

    res.status(200).json(results);
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

router.get("/resto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(process.env.HAPPY_COW_API);
    let result = response.data.find((elem) => elem.placeId === Number(id));
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

router.get("/restaurants/around", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const response = await axios.get(process.env.HAPPY_COW_API);
    let results;
    if (lat && lng) {
      results = _.map(
        response.data,
        _.partialRight(_.pick, [
          "placeId",
          "name",
          "address",
          "location",
          "category",
          "type",
        ])
      );
      // res.status(200).json(results);
    } else {
      results = response.data;
    }
    res.status(200).json(results);
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

router.get("/restaurants/data", async (req, res) => {
  try {
    const user = await User.findOne();
    const response = await axios.get(process.env.HAPPY_COW_API);
    let distance = haversine(user.location, response.data, 0.2);

    res.status(200).json({ distance: distance });
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
