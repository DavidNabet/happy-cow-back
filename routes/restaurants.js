const fs = require("fs");
const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const router = express.Router();
const { haversine } = require("../utils/distance");
const User = require("../models/User");
const resto = require("../utils/restaurants.json");
const paginationMiddleware = require("../middleware/paginationMiddleware");
const getQueryParams = require("../utils/params");
const filterRestaurantsByType = require("../utils/filter");

// pagination et sorting

const HAPPY_COW_API = process.env.HAPPY_COW_API ?? "";

router.get("/restaurants", async (req, res) => {
  try {
    // Parse query params including array params
    const params = getQueryParams(req.url.split("?")[1] || "");
    const { type, rayon = 2, limit = 100, page = 1 } = params;
    console.log(params);

    // Trouve le user et récupère des restaurants
    const user = await User.findOne();
    const restaurants = resto;

    // Filtre par type
    const filteredByType = filterRestaurantsByType(
      restaurants,
      type,
      page,
      limit
    );

    // Filtre par rayon depuis la localisation du user
    const filteredByRayon = haversine(user.location, filteredByType, rayon);

    // Ajoute la pagination et le tri
    // const results = _(filteredByRayon)
    //   .drop((page - 1) * limit)
    //   .take(limit)
    //   .orderBy(["name", "rating"], ["asc", "desc"])
    //   .value();

    const results = filteredByRayon
      // .drop((page - 1) * limit)
      .slice((page - 1) * limit)
      // .take(limit)
      .slice(0, limit)
      // .orderBy(["name", "rating"], ["asc", "desc"])
      .sort((a, b) => {
        // Tri par nom en ordre croissant
        const nameCompare = a.name.localeCompare(b.name);
        if (nameCompare !== 0) return nameCompare;
        // Puis tri par rating en ordre décroissant
        return b.rating - a.rating;
      });

    res.status(200).json({
      pagination: {
        page,
        limit,
        total: filteredByRayon.length,
      },
      results,
    });
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
    }
    results = response.data;
    res.status(202).json(results);
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

router.get("/restaurants/data", paginationMiddleware, async (req, res) => {
  try {
    const { context } = req;
    // if (!context.page || !context.limit || !context.search || !context.skip)
    //   return res.status(400).json({ message: "Params missing" });
    console.log(context);
    const user = await User.findOne();
    let distance = haversine(user.location, resto, 2);
    const total = distance.length;
    const totalPages = Math.ceil(total / context.limit);
    // if (context.searchTerm) {
    //   results = user.filter(({ username }) => username.match(context.search));
    // } else {
    //   results = user;
    // }
    if (context.searchTerm) {
      distance = distance.filter(({ type }) => type.match(context.search));
    }
    const pagination = {
      currentPage: context.page,
      pageSize: context.limit,
      totalRestos: total,
      totalPages,
    };

    // results = results.slice(context.skip, context.skip + context.limit);
    res.status(200).json({
      pagination,
      data: distance,
    });
  } catch (error) {
    console.log(error.response);
    res.status(400).json({ message: error.message });
  }
});

router.get("/restaurants/params", async (req, res) => {
  try {
    const { type, rayon, limit } = req.query;
    // const user = await User.findOne();
    const params = new URLSearchParams(req.query);
    // params.set('type', JSON.stringify());
    let arrayType = params.get("type").split(",");
    // let limitParams = params.get("limit");
    // let rayonParams = params.get("rayon");
    const filterType = resto.filter(
      (x) => x.type === type || arrayType.includes(x.type)
    );

    res.status(200).json({ response: filterType });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
