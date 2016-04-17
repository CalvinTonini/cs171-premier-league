
queue()
    .defer(d3.csv, "data/matches.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.csv, "data/season_aggregate_stats.csv")
    .await(function(error, matches, intraseason, aggregate) {

        // Data Wrangling
        matches.forEach(function (d) {
            d[""] = +d[""];
            d.FTAG = +d.FTAG;
            d.FTHG = +d.FTHG;
            d.Date = d3.time.format("%m/%d/%Y").parse(d.Date);
        });

        intraseason.forEach(function (d) {
            stringsToNumber(d);
            d.Date = d3.time.format("%Y-%m-%d").parse(d.Date);
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

        console.log(matches);
        console.log(intraseason);
        console.log(aggregate);

    });




