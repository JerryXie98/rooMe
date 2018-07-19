const {query, squel} = require('../../lib/postgress.js');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA',
    Promise: Promise
});

/**
 * Make food buddy requests
 * @param {string} name
 * @param {string} phoneNo
 * @param {string} type
 * @param {string} address
 * @param {string} distAway
 * @returns {any}
 */
module.exports = async (name, phoneNo, type, address, distAway, context) => {
    if (context.http.method === "POST") {
        return "This is is a POST request"
    } else if (context.http.method === "GET") {
        return getAll()
    }
}

// DB Functions
function getAll() {
    let select = squel.select().from("request").toString();
    return query(select);
}