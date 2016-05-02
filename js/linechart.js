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
        bottom: 40,
        left: 40
    };

    vis.width = 1200 - vis.margin.left - vis.margin.right;
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

    vis.teamname = vis.svg.append("text").attr("transform", "translate(0,-10)");

    vis.wrangleData();
};

lineChart.prototype.wrangleData = function() {
    var vis = this;

    var parseDate = d3.time.format("%Y").parse;
    
    // change dates into something more usable
    vis.data.forEach(function (d) {
        d["seasonDate"] = parseDate(d["Season"].split("-")[0]);
    });

    vis.nest = d3.nest()
        .key(function (d) {
            return d["Team"];
        })
        .entries(vis.data);

    vis.nest.forEach(function (d) {
        d.values.sort(function(a, b) {
            return a.seasonDate - b.seasonDate;
        });
        // each line/logo set is initially "active"
        d.active = false;
    });

    // make toggle logos
    d3.selectAll(".toggles")
        .append("svg")
        .attr("width", 50)
        .attr("height", 50)
        .data(vis.nest)
        .append("image")
        .attr("xlink:href", function (d) {
            return 'data/logos/' + d.key + '.png';
        })
        .attr("class", "resultstext teamlogos")
        .attr("id", function (d) {
            return d.key.replace(/ +/g, "") + "inter";
        })
        .attr("width", 50)
        .attr("height", 50)
        .attr("opacity", 0.8)
        .on("click", function (d) {
            // on click enable or disable the line and change the logo opacity
            var active = d.active ? false : true;
            d3.select(this).transition().duration(100).style("opacity", function () {
                if (active) {
                    return 0.4;
                }
                else {
                    return 0.8;
                }
            });
            d.active = active;
        })
        // on mouseover of logo highlight the line
        .on("mouseover", function (d) {
            vis.svg.selectAll("#"+d.key.replace(/ +/g, "")).style("opacity", 1);
            vis.svg.selectAll("#"+d.key.replace(/ +/g, "")).style("stroke-width", 5);
            vis.teamname.text(d.key);
        })
        .on("mouseout", function (d) {
            if (d.active) {
                vis.svg.selectAll("#" + d.key.replace(/ +/g, "")).style("opacity", 0);
            }
            else {
                vis.svg.selectAll("#" + d.key.replace(/ +/g, "")).style("opacity", 0.6);
            }
            vis.svg.selectAll("#"+d.key.replace(/ +/g, "")).style("stroke-width", 1);
            vis.teamname.text(d.key);
        });

    // on off buttons for every line/logo set
    d3.select("#offbutton")
        .append("button")
        .attr("class", "btn btn-default resultstext")
        .text("All Off")
        .on("click", function() {
            vis.svg.selectAll(".teamlines").style("opacity", 0);
            d3.selectAll(".teamlogos").style("opacity", 0.4);
            // Update whether or not the elements are active
            vis.nest.forEach(function (d) {
                d.active = true;
            });
        });
    d3.select("#onbutton")
        .append("button")
        .attr("class", "btn btn-default resultstext")
        .text("All On")
        .on("click", function() {
            vis.svg.selectAll(".teamlines").style("opacity", 0.6);
            d3.selectAll(".teamlogos").style("opacity", 0.8);
            // Update whether or not the elements are active
            vis.nest.forEach(function (d) {
                d.active = false;
            });
        });

    // set up a vertical line that tracks the time slider
    vis.year_line = vis.svg.append("line")
        .attr("id", "year_line")
        .attr("class", "line")
        .attr("x1", 100).attr("x2", 100)
        .attr("y1", 0).attr("y2", vis.height)
        .attr("opacity", 1);

    // preselected combinations of data
    d3.select("#bigFour")
        .on("click", function () {
            vis.nest.forEach(function (d) {
                if (d.key == "Man United" || d.key == "Chelsea" || d.key == "Liverpool" || d.key == "Arsenal") {
                    d.active = false;
                    vis.svg.selectAll("#" + d.key.replace(/ +/g, "")).style("opacity", 0.6);
                    d3.select("#" + d.key.replace(/ +/g, "") + "inter").style("opacity", 0.8);
                }
                else {
                    d.active = true;
                    vis.svg.selectAll("#" + d.key.replace(/ +/g, "")).style("opacity", 0);
                    d3.select("#" + d.key.replace(/ +/g, "") + "inter").style("opacity", 0.4);
                }
            })
        })
        .on("dblclick", function () {
            vis.svg.selectAll(".teamlines").style("opacity", 0.6);
            d3.selectAll(".teamlogos").style("opacity", 0.8);
            // Update whether or not the elements are active
            vis.nest.forEach(function (d) {
                d.active = false;
            });
        });
    d3.select("#shots")
        .on("click", function () {
            document.getElementById("across_season_form").value = "TotalShotsOnTarget";
            updatevars();
        });
    d3.select("#fouls")
        .on("click", function () {
            document.getElementById("across_season_form").value = "TotalFouls";
            updatevars();
        });
    // Update the visualization
    vis.updateVis();
};

lineChart.prototype.updateVis = function () {
    var vis = this;

    var selection = document.getElementById("across_season_form");
    selection = selection.options[selection.selectedIndex].value;
    var selected_year = $( "#slider" ).labeledslider( "option", "value" );

    vis.x.domain(d3.extent(vis.data, function (d) {
        return d["seasonDate"];
    }));

    // the y domain should be inverted for rankings (counting down vs counting up)
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

    // set up a vertical line that displays the year
    vis.year_line.attr({
        x1: vis.x(selected_year),
        x2: vis.x(selected_year)
    });
    
    vis.line = d3.svg.line()
        .defined(function(d) {
            // only display the line if that point is non-zero (team not in league that year)
            return (d[selection] != 0);
        })
        .x(function (d) {
            return vis.x(d["seasonDate"]);
        })
        .y(function (d) {
            return vis.y(d[selection]);
        });

    var teams = vis.svg.selectAll(".line")
        .data(vis.nest);

    teams.transition().duration(500).attr("d", function (d) {
        return vis.line(d.values);
    });

    teams.enter()
        .append("path")
        .attr({
            class: "line teamlines",
            opacity: 0.6,
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
        .style("stroke-width", 1)
        // on mouseover highlight the line and the logo if the line is enabled
        .on("mouseover", function (d) {
            if (!d.active) {
                d3.select(this).style("opacity", 1);
                d3.select(this).style("stroke-width", 5);
                d3.select("#" + d.key.replace(/ +/g, "") + "inter").style("opacity", 1);
                vis.teamname.text(d.key);
            }
        })
        .on("mouseout", function (d) {
            if (!d.active) {
                d3.select(this).style("opacity", 0.6);
                d3.select(this).style("stroke-width", 1);
                d3.select("#" + d.key.replace(/ +/g, "") + "inter").style("opacity", 0.8);
                vis.teamname.text(d.key);
            }
        });

    teams.exit().remove();

    // call the Axis
    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
};