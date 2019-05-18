var quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
console.log(quakes)
var plates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log(plates)


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
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    });
});