const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const router = express.Router();
const { haversine } = require("../utils/distance");
const User = require("../models/User");

// pagination et sorting

router.get("/restaurants", async (req, res) => {
  /*
      type[]=vegan&type[]=vegetarian&type[]=veg-options&type[]=Ice+Cream
    type:[
      "vegan",
      "vegetarian",
      "veg-options",
      "Ice Cream"
    ]
    
    */
  try {
    let { type, rayon, limit } = req.query;
    const user = await User.findOne();
    const response = await axios.get(process.env.HAPPY_COW_API);
    // let limit = 100;
    let page = 1;
    let rayonDefault = 3;
    let resultsType;
    let resultsRayon;
    let limitDefault = 100;

    function filterType(data) {
      let splited;
      for (let i = 0; i < data.length; i++) {
        splited = _(data)
          .drop((page - 1) * limit)
          .take(limit)
          .filter(({ type }) => req.query.type.includes(type))
          .value();
      }
      return splited;
    }

    if (rayon === undefined) {
      rayon = rayonDefault;
    }

    if (limit === undefined) {
      limit = limitDefault;
    }

    if (typeof req.query.type === "string") {
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

    if (typeof req.query.type === "object") {
      resultsType = filterType(response.data);
    }

    // Filtre par rayon
    let result = haversine(user.location, resultsType, rayon);
    resultsRayon = _(result)
      .drop((page - 1) * limit)
      .take(limit)
      .value();

    // if (type && rayon) {
    //   results = resultsRayon;
    // } else {
    //   results = resultsCategory;
    // }
    let results = resultsRayon;

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
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
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
      res.status(200).json(results);
    } else {
      results = response.data;
      res.status(202).json(results);
    }
    // res.status(200).json(results);
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
