var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA',
    Promise: Promise
});

const {query, squel} = require('../../src/postgress.js');

function getAll() {
    let select = squel.select().from("food").toString();
    return query(select);
}

function getMatches(type) {
    let select = squel.select().where("type = '" + type + "'").from("food").toString();
    return query(select);
}

function insertAll(name, type, distance, lat, lng) {
    let insert = squel.insert()
                .into("food")
                .setFields({name: name, type: type, distance: distance, lat: lat, lng: lng})
                .toString();
    return query(insert);
}

/**
 * Make food buddy requests
 * @returns {any}
 */
module.exports = async (context) => {
    // Storing request in the data base
    //let out = await getMatches(type);
    //let candidates = out.rows;
    //let q1 = insertAll('Joey', 'restaurant', 2000, 43.46988, -80.534309);
    let q2 = await getAll();

    return q2.rows;
}