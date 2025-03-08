const getQueryParams = (query) => {
  let params = {};
  new URLSearchParams(query).forEach((value, key) => {
    let decodedKey = decodeURIComponent(key);
    let decodedValue = decodeURIComponent(value);
    // This key is part of an array
    if (decodedKey.endsWith("[]")) {
      decodedKey = decodedKey.replace("[]", "");
      params[decodedKey] || (params[decodedKey] = []);
      params[decodedKey].push(decodedValue);
      // Just a regular parameter
    } else if (!isNaN(decodedValue)) {
      params[decodedKey] = parseInt(decodedValue);
    } else {
      params[decodedKey] = decodedValue;
    }
  });

  return params;
};

console.log(getQueryParams("?b[]=1&b[]=2&a=abc&c[]=1&d=3"));
module.exports = getQueryParams;
