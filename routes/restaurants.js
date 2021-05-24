const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const router = express.Router();

router.get("/restaurants", async (req, res) => {
  try {
    // const {page, limit} = req.query;
    const response = await axios.get(
      "https://res.cloudinary.com/lereacteur-apollo/raw/upload/v1575242111/10w-full-stack/Scraping/restaurants.json"
    );
    let page = 1;
    let limit = 50;
    // pagination et sorting
    const results = _(response.data)
      .orderBy(["name"], ["asc"])
      .drop((page - 1) * limit)
      .take(limit)
      .value();
    // console.log(results);

    res.status(200).json(results);
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
