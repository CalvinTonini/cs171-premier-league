

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.cummulative_TotalPoints); })
    .interpolate("basis");
//.interpolate("step-before")


var svg = d3.select("#intra_season").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


queue()
    .defer(d3.csv, "data/matches.csv")
    .defer(d3.csv, "data/intraseason_data.csv")
    .defer(d3.csv,"data/season_aggregate_stats.csv")
    .await(function(error, matches, intraseason,aggregate) {


        intraseason.forEach(function(d) {

            for (var name in d){
                if(name!="Date" && name != "Team" && name!="Season"){
                    d[name] = +d[name]
                }
            }

            d.Date = parseDate(d.Date)



        });

        function checkSeason(value) {
            return value.Season == "2014-2015";
        }

        intraseason = intraseason.filter(checkSeason);


        var data_nested  = d3.nest()
            .key(function(d) {return d.Team;})
            .sortKeys(d3.ascending)
            .entries(intraseason);

        init_intra(data_nested);

        // Data Wrangling
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
        lineChart(aggregate);
    });



function init_intra(data) {

    var teams_unique = [];

    for (var i in data){
        teams_unique.push(data[i].key)
    }


    color.domain(teams_unique);

    var xmin = d3.min(data, function(d) { return d3.min(d.values, function(e){ return e.Date})});

    var xmax = d3.max(data, function(d) { return d3.max(d.values, function(e){ return e.Date})});

    var ymax = d3.max(data, function(d) { return d3.max(d.values, function(e){ return e.cummulative_TotalPoints})});



    x.domain([xmin,xmax]);
    y.domain([0,ymax]);
    //

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate("+(margin.left+30)+",0)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("TotalPoints");

    var team = svg.selectAll(".team")
        .data(data)
        .enter().append("g")
        .attr("class", "team");

    team
        .append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values);})
        .style("stroke", function(d) { return color(d.key); });


    //team.append("text")
    //    .text(function(d) { return d.key; })
    //    .attr("transform", function(d) { return trans(d.values) } )
    //    .attr("fill", function(d) { return color(d.key); });

}
function trans(values){
    var len = values.length;
    var right = x(values[len-1].Date);
    var left = y(values[len-1].cummulative_TotalPoints);
    return "translate("+ right + "," + left + ")"

}


