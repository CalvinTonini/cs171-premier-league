
var aggregate, intraseason_chart, interseason_chart, map;

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

    map = new UKmap(mapData, logosData);

}

function updatevars(){

    intraseason_chart.wrangleData();
    bar_chart.wrangleData();
    interseason_chart.updateVis();
    
}

function sliderUpdate(){

    map.updateMap();
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

var old_game_id= -1;

function highlightGame(game_id){

    unhighlightGame(old_game_id);

    old_game_id = game_id;

    console.log(game_id);

    intraseason_chart.svg.selectAll("#game"+game_id).transition().attr("r","20");

    //interseason_chart.svg.selectAll("#"+team).transition().style({
    //    opacity: 1,
    //    "stroke-width": 5
    //});
    //bar_chart.svg.selectAll("#"+team).transition().attr("fill","yellow");

    console.log(d3.select("#matrix-area").selectAll("#game"+game_id));
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"blue").transition().attr("fill","yellow");
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"red").transition().attr("fill","yellow");
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"grey").transition().attr("fill","yellow");
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"lightgrey").transition().attr("fill","yellow");
}

function unhighlightGame(game_id){

    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"blue").transition().attr("fill","#72BCD4");
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"red").transition().attr("fill","#FF9999");
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"grey").transition().attr("fill","grey");
    d3.select("#matrix-area").selectAll("rect").filter("#game"+game_id +"lightgrey").transition().attr("fill","lightgrey");


    //intraseason_chart.svg.selectAll("#"+team).transition().style("stroke", function (d) {
    //    return maincolor(d.key);
    //});
    //interseason_chart.svg.selectAll("#"+team).transition().style("opacity",".4").style("stroke-width","2px");
    //bar_chart.svg.selectAll("#"+team).transition().attr("fill", function(d) { return maincolor(d.Team)}).style("opacity",.6);
    ////svg_cells.selectAll("#"+team).attr("stroke","grey").attr("stroke-width","1");
}