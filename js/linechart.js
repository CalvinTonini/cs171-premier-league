/**
 * Created by cni on 2016-04-14.
 */

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
        bottom: 60,
        left: 60
    };

    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;

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
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.svg.append("text")
        .classed("team-name", true);

    vis.wrangleData();
};

lineChart.prototype.wrangleData = function(){
    var vis = this;

    // In the first step no data wrangling/filtering needed
    vis.data.forEach(function (d) {
        d["seasonDate"] = d3.time.format("%Y-%Y").parse(d["Season"]);
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
    vis.y.domain([d3.max(vis.data, function (d) {
        return d[selection];
    }), d3.min(vis.data, function (d) {
        return d[selection];
    })]);
    
    var color = d3.scale.category20();

    vis.line = d3.svg.line()
        .x(function (d) { return vis.x(d["seasonDate"]); })
        .y(function (d) { return vis.y(d[selection]); });
    
    var teams = vis.svg.selectAll(".team")
        .data(vis.nest);
    
    teams.exit().remove();
    
    teams.attr("d", function (d) {
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
            }
        })
        .style("stroke", function(d) {
            return color(d.key);
        })
        .on("mouseover", function (d) {
            d3.select(this).style("opacity", 1);
            d3.select(this).style("stroke-width", 5);
            d3.select(".team-name").html(d["Team"]);
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", 0.4);
            d3.select(this).style("stroke-width", 1);
        });
    
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
};