/**
 * Created by cni on 2016-04-14.
 */
function lineChart(data) {
    var selection = "rank";

    // wrangle
    data.forEach(function (d) {
        d["seasonDate"] = d3.time.format("%Y-%Y").parse(d["Season"]);
    });
    var nest = d3.nest()
        .key(function (d) {
            return d["Team"];
        })
        .entries(data);

    // SVG Drawing Area
    var margin = {top: 40, right: 40, bottom: 60, left: 60};

    var width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#linechart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
    var formatDate = d3.time.format("%Y");
    // Scales
    var x = d3.time.scale.utc()
        .range([0, width]);
    var y = d3.scale.linear()
        .range([height, 0]);
    // Axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    svg.append("g")
        .classed("x-axis", true)
        .classed("axis", true)
        .attr("transform", "translate(0, " + height + ")");
    svg.append("g")
        .classed("y-axis", true)
        .classed("axis", true);
    // Actual Rendering
    x.domain(d3.extent(data, function (d) {
        return d["seasonDate"];
    }));
    y.domain([0, d3.max(data, function (d) {
        return d[selection];
    })]);

    var color = d3.scale.category10();

    var line = d3.svg.line()
        .x(function (d) { return x(d["seasonDate"]); })
        .y(function (d) { return y(d[selection]); })
        .interpolate("monotone");
    var teams = svg.selectAll(".teams")
        .data(nest)
        .enter().append("g")
        .attr("class", "team");

    teams.append("path")
        .attr({
            class: "line",
            opacity: 1,
            d: function (d) {
                return line(d.values);
            }
        })
        .style("stroke", function(d) {
            return color(d.key);
        });
}