
/* GeoJson URL */
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"

// Retrieve data in json through d3 and transform into markers for layers
d3.json(geoData).then(function(data) {

//    L.geoJson(data).addTo(myMap);

    let f_data = data.features;
    console.log("Features:",f_data);

    // Empty list to call in loop
    let coordinates = [];
    let mag = [];
    let depth = [];

    // Empty list to hold markers and circles
    let e_circles = [];
    let e_markers = [];
    
    for (let i = 0; i < f_data.length; i++) {
        coordinates.push([f_data[i].geometry.coordinates[1],f_data[i].geometry.coordinates[0]]);
        depth.push(f_data[i].geometry.coordinates[2]);
        mag.push(f_data[i].properties.mag);
        
        
        /* Conditionals for color depending on depth */
        var color = "";
        if (depth[i] > 90) {
            color = "purple";
        }
        else if (depth[i] > 70) {
            color = "red";
        }
        else if (depth[i] > 50) {
            color = "orange";
        }
        else if (depth[i] > 30) {
            color = "yellow";
        }
        else if (depth[i] > 10) {
            color = "yellowgreen";
        }
        else {
            color = "green";
        }

        // Appending markers into lists
        e_markers.push (
            L.marker(coordinates[i], {
                }).bindPopup(`<h1>${f_data[i].properties.place}</h1> <hr> <h3> Magnitude: ${f_data[i].properties.mag}</h3>`)
            );
         
        e_circles.push( 
            L.circle(coordinates[i], {
                    
                fillOpacity: 0.65,
                color: "white",
                fillColor: color,

                /* Adjusting radius */
                radius: mag[i] * 25000
                    }).bindPopup(`<h1>${f_data[i].properties.place}</h1> <hr> <h3> Magnitude: ${f_data[i].properties.mag}</h3>`)
            )
        };

    /* Map */
 
    // Base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
      
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
        });
      
    // baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
     
    // Lists into layer groups
    let marker_layer = L.layerGroup(e_markers);
    let circle_layer = L.layerGroup(e_circles);
    
    // Overlay object to hold our overlay
    let overlayMaps = {
        "Markers": marker_layer,
        "Circles": circle_layer
    };
      
    // Default map
    let myMap = L.map("map", {
        center: [41.515111142650824, -112.22313302713114],
        zoom: 4,
        layers: [street, circle_layer]
    });
      
    // Layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);    
    
    /*Legend*/
    function getColor(d) {
        return d > 90 ? "purple" :
            d > 70  ? "red" :
            d > 50  ? "orange" :
            d > 30  ? "yellow" :
            d > 10   ? "yellowgreen" :
                    "green";
    }

    let legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function(myMap) {
        let div = L.DomUtil.create("div", "info legend"),
            grades = [0, 10, 30, 50, 70, 90],
            labels = ["<strong> Magnitude </strong>"],
            from, to;
        for (let i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];
            labels.push(
                "<i style='background:" + getColor(from + 1) + "'></i>" + from + (to ? "&ndash;" + to: "+"));
        }    
        div.innerHTML = labels.join("<br>");
        return div;
        };

        legend.addTo(myMap);
        }
    );