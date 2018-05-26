var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAM0PNq8xe3q6oml9Yj-IpQaV0_yzYnKHA'
});
	
var user = {"name": "tanay", "type" : "restaurant", 
			"location" : '330 Philip St, Waterloo ON',
			"allowed_distance" : 1000} //this should be coming from user 

var candidates = [{"name": "jerry", "type" : "any", 
			"lat": 43.46988, "lng" : -80.534309,
			"allowed_distance" : 2000}] //this should come from server as list

googleMapsClient.geocode({
  address: user["location"]
}, function(err, geo_response) {
  var data = geo_response.json.results;
  user["location"] = (data[0]["geometry"]["location"]);

  rest_data = []
  googleMapsClient.placesNearby({
    location: { lat: 43.476506, lng: -80.5388966 }, 
    radius : user["allowed_distance"], type : user["type"]
    }, function(err, nearby_response) {
     rest_data = nearby_response.json.results;
     distance(user,rest_data)
  });

});

function distance(user,rest_data){

  var current_c, current_r, user_dist, dist;
  var min_dist = 999999999;
  for (i = 0; i < rest_data.length; i++){
    current_r = rest_data[i];
    user_dist = pythagorean((current_r["geometry"]["location"]["lat"]-
    						43.476506),
    		   			  (current_r["geometry"]["location"]["lng"]+
    					  80.5388966));
    for(j = 0; j < candidates.length; j++){
    	current_c = candidates[j];
      
    	dist = pythagorean((current_r["geometry"]["location"]["lat"]-
    					current_c["lat"]),
    		   			  (current_r["geometry"]["location"]["lng"]-
    						current_c["lng"]));

    	if (user_dist + dist < min_dist && user_dist + dist < current_c["allowed_distance"]){
    		min_dist = user_dist + dist;
        min_location = {}
    		min_location["coord"] = current_r["geometry"]["location"];
        min_location["name"] = current_r["name"]    	}
    }
  }
  return min_location
}

function pythagorean(sideA, sideB){
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}
