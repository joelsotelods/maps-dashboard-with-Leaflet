

var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

console.log(quakes)
console.log(plates)

console.log(API_KEY)

function markerSize(magnitude) {
    return magnitude * 5;
};

var earthquakes = new L.LayerGroup();

d3.json(quakes, function(geoJSON) {
    L.geoJSON(geoJSON.features, {
        pointToLayer: function(geoPoint, coordinates) {
            return L.circleMarker(coordinates, {radius: markerSize(geoPoint.properties.mag)
            });
        },

        style: function(geoFeature) {
            return {
                fillColor: Color(geoFeature.properties.mag),
                fillOpacity: 0.5,
                weight: 0.1,
                color: 'black'
            }
        },

        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h4 style='text-align:center;'>" + new Date(feature.properties.time) + "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    })
    .addTo(earthquakes);
    createMap(earthquakes);
});

var boundary = new L.LayerGroup();

d3.json(plates, function(geoJSON) {
    L.geoJSON(geoJSON.features, {
        style: function(geoFeature) {
            return {
                weight: 2,
                color: 'black'
            }
        },
    }).addTo(boundary);
})

function Color(magnitude) {
    if (magnitude > 5) {
        return "red"
    } else if (magnitude > 4) {
        return "orange"
    } else if (magnitude > 3) {
        return "yellow"
    } else if (magnitude > 2) {
        return "green"
    } else if (magnitude > 1) {
        return "blue"
    } else {
        return "purple"
    }
};

function createMap() {

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: API_KEY
    });

    var lightMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });

    var baseLayers = {
        "Street": streetMap,
        "Light": lightMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": boundary
    };

    var mymap = L.map('mymap', {
        center: [40, -110],
        zoom: 5,
        layers: [streetMap, earthquakes, boundary]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(mymap);
}
