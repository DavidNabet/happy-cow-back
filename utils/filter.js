const filterRestaurantsByType = (restaurants, type, page, limit) => {
  if (!type) return restaurants;

  if (Array.isArray(type)) {
    return restaurants.filter((restaurant) => type.includes(restaurant.type));
  }

  return restaurants.filter((restaurant) => restaurant.type === type);
};

export default filterRestaurantsByType;
