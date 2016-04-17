var width = 380,
    height = 500;

var projection = d3.geo.albers()
    .center([2.5, 54.0])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(600 * 5)
    .translate([width / 2, height / 2]);

//console.log(transformation([-4.629,55.458]));
//console.log(untransform([5868,5064]));

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

var mapData;
var premData;

queue()
    .defer(d3.json, "johntemp/tsconfig.json")
    .defer(d3.csv, "johntemp/currentprem.csv")
    .await(function(error, mapJson, premierDataCsv){

        // --> PROCESS DATA
        mapData = mapJson;
        premData = premierDataCsv;

        // Update map
        updateMap();
    });

function updateMap(){
    var subunits = topojson.feature(mapData, mapData.objects.subunits),
        places = {
            type: "FeatureCollection",
            features: topojson.feature(mapData, mapData.objects.places).features
                .filter(function(d){ return d.properties.seasons.includes(2014); })
    };

    //var place3 = {
    //    type: "FeatureCollection",
    //    features: places.features.filter(function(d){ return d.properties.seasons.includes(2016); })
    //};

    //console.log(place3);

    var teamDataBySeason = [];
    premData.forEach(function(d){
        // Convert numeric values to 'numbers'
        teamDataBySeason.push({
            type: "Feature",
            geometry:{
                type: "Point",
                coordinates: [+d.lon, +d.lat]
            },
            properties: {name: d.club}
        });
    });

    var place2 = {
        type:"FeatureCollection",
        features: teamDataBySeason
    };

    console.log(places);
    console.log(places.features);
    console.log(place2.features);


    svg.selectAll(".subunit")
        .data(subunits.features)
        .enter().append("path")
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    svg.append("path")
        .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary IRL");

    svg.selectAll(".subunit-label")
        .data(subunits.features)
        .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    svg.append("path")
        .datum(places)
        .attr("d", path)
        .attr("class", "place");

    svg.selectAll(".place-label")
        .data(places.features)
        //.data(teamDataBySeason)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
        .text(function(d) { return d.properties.club; });
        //.text("test");



}

function transformation(thing) {
    return [(thing[0]+13.69131425699993)/0.001546403012701271,
        (thing[1]-49.90961334800009)/0.001093936704870480];
}

function untransform(thing) {
    return [(thing[0]*0.001546403012701271)-13.69131425699993,
        (thing[1]*0.001093936704870480)+49.90961334800009];
}