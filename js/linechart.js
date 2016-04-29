/**
 * Created by cni on 2016-04-14.
 */



var years =  [1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];

lineChart = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.initVis();
};

lineChart.prototype.initVis = function () {
    var vis = this;
    vis.margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40
    };

    vis.width = 1200 - vis.margin.left - vis.margin.right;
    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.time.scale.utc()
        .range([0, vis.width]);
    vis.y = d3.scale.linear()
        .range([vis.height, 0]);

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + (vis.height) + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.teamname = vis.svg.append("text").attr("transform", "translate(0,-10)");



    vis.wrangleData();
};

lineChart.prototype.wrangleData = function(){

    var vis = this;

    vis.parseDate = d3.time.format("%Y").parse;


    // In the first step no data wrangling/filtering needed
    vis.data.forEach(function (d) {
        d["seasonDate"] = vis.parseDate(d["Season"].split("-")[0]);
    });

    vis.nest = d3.nest()
        .key(function (d) {
            return d["Team"];
        })
        .entries(vis.data);

    // Update the visualization
    vis.updateVis();
};

lineChart.prototype.updateVis = function () {
    var vis = this;

    var selection = document.getElementById("across_season_form");
    selection = selection.options[selection.selectedIndex].value;

    vis.x.domain(d3.extent(vis.data, function (d) {
        return d["seasonDate"];
    }));

    console.log(d3.extent(vis.data, function (d) {
        return d["seasonDate"]}));


    if (selection == "rank") {
        vis.y.domain([d3.max(vis.data, function (d) {
            return d[selection];
        }), d3.min(vis.data, function (d) {
            return d[selection];
        })]);
    }
    else {
        vis.y.domain(d3.extent(vis.data, function (d) {
            return d[selection];
        }));
    }

    vis.line = d3.svg.line()
        .x(function (d) { return vis.x(d["seasonDate"]); })
        .y(function (d) { return vis.y(d[selection]); });

    var teams = vis.svg.selectAll(".line")
        .data(vis.nest);

    teams.transition().duration(1000).attr("d", function (d) {
        return vis.line(d.values);
    });

    // d3.selectAll(".teams").remove();
    teams.enter()
        .append("path")
        .attr({
            class: "line",
            opacity: 0.4,
            d: function (d) {
                return vis.line(d.values);
            },
            id: function (d) {
                return d.key.replace(/ +/g, "");
            }
        })
        .style("stroke", function(d) {
            return maincolor(d.key);
        })
        .on("mouseover", function (d) {
            vis.teamname.text(d.key);
            highlightTeam(d.key);
        })
        .on("mouseout", function (d) {
            vis.teamname.text("");
            unhighlightTeam(d.key);
        });

    teams.exit().remove();


    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
};