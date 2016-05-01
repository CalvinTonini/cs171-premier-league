
var widthy = 600,
    heighty = 800;

var projection = d3.geo.albers()
    .center([2.5, 54.0])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(600 * 10)
    .translate([widthy / 2, heighty / 2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

var zoom = d3.behavior.zoom()
    .scaleExtent([1,5])
    .on("zoom", zoomed);

var svg1 = d3.select("#map").append("svg")
    .attr("width", widthy)
    .attr("height", heighty);

var g = svg1.append("g");

var aggregate, intraseason_chart, interseason_chart;

var currentColor = "black";


var mapData,logosData;

var tips = d3.select("#map").append("div").attr("class","tooltip hidden");

//var tips = d3.tip().attr('class', 'd3-tip').html(function(d) {
//    return "<strong>"+d.properties.club+"</strong> <br/> <span style='color:red'>" + d.properties.name + "</span>";
//});
//tips.offset([-10, 0]);
//svg1.call(tips);



queue()
    .defer(d3.csv,"data/season_aggregate_stats.csv")
    .defer(d3.csv, "data/eamon.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.json,"data/tsconfig.json")
    .defer(d3.json,"data/logos.json")
    .await(function(error, agg,matches, intra, mapJson, logosJson) {


        intraseason = intra;
        aggregate = agg;
        mapData = mapJson;
        matchData = matches;
        logosData = logosJson;
        //matchData = matches;


        //matches.forEach(function (d) {
        //    d[""] = +d[""];
        //    d.FTAG = +d.FTAG;
        //    d.FTHG = +d.FTHG;
        //    d.Date = d3.time.format("%m/%d/%Y").parse(d.Date);
        //});

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

    season_matrix = new matrix_object("matrix-area",matchData);

    updateMap();

}

function updatevars(){

    intraseason_chart.wrangleData();
    bar_chart.wrangleData();
    interseason_chart.wrangleData();
    
}

function sliderUpdate(){

    updateMap();
    //matrix("matrix-area",matchData);
    //matrix.prototype.initVis(matchData);
    intraseason_chart.wrangleData();
    bar_chart.wrangleData();
    season_matrix.wrangleData();

}


function highlightTeam(unformatted_team){

    var team = unformatted_team.replace(/ +/g, "");
    intraseason_chart.svg.selectAll("#"+team).transition().style("stroke","yellow").style("opacity",.6);
    // interseason_chart.svg.selectAll("#"+team).transition().style({
    //    opacity: 1,
    //    "stroke-width": 5
    //});
    bar_chart.svg.selectAll("#"+team).transition().attr("fill","yellow");
    //svg_cells.selectAll("#"+team).attr("stroke","yellow").attr("stroke-width","3");
}

function unhighlightTeam(unformatted_team){

    var team = unformatted_team.replace(/ +/g, "");
    intraseason_chart.svg.selectAll("#"+team).transition().style("stroke", function (d) {
            return maincolor(d.key);
        });
    // interseason_chart.svg.selectAll("#"+team).transition().style("opacity",".4").style("stroke-width","2px");
    bar_chart.svg.selectAll("#"+team).transition().attr("fill", function(d) { return maincolor(d.Team)}).style("opacity",.6);
    //svg_cells.selectAll("#"+team).attr("stroke","grey").attr("stroke-width","1");
}

function highlightGame(game_id){

    console.log(game_id);

    intraseason_chart.svg.selectAll("#game"+game_id).transition().attr("r","20");

    //interseason_chart.svg.selectAll("#"+team).transition().style({
    //    opacity: 1,
    //    "stroke-width": 5
    //});
    //bar_chart.svg.selectAll("#"+team).transition().attr("fill","yellow");

    console.log(d3.select("#matrix-area").selectAll("#game"+game_id));
    d3.select("#matrix-area").selectAll("#game"+game_id).transition().attr("fill","yellow");
}

function unhighlightGame(game_id){

    console.log(game_id);

    //intraseason_chart.svg.selectAll("#"+team).transition().style("stroke", function (d) {
    //    return maincolor(d.key);
    //});
    //interseason_chart.svg.selectAll("#"+team).transition().style("opacity",".4").style("stroke-width","2px");
    //bar_chart.svg.selectAll("#"+team).transition().attr("fill", function(d) { return maincolor(d.Team)}).style("opacity",.6);
    ////svg_cells.selectAll("#"+team).attr("stroke","grey").attr("stroke-width","1");
}

function updateMap(){

    var dats = mapData;
    var dat1 = logosData;


    var selected = $( "#slider" ).labeledslider( "option", "value" );

    console.log(selected);


    //var selected = +document.getElementById("myRange").value;

    var subunits = topojson.feature(logosData, logosData.objects.subunits),
        places = {
            type: "FeatureCollection",
            features: topojson.feature(dat1, dat1.objects.places).features
                .filter(function(d){ return d.properties.seasons.includes(selected+1); })
        };


    var subunit1 = g.selectAll(".subunit")
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

    var subunit2 = g.selectAll(".subunit-label")
        .data(subunits.features);

    subunit2
        .enter().append("text");

    subunit2
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    //var dots = g.selectAll("circle")
    //    .data(places.features,function(d){ return d.properties.name;});
    //
    //dots.attr("class","update")
    //    .transition()
    //    .duration(2000)
    //    .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
    //    .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];});

    //dots.enter().append("circle")
    //    .attr("class","enter")
    //    .attr("class","place")
    //    .attr("fill","black")
    //    .attr("r",0)
    //    .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
    //    .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];})
    //    .transition()
    //    .duration(2000)
    //    .attr("r",4);
    var logos = g.selectAll("image")
        .data(places.features,function(d){ return d.properties.name});

    logos.attr("x",function(d){ return projection(d.geometry.coordinates)[0];})
        .attr("y",function(d){ return projection(d.geometry.coordinates)[1];});

    logos.enter().append("image")
        .attr("class","enter")
        .attr("id", function(d){ return d.properties.team;})
        .attr("xlink:href", function(d){ return 'data/logos/' + d.properties.team + '.png';})
        .attr("width","0")
        .attr("height","0")
        .attr("x",function(d){ return projection(d.geometry.coordinates)[0];})
        .attr("y",function(d){ return projection(d.geometry.coordinates)[1];})
        .transition()
        .duration(800)
        .attr("height", 25 / zoom.scale())
        .attr("width", 25 / zoom.scale());

    logos.on("mousemove", function(d,i) {
            var mouse = d3.mouse(svg1.node()).map( function(d) { return parseInt(d); } );
            tips
                .classed("hidden", false)
                .attr("style", "left:"+(mouse[0])+"px;top:"+(mouse[1])+"px")
                .html(d.properties.club)
        })
        .on("mouseout",  function(d,i) {
            tips.classed("hidden", true)
        });

    //dots.on("mousemove", function(d,i) {
    //        var mouse = d3.mouse(svg1.node()).map( function(d) { return parseInt(d); } );
    //        tips
    //            .classed("hidden", false)
    //            .attr("style", "left:"+(mouse[0])+"px;top:"+(mouse[1])+"px")
    //            .html(d.properties.club)
    //    })
    //    .on("mouseout",  function(d,i) {
    //        tips.classed("hidden", true)
    //    })
    //    .on('click',function(d) {
    //        currentColor = currentColor == "black" ? "yellow" : "black";
    //        d3.selectAll("circle").style("fill","black");
    //        places.features.forEach(function(d){
    //            unhighlightTeam(d.properties.team);
    //        });
    //        if(currentColor == "yellow"){
    //            d3.select(this).style("fill", currentColor);
    //            highlightTeam(d.properties.team)
    //        }
    //        else{
    //            unhighlightTeam(d.properties.team)
    //        }
    //    });

    //dots.exit()
    //    .transition()
    //    .duration(2000)
    //    .attr("r", 0)
    //    .remove();

    logos.exit().transition().duration(1000).attr("height",0).attr("width",0).remove();
    subunit1.exit().remove();
    subunit2.exit().remove();

    d3.select("#sliderlabel").text(selected);


}

function zoomed() {
    var t = d3.event.translate;
    var s = d3.event.scale;
    var h = heighty / 3;
    var w = widthy / 4;

    t[0] = Math.min(widthy / 2 * (s - 1) + w * s, Math.max(widthy / 2 * (1 - s) - w * s, t[0]));
    t[1] = Math.min(heighty / 2 * (s - 1) + h * s, Math.max(heighty / 2 * (1 - s) - h * s, t[1]));

    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    //g.selectAll("circle")
    //    .attr("r", function() {
    //        var self = d3.select(this);
    //        var r = 4 / d3.event.scale;
    //        self.style("stroke-width", r < 4 ? (r < 2 ? 0.5 : 1) : 2);
    //        return r;
    //    });
    g.selectAll("image")
        .attr("height", function(){
            //var self = d3.select(this);
            var h = 25 / d3.event.scale;
            //h = (h < 8  ? 5 : h)
            //(h < 20 ? (w < 10 ? (h < 5 ? 5 : 10) : 15) : 25) : 30);
            return h;
        })
        .attr("width", function() {
            //var self = d3.select(this);
            var w = 25 / d3.event.scale;
            //w = (w < 8 ? 5 : w)
            //(w < 20 ? (w < 10 ? (w < 5 ? 5 : 10) : 15) : 25) : 30);
            return w;
        });
}

svg1.call(zoom);
