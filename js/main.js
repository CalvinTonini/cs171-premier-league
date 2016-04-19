

var aggregate, intraseason_chart;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var areachart;

queue()
    .defer(d3.csv, "data/matches.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.csv, "data/season_aggregate_stats.csv")
    .await(function(error, matches, intra, agg) {

        intraseason = intra;
        aggregate = agg;

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
            var keys = d3.keys(d);
            for (var i = 0; i < keys.length; i++) {
                if (!isNaN(+d[keys[i]])) {
                    d[keys[i]] = +d[keys[i]];
                }
            }
        });

        createvis();

    });

function createvis(){

    lineChart(aggregate);

    intraseason_chart = new LineChart("intra_season",intraseason);

}

function updatevars(){

    intraseason_chart.wrangleData();

}




