
queue()
    .defer(d3.csv, "data/matches.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.csv,"data/season_aggregate_stats.csv")
    .await(function(error, matches, intraseason,aggregate) {

        console.log(matches)
        console.log(intraseason)
        console.log(aggregate)

    });





