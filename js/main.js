

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.cummulative_TotalPoints); });

var svg = d3.select("#intra_season").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var alldata = {}


queue()
    .defer(d3.csv, "data/matches.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.csv,"data/season_aggregate_stats.csv")
    .await(function(error, matches, intraseason,aggregate) {

        //console.log(intraseason);

        intraseason.forEach(function(d) {

            for (var name in d){
                if(name!="Date" && name != "Team" && name!="Season"){
                    d[name] = +d[name]
                }
            }

            d.Date = parseDate(d.Date)


        });


        init_intra(intraseason);

    });



function init_intra(intraseason) {

    function checkSeason(value) {
        return value.Season == "2014-2015";
    }
    intraseason = intraseason.filter(checkSeason);


    console.log(intraseason);

    //color.domain(d3.keys(intraseason[0]).filter(function(key) { return key !== "date"; }));

    //var cities = color.domain().map(function(name) {
    //    return {
    //        name: name,
    //        values: intraseason.map(function(d) {
    //            return {date: d.date, cummulative_TotalPoints: +d[name]};
    //        })
    //    };
    //});

    x.domain(d3.extent(intraseason, function(d) { return d.Date; }));
    //

    console.log(d3.extent(intraseason, function(d) { return d.Date; }));

    y.domain(d3.extent(intraseason, function(d) { return d.cummulative_TotalPoints; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("cummulative_TotalPoints");

    var city = svg.selectAll(".team")
        .data(intraseason)
        .enter().append("g")
        .attr("class", "team");
    //
    //city.append("path")
    //    .attr("class", "line")
    //    .attr("d", function(d) { return line(d.values); })
    //    .style("stroke", function(d) { return color(d.name); });
    //
    //city.append("text")
    //    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    //    .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.cummulative_TotalPoints) + ")"; })
    //    .attr("x", 3)
    //    .attr("dy", ".35em")
    //    .text(function(d) { return d.name; });

};



