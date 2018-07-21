
/**
 * Make requests to convert address to latlng
 * @param {string} addy
 * @param {string} api_key
 * @returns {any}
 */

module.exports = async (addy, api_key, context) => {

    var googleMapsClient = require('@google/maps').createClient({
        key: api_key,
        Promise: Promise
    });

	await googleMapsClient.geocode({'address': addy})
     .asPromise()
     .then((res) => {
         //console.log(res.json.results);
         data = res.json.results;

     })
     .catch((err) => {
         console.log(err);
         return {"error" : err}
     })
    return data;
}