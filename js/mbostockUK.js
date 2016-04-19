
function updateMap(mapData){
    var dats = mapData;
    var selected = +document.getElementById("myRange").value;
    console.log(selected);

    var subunits = topojson.feature(mapData, mapData.objects.subunits),
        places = {
            type: "FeatureCollection",
            features: topojson.feature(dats, dats.objects.places).features
                .filter(function(d){ return d.properties.seasons.includes(selected); })
        };

    var width = 380,
        height = 500;

    var projection = d3.geo.albers()
        .center([2.5, 54.0])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(600 * 5)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection)
        .pointRadius(2);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);


    var subunit1 = svg.selectAll(".subunit")
        .data(subunits.features);

    subunit1
        .enter().append("path");

    subunit1
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path);

    //svg.append("path")
    //    .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
    //    .attr("d", path)
    //    .attr("class", "subunit-boundary");
    //
    //svg.append("path")
    //    .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
    //    .attr("d", path)
    //    .attr("class", "subunit-boundary IRL");

    var subunit2 = svg.selectAll(".subunit-label")
        .data(subunits.features);

    subunit2
        .enter().append("text");

    subunit2
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    var labels = svg.selectAll(".place-label")
        .data(places.features);

    labels
        .enter().append("text");

    labels
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
        .text(function(d) { return d.properties.club; });


    var dots = svg.selectAll("circle")
        .data(places.features);

    dots.enter()
        .append("circle");

    dots
        .attr("class","place")
        .attr("fill","black")
        .attr("r",2)
        .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
        .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];})
        .on();

    labels.exit().remove();
    dots.exit().remove();
    subunit1.exit().remove();
    subunit2.exit().remove();
}
