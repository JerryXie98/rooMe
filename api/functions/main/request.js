const {query, squel} = require('../../src/postgress.js');

function getAll() {
    let select = squel.select().from("food").toString();
    return query(select);
}

function insertAll(name, type, distance, lat, long) {
    let insert = squel.insert()
                .into("food")
                .setFields({name: name, type: type, distance: distance, lat: lat, long: long})
                .toString();
    return query(insert);
}

/**
 * Make food buddy request
 * @param {string} name 
 * @param {string} type
 * @param {number} distance
 * @param {number} lat
 * @param {number} long
 * @returns {any}
 */
module.exports = (name, type, distance, lat, long, context, callback) => {
    let result = insertAll(name, type, distance, lat, long);
    callback(null, 'Data inserted.');
}