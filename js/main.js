
var widthy = 380,
    heighty = 500;

var projection = d3.geo.albers()
    .center([2.5, 54.0])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(600 * 5)
    .translate([widthy / 2, heighty / 2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var svg1 = d3.select("#map").append("svg")
    .attr("width", widthy)
    .attr("height", heighty);

var aggregate, intraseason_chart;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var areachart,mapData;


queue()
    .defer(d3.csv, "data/matches.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.csv,"data/season_aggregate_stats.csv")
    .defer(d3.json,"data/tsconfig.json")
    .await(function(error, matches, intra, agg, mapJson) {

        intraseason = intra;
        aggregate = agg;
        mapData = mapJson;

        intraseason.forEach(function(d) {

            for (var name in d){
                if(name!="Date" && name != "Team" && name!="Season"){
                    d[name] = +d[name]
                }
            }
            d.Date = parseDate(d.Date)

        });


        matches.forEach(function (d) {
            d[""] = +d[""];
            d.FTAG = +d.FTAG;
            d.FTHG = +d.FTHG;
            d.Date = d3.time.format("%m/%d/%Y").parse(d.Date);
        });

        aggregate.forEach(function (d) {
            stringsToNumber(d);
        });

        function stringsToNumber (object) {
            var keys = d3.keys(object);
            for (var i = 0; i < keys.length; i++) {
                if (!isNaN(+object[keys[i]])) {
                    object[keys[i]] = +object[keys[i]];
                }
            }
        }
        createvis();
    });

function createvis(){

    lineChart(aggregate);

    intraseason_chart = new LineChart("intra_season",intraseason);
    updateMap();

}

function updatevars(){

    console.log("asdfs");
    intraseason_chart.wrangleData();

}

function updateMap(){
    var dats = mapData;
    var selected = +document.getElementById("myRange").value;

    var subunits = topojson.feature(mapData, mapData.objects.subunits),
        places = {
            type: "FeatureCollection",
            features: topojson.feature(dats, dats.objects.places).features
                .filter(function(d){ return d.properties.seasons.includes(selected); })
        };


    var subunit1 = svg1.selectAll(".subunit")
        .data(subunits.features);

    subunit1
        .enter().append("path");

    subunit1
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path);

    //svg1.append("path")
    //    .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
    //    .attr("d", path)
    //    .attr("class", "subunit-boundary");
    //
    //svg1.append("path")
    //    .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
    //    .attr("d", path)
    //    .attr("class", "subunit-boundary IRL");

    var subunit2 = svg1.selectAll(".subunit-label")
        .data(subunits.features);

    subunit2
        .enter().append("text");

    subunit2
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    var labels = svg1.selectAll(".place-label")
        .data(places.features);

    labels
        .enter().append("text");

    labels.transition()
        .duration(800)
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates) + ")"; })
        .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; })
        .text(function(d) { return d.properties.club; });


    var dots = svg1.selectAll("circle")
        .data(places.features);

    dots.enter()
        .append("circle");

    dots.transition()
        .duration(800)
        .attr("class","place")
        .attr("fill","black")
        .attr("r",2)
        .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
        .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];});

    labels.exit().remove();
    dots.exit().remove();
    subunit1.exit().remove();
    subunit2.exit().remove();
}