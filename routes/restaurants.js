const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const router = express.Router();

// Les 100 premiers résultats
// Ils doivent être filtrés par rapport à la géolocalisation du telephone
// On commencera par les plus pertinents

// pagination et sorting
router.get("/restaurants", async (req, res) => {
  try {
    // const {page, limit} = req.query;
    const { type } = req.query;
    const response = await axios.get(process.env.HAPPY_COW_API);
    let page = 1;
    let limit = 100;
    let results;

    // Filtre par type
    if (type) {
      results = _(response.data)
        .filter({ type: type })
        .orderBy(["name"], ["asc"])
        .drop((page - 1) * limit)
        .take(limit)
        .value();
    }

    results = _(response.data)
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

router.get("/restaurant/:id", async (req, res) => {
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

module.exports = router;
