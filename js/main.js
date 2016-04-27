
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


var toggle = false;
var currentTeam = "Arsenal";

var mapData;

var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
    return "<strong>"+d.properties.club+"</strong> <br/> <span style='color:red'>" + d.properties.name + "</span>";
});
tip.offset([-10, 0]);
svg1.call(tip);

queue()
    .defer(d3.csv,"data/season_aggregate_stats.csv")
    .defer(d3.csv, "data/matchesDates.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.json,"data/tsconfig.json")
    .await(function(error, agg, matches, intra, mapJson) {


        intraseason = intra;
        aggregate = agg;
        mapData = mapJson;
        matchData = matches;


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

    interseason_chart = new lineChart("across_season", aggregate);

    intraseason_chart = new LineChart("intra_season",intraseason);

    bar_chart = new BarChart("bar_chart",aggregate);

    updateMap();

}

function updatevars(){

    intraseason_chart.wrangleData();
    bar_chart.wrangleData();
    interseason_chart.wrangleData();


}

function mapupDate(){

    updateMap();
    intraseason_chart.wrangleData();
    bar_chart.wrangleData();

}


function highlightTeam(unformatted_team){
    var team = unformatted_team.replace(/ +/g, "")
    intraseason_chart.svg.selectAll("#"+team).style("stroke","yellow");
    interseason_chart.svg.selectAll("#"+team).style({
        opacity: 1,
        "stroke-width": 5
    });
    bar_chart.svg.selectAll("#"+team).attr("fill","yellow");
    svg_cells.selectAll("#"+team).attr("stroke","yellow").attr("stroke-width","3");

}

function unhighlightTeam(unformatted_team){
    var team = unformatted_team.replace(/ +/g, "")
    intraseason_chart.svg.selectAll("#"+team).style("stroke", function (d) {
            return intraseason_chart.maincolor(d.key);
        });
    interseason_chart.svg.selectAll("#"+team).style({
        opacity: 0.4,
        "stroke-width": 1
    });
    bar_chart.svg.selectAll("#"+team).attr("fill", function(d) { return bar_chart.maincolor(d.Team)});
    svg_cells.selectAll("#"+team).attr("stroke","grey").attr("stroke-width","1");
}

function updateMap(){

    var dats = mapData;
    var selected = +document.getElementById("myRange").value;

    var subunits = topojson.feature(mapData, mapData.objects.subunits),
        places = {
            type: "FeatureCollection",
            features: topojson.feature(dats, dats.objects.places).features
                .filter(function(d){ return d.properties.seasons.includes(selected+1); })
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

    var dots = svg1.selectAll("circle")
        .data(places.features);

    dots.enter()
        .append("circle");

    dots.transition()
        .duration(800)
        .attr("class","place")
        .attr("fill","black")
        .attr("r",4)
        .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
        .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];});

    dots.on('mouseover',tip.show)
        .on('mouseout',tip.hide)
        .on('click',function(d) {
            toggle = !toggle;
            var testInput = d.properties.team;
            d3.selectAll("circle").style("fill","black");
            places.features.forEach(function(d){
               unhighlightTeam(d.properties.team);
            });
            if(toggle || (testInput != currentTeam)){
                toggle = false;
                d3.select(this).style("fill","yellow");
                highlightTeam(d.properties.team);
            }
            else{
                d3.select(this).style("fill","black");
                unhighlightTeam(d.properties.team);
            }

        });

    dots.exit().remove();
    subunit1.exit().remove();
    subunit2.exit().remove();

    d3.select("#sliderlabel").text(selected);


}