function averageCoord(northEast, southWest) {
    return {
        lat: (northEast.lat + southWest.lat) / 2.0,
        lng: (northEast.lng + southWest.lng) / 2.0
    }
} 

/**
 * Make requests to convert address to latlng
 * @param {string} address
 * @returns {any}
 */

module.exports = async (address,  context) => {

    var googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA',
        Promise: Promise
    });

	await googleMapsClient.geocode({address: address})
     .asPromise()
     .then((res) => {
         if (res.json.results.length !== 1) {
             return {
                 "error":  "Error parsing address to geo-code"
             }
         } else {
             const bounds = res.json.results[0].geometry.bounds
             data = averageCoord(bounds.northeast, bounds.southwest)
         }
         return data
     })
     .catch((err) => {
         console.log(err);
         return {"error" : err}
     })
}