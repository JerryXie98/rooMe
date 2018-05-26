const {query, squel} = require('../../src/postgress.js');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA',
    Promise: Promise
});

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
                .setFields({name: name, type: type, allowed_distance: distance, lat: lat, lng: lng})
                .toString();
    return query(insert);
}

function distance(user, rest_data, candidates) {
    var current_c, current_r, user_dist, dist;
    var min_dist = 999999999;
    for (i = 0; i < rest_data.length; i++){
        current_r = rest_data[i];
        user_dist = pythagorean((current_r["geometry"]["location"]["lat"]-
                                user["location"]["lat"]),
                                (current_r["geometry"]["location"]["lng"]-
                                user["location"]["lng"]));

        for(j = 0; j < candidates.length; j++){
            current_c = candidates[j];
        
            dist = pythagorean((current_r["geometry"]["location"]["lat"]-
                            current_c["lat"]),
                                (current_r["geometry"]["location"]["lng"]-
                                current_c["lng"]));
    
            console.log(user_dist + dist);
            console.log(min_dist);
            if (user_dist + dist < min_dist && user_dist + dist < current_c["allowed_distance"]) {
                min_dist = user_dist + dist;
                min_location = {};
                min_location["coord"] = current_r["geometry"]["location"];
                min_location["name"] = current_r["name"];    
            }
        }
    }
    console.log(min_location)
    return min_location
}

function pythagorean(sideA, sideB){
return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

/**
 * Make food buddy requests
 * @param {string} name
 * @param {string} type
 * @param {string} address
 * @param {number} distAway
 * @returns {any}
 */
module.exports = async (name, type, address, distAway, context) => {
    // Storing request in the data base
    //let out = await getMatches(type);
    //let candidates = out.rows;

    var user = {
        "name": name, 
        "type" : type, 
        "location" : address,
        "allowed_distance" : distAway
    };

    var temp = await getMatches(type);
    candidates = temp.rows;

    let rest_data = [];
    let result = {};

    await googleMapsClient.geocode({address: user["location"]})
     .asPromise()
     .then((res) => {
         console.log(res.json.results);
         var data = res.json.results;

         user["location"] = data[0]["geometry"]["location"];
     })
     .catch((err) => {
         console.log(err);
     })

    await googleMapsClient.placesNearby({location: user["location"], radius: user["allowed_distance"], type: user["type"]})
     .asPromise()
     .then((res) => {
        console.log(res.json.results);
        rest_data = res.json.results;
        result = distance(user, rest_data, candidates)
     })
     .catch((err) => {
         console.log(err);
     })

    let insert = insertAll(name, type, distAway, user["location"]["lat"], user["location"]["long"]);
     
    return result;
}