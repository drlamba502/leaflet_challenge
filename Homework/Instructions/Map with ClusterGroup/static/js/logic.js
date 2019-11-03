// Creating map object
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 2
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// URL to get the earthquake data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Grab the data with d3
d3.json(url, function(response) {

//set colors from light to dark in a hex format in the list variable colors
var colors = ["#CCFFCC","#99FFFF","#3366FF","#663399","#996633","#FF0000"];

// Create a new marker cluster group
 var markers = L.markerClusterGroup();
// Loop through data
  for (var i = 0; i <(response.features.length); i++) {
    // Set the longitude, latitude, earthquake magnitude and place variables
    var lng = response.features[i].geometry.coordinates[0];
    var lat = response.features[i].geometry.coordinates[1];
    var mag = response.features[i].properties.mag;
    var place = response.features[i].properties.place;

  // set the color and size of the marker based on the magnitude of the earthquake
  var col=""
  var size=0
  if (mag <=1)
  {
    col = colors[0]
    size = 3000
  }
  if (mag > 1 && mag<=2)
  {
    col = colors[1]
    size = 4000
  }
  if (mag > 2 && mag<=3)
  {
    col = colors[2]
    size = 6000
  }
  if (mag > 3 && mag<=4)
  {
    col = colors[3]
    size = 8000
  }
  if (mag > 4 && mag<=5)
  {
    col = colors[4]
    size = 10000
  }
if (mag > 5)
  {
    col = colors[5]
    size = 12000
  }
// Add a new marker to the cluster group and bind a pop-up
  if ([lat, lng]){
        markers.addLayer(
        L.circle([lat, lng], {
            color: col,
            fillColor: col,
            fillOpacity: 0.75,
            radius: size
        }).bindPopup(place+"<BR> <BR> Magnitude: "+ mag));
     }
  }
  // Add our marker cluster layer to the map
  myMap.addLayer(markers);

 // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["0-1","1-2","2-3","3-4","4-5","5+"];
    var labels = [];
    var legendInfo = "<B>Intensity Scale</B>" +
      "<div class=\"labels\">" +
      "</div>";
    div.innerHTML = legendInfo;
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">"+limit+"</li>");
    });
    div.innerHTML += "<ul style=\"list-style-type:none\">" + labels.join("") + "</ul>";
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);
});

