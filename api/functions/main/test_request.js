//https://googlemaps.github.io/google-maps-services-js/docs/GoogleMapsClient.html

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
    let selectStr = squel.select().where("type = '" + type + "'").from("food").toString();
    return query(selectStr);
}

function insertRe(name, phone, type, distance, lat, lng) {
    let insertStr = squel.insert()
                .into("food")
                .setFields({name: name, phone: phoneNo, type: type, allowed_distance: distance, lat: lat, lng: lng})
                .toString();
    return query(insertStr);
}

function deleteRe(name) {
    let delStr = squel.delete()
                .from("food")
                .where("name = '" + name + "'").toString();
    return query(delStr);
}

function distance(user, rest_data, candidates, type) {
    var current_c, current_place, dist_to_user, dist_to_can;
    var min_dist = 999999999;
    var type_match = false;
    var result_list = [];
    for (i = 0; i < rest_data.length; i++){
        current_place = rest_data[i];
        dist_to_user = pythagorean((current_place["geometry"]["location"]["lat"]-
                                user["location"]["lat"]),
                                (current_place["geometry"]["location"]["lng"]-
                                user["location"]["lng"]));

        for(j = 0; j < candidates.length; j++){
            current_c = candidates[j];
        
            dist_to_can = pythagorean((current_place["geometry"]["location"]["lat"]-
                                current_c["lat"]),
                                (current_place["geometry"]["location"]["lng"]-
                                current_c["lng"]));
    
            if (current_c["type"] == "any" || user["type"] == "any" || match(current_c["type"], type)) {

              type_match = true;

                if (dist_to_can < current_c["allowed_distance"]) {
                    var location = {};
                    location["coord"] = current_place["geometry"]["location"];
                    location["name"] = current_place["name"];
                    location["friend"] = current_c["name"];
                    location["phone"] = current_c["phone"];
                    location["type"] = current_place["types"];
                    location["distance"] = dist_to_can + dist_to_user;
                    result_list.push(location);
                }
            }
        }
    }
    if (!type_match){
        return {"Error" : "No match, try changing your type of place"}
    }
    if (result_list.length == 0) {
        return {"Error" : "No match, try expanding your distance"}
    }

    
    sorted_result = result_list.sort(function(first,second){
        return first.distance - second.distance
    });

    output = {"list_of_locations" : sorted_result};

    return output
}

function pythagorean(sideA, sideB){
return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function match(typeA, typeB) {
    
    for(var i = 0; i < typeA.length; i++ ){
        if(typeA[i] == typeB){
            return true
        }
    }
    return false
}
/**
 * Make food buddy requests
 * @param {string} name
 * @param {number} phoneNo
 * @param {string} type
 * @param {string} address
 * @param {number} distAway
 * @returns {any}
 */
module.exports = async (name, phoneNo, type, address, distAway, context) => {
    // Storing request in the data base
    //let out = await getMatches(type);
    //let candidates = out.rows;

    var user = {
        "name": name, 
        "type" : type, 
        "location" : address,
        "allowed_distance" : distAway,
        "phoneNo" : phoneNo
    };

    //var temp = await getMatches(type);
    //candidates = temp.rows;
    candidates = [{
        "name": "test",
        "type": "any",
        "lat" : 43.476506,
        "lng" : -80.538897,
        "allowed_distance" : 1000
    }];

    let rest_data = [];
    let result = {};
    let lat = {};
    let lng = {};

    await googleMapsClient.geocode({address: user["location"]})
    .asPromise()
    .then((res) => {
        console.log(res.json.results);
        var data = res.json.results;
        user["location"] = data[0]["geometry"]["location"];
        lat = user["location"]["lat"];
        lng = user["location"]["lng"];

    })
    .catch((err) => {
        console.log(err);
        return {"error" : err}
    })
    result = {};
    if (user["type"] != "any"){
        
        for(var i = 0; i < user["type"].length; i++){
            await googleMapsClient.placesNearby({location: user["location"], radius: user["allowed_distance"], type: user["type"][i]})
            .asPromise()
            .then((res) => {
                console.log(res.json.results);
                rest_data = res.json.results;
                //result = res.json;
                result[user["type"][i]] = distance(user, rest_data, candidates, user["type"][i]);
                })
                .catch((err) => {
                    console.log(err);
                    return {"error" : err}
                })
        }
    }
    else {
        await googleMapsClient.placesNearby({location: user["location"], radius: user["allowed_distance"]})
        .asPromise()
        .then((res) => {
            console.log(res.json.results);
            rest_data = res.json.results;
            //result = res.json;
            result = distance(user, rest_data, candidates);
            })
            .catch((err) => {
                console.log(err);
                return {"error" : err}
            })
        }
        
     if (Object.keys(result).includes("Error")){
        return result
     }
    /*if (result.length === 0) {
        let ins = await insertRe(name, phoneNo, type, distAway, lat, lng);
        return "Hold tight, we are waiting for a match!"
    } else {
        let del = await deleteRe(name);
    }*/
    
    return result
}