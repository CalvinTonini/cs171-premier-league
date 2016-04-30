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
        bottom: 500,
        left: 60
    };

    vis.width = 700 - vis.margin.left - vis.margin.right;
    vis.height = 1000 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.x = d3.time.scale.utc()
        .range([0, vis.width]);
    vis.y = d3.scale.linear()
        .range([vis.height, 0]);
    vis.maincolor = d3.scale.ordinal();
    vis.maincolor.domain(['Arsenal', 'Aston Villa', 'Barnsley', 'Birmingham', 'Blackburn',
        'Blackpool', 'Bolton', 'Bournemouth', 'Bradford', 'Burnley',
        'Cardiff', 'Charlton', 'Chelsea', 'Coventry', 'Crystal Palace',
        'Derby', 'Everton', 'Fulham', 'Hull', 'Ipswich', 'Leeds',
        'Leicester', 'Liverpool', 'Man City', 'Man United',
        'Middlesbrough', 'Newcastle', 'Norwich', "Nott'm Forest", 'Oldham',
        'Portsmouth', 'QPR', 'Reading', 'Sheffield United',
        'Sheffield Weds', 'Southampton', 'Stoke', 'Sunderland', 'Swansea',
        'Swindon', 'Tottenham', 'Watford', 'West Brom', 'West Ham', 'Wigan',
        'Wimbledon', 'Wolves']);
    vis.maincolor.range(["#ef0107","#94bee5","#dd302c","#4c689f","#009ee0","#f68712","#263c7e","#000000","#fcb950","#8dd2f1","#005ea3",
        "#d4021d","#034694","#74b2df","#b62030","black","#274488","black","#f5a12d","#de23c7","#e1db20","#0053a0","#d00027","#5cbfeb","#da020e",
        "#d9000d","#231f20","#00a650","#e53233","#c1c1c1","#1e4494","#005cab","#dd1740","#ee2227","#377aaf","red","#e03a3e","red","black","#b48d00","#001c58","#000000",
        "#091453","#6022db","#006838","#fcd213","#faa61a"]);
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
        d.active = true;
    });
    vis.nest = d3.nest()
        .key(function (d) {
            return d["Team"];
        })
        .entries(vis.data);

    // make legend
    var legendSpace = width / (vis.nest.length / 2);
    vis.nest.forEach(function (d, i) {
        vis.svg.append("text")
            .attr("x", (legendSpace / 2))
            .attr("y", height + (margin.bottom) + 10 * i)
            .attr("class", "legend")
            .style("fill", function () {
                return vis.maincolor(d.key);
            })
            .on("click", function () {
                var active = d.active ? false : true;
                var newOpacity = active ? 0 : 1;
                vis.svg.selectAll("#"+d.key)
                    .transition().duration(100)
                    .style("opacity", newOpacity);
                d.active = active;
                console.log("hit");
            })
            .text(d.key);
    });
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
                return d.key;
            }
        })
        .style("stroke", function(d) {
            return vis.maincolor(d.key);
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

    teams.exit().remove();

    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);
};