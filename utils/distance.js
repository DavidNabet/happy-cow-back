const degreeToRadians = (value) => {
  return (value / 180) * Math.PI;
};

const distance = (lat1, lng1, lat2, lng2) => {
  // calcul du rayon de la terre: 40000 km/(2*Math.PI)
  // Rayon de la terre
  let rayonTerre = 6366;
  let radLat1 = degreeToRadians(lat1);
  let radLng1 = degreeToRadians(lng1);
  let radLat2 = degreeToRadians(lat2);
  let radLng2 = degreeToRadians(lng2);

  let distanceLongitude = radLng2 - radLng1;
  let distanceLatitude = radLat2 - radLat1;

  // récupération altitude en km
  let altitude =
    Math.pow(Math.sin(distanceLatitude / 2), 2) +
    Math.cos(radLat1) *
      Math.cos(radLat2) *
      Math.pow(Math.sin(distanceLongitude / 2), 2);

  let distanceKm = 2 * Math.atan2(Math.sqrt(altitude), Math.sqrt(1 - altitude));

  // retourne en km
  return rayonTerre * distanceKm;
};

const haversine = (maPosition, locationsResto, rayon) => {
  // let maPosition = [48.856614, 2.3522219];
  let tab = [];
  let dist;
  for (let i = 0; i < locationsResto.length; i++) {
    dist = distance(
      maPosition[0],
      maPosition[1],
      locationsResto[i].location.lat,
      locationsResto[i].location.lng
    );

    if (dist <= rayon) {
      tab.push(locationsResto[i]);
    }
  }
  return tab;
};

module.exports = {
  distance: distance,
  haversine: haversine,
};
