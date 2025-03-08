const restaurants = async (req, res) => {
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
    const response = resto;
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
          .filter(
            ({ type }) =>
              req.query.type.includes(type) || req.query.type === type
          )
          .value();
      }
      return splited;
    }

    if (!rayon) {
      rayon = rayonDefault;
    }

    if (!limit) {
      limit = limitDefault;
    }

    if (typeof req.query.type === "string") {
      resultsType = _(response)
        .drop((page - 1) * limit)
        .take(limit)
        .filter({ type: type })
        .orderBy(["name", "rating"], ["asc", "desc"])
        .value();
    } else {
      resultsType = _(response)
        .drop((page - 1) * limit)
        .take(limit)
        .orderBy(["name", "rating"], ["asc", "desc"])
        .value();
    }

    if (typeof req.query.type === "object") {
      resultsType = filterType(response);
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
};
