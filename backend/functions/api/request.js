const {query, squel} = require('../../lib/postgress.js');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA',
    Promise: Promise
});

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
    let result = {}

    if (context.http.method === "POST") {

        if (!context.params.lat || !context.params.lng) {
            return {"error": "Missing coordinate parameter."}
        } else {
            user.lat = context.params.lat
            user.lng = context.params.lng
        }
        
        await db_insert(user)
        .then( (res) => { 
            result =  {"success": res } 
        })
        .catch( (err) => { 
            result = {"error": err } 
        });

        return result
    }

    // GET Request to find match based on user input
    if (context.http.method === "GET") {
        //var temp = await getMatches(type);
        //candidates = temp.rows;
        candidates = [{
            "name": "Fake Person",
            "type": "bar",
            "lat" : 43.476506,
            "lng" : -80.538897,
            "allowed_distance" : 1000,
            "phone": 5559876543
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
            return {"error" : err};
        })

        await googleMapsClient.placesNearby({location: user["location"], radius: user["allowed_distance"], type: user["type"]})
        .asPromise()
        .then((res) => {
            console.log(res.json.results);
            rest_data = res.json.results;

            result = distance(user, rest_data, candidates);
        })
        .catch((err) => {
            console.log(err);
            return {"error" : err};
        })
        
        if (Object.keys(result).includes("Error")){
            return result;
        }
        /*if (result.length === 0) {
            let ins = await insertRe(name, phoneNo, type, distAway, lat, lng);
            return "Hold tight, we are waiting for a match!"
        } else {
            let del = await deleteRe(name);
        }*/
        return result
    }
}
function get_overall_score(dist, rating, price) {

    if (price == -1){
        return (rating * 0.5 - dist * 0.5)
    }
    else {
        return (rating*0.4 - dist*0.4 + (price - 3)*0.2)
    }

}

function get_places_only(user, rest_data){

    var dist_to_user, rating, price_level, score;
    var result_list = [];

    for (i = 0; i < rest_data.length; i++){
        current_place = rest_data[i];
        dist_to_user = pythagorean((current_place["geometry"]["location"]["lat"]-
                                user["location"]["lat"]),
                                (current_place["geometry"]["location"]["lng"]-
                                user["location"]["lng"]));
        rating = current_place["rating"];
        if (current_place["price_level"]){
            price_level = current_place["price_level"];
        }
        else{
            price_level = -1;
        }

        location = {};
        score = get_overall_score(dist_to_user, rating, price_level);  
        location["coord"] = current_place["geometry"]["location"];
        location["name"] = current_place["name"];
        //location["price_level"] = price_level;
        location["score"] = score; 

        if (rest_data.hasOwnProperty('opening_hours')){
            if(rest_data["opening_hours"]["open_now"]){
                location["open_now"] = true;
                result_list.push(location);
            }
        }
        else{
            result_list.push(location)
        }
        
    }
    sorted_result = result_list.sort(function(first,second){
        return second.score - first.score
    });

    output = {"list_of_locations" : sorted_result};

    return output;

}

// Main distance algorithm to find matches between candidates
function distance(user, rest_data, candidates) {
    var current_c, current_place, dist_to_user, dist_to_can;
    var min_dist = 999999999;
    var result_list = [];
    if (rest_data.length == 0){
        return {"Error" : "No places found near you. Try expanding distance or choose other types."}
    }
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
    
            if (current_c["type"] == "any" || user["type"] == "any" || current_c["type"] == user["type"]){

                if (dist_to_can < current_c["allowed_distance"]) {
                    var location = {};
                    location["coord"] = current_place["geometry"]["location"];
                    location["name"] = current_place["name"];
                    location["friend"] = current_c["name"];
                    location["phone"] = current_c["phone"];
                    location["distance"] = dist_to_can + dist_to_user;
                    result_list.push(location);
                }
            }
        }
    }

    if (result_list.length == 0) {
        //return {"Error" : "No match, try expanding your distance"}
        return get_places_only(user, rest_data);
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

// DB Functions
function getAll() {
    let select = squel.select().from("request").toString();
    return query(select);
}

function getMatches(type) {
    let selectStr = squel.select().where("type = '" + type + "'").from("request").toString();
    return query(selectStr);
}

function db_insert(user) {
    let insertStr = squel.insert()
                .into("request")
                .setFields({name: user.name, phone: user.phoneNo, type: user.type, distance: user.allowed_distance, lat: user.lat, lng: user.lng})
                .toString();
    return query(insertStr);
}

function deleteRe(name) {
    let delStr = squel.delete()
                .from("request")
                .where("name = '" + name + "'").toString();
    return query(delStr);
}