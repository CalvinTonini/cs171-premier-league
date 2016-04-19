

LineChart = function(_parentElement, _data,notnested){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    this.initVis();
}


LineChart.prototype.initVis = function() {

    var vis = this;

    function check(value) {
        return value.Season == "2014-2015";
    }

    //vis.tip = d3.tip();


    vis.filtered = vis.data.filter(check);

    vis.nested  = d3.nest()
        .key(function(d) {return d.Team;})
        .sortKeys(d3.ascending)
        .entries(vis.filtered);

    vis.data = vis.nested;

    vis.margin = {top: 20, right: 150, bottom: 30, left: 60};

    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.height = 500 - vis.margin.top - vis.margin.bottom;

    vis.parseDate = d3.time.format("%Y-%m-%d").parse;

    vis.x = d3.time.scale()
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .range([vis.height, 0]);

    vis.color = d3.scale.category20();

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    //.interpolate("step-before")


    //vis.div = d3.select("body").append("div")
    //    .attr("class", "tooltip")
    //    .style("opacity", 0);

    vis.svg = d3.select("#"+vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //vis.svg.call(vis.tip);

    vis.text = vis.svg.append("text").style("text-anchor", "start").style("font-size",15);

    vis.circlegroup = vis.svg.append("g").attr("id", "circles");

    vis.linegroup = vis.svg.append("g").attr("id", "lines");


    vis.lines = vis.svg.select("#lines").selectAll("path").data(vis.data).enter().append("path").attr("class","line");

    vis.circlegroup2 = vis.svg.select("#circles").selectAll(".circlegroup").data(vis.data).enter().append("g").attr("class","circlegroup").selectAll("circle") // start a nested selection
        .data(function(d) {
            return d.values; // tell d3 where the children are
        })
        .enter().append("circle");


    vis.teams_unique = [];

    for (var i in vis.data) {
        vis.teams_unique.push(vis.data[i].key)
    }

    vis.color.domain(vis.teams_unique);

    vis.xmin = d3.min(vis.data, function (d) {
        return d3.min(d.values, function (e) {
            return e.Date
        })
    });

    vis.xmax = d3.max(vis.data, function (d) {
        return d3.max(d.values, function (e) {
            return e.Date
        })
    });

    vis.x.domain([vis.xmin, vis.xmax]);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");
    //
    //vis.tooltip = d3.select("body").append("div")
    //    .attr("class", "tooltip")
    //    .style("opacity", 0);

    vis.tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("font-size","14px")
        .style("background-color","black")
        .style("padding","10px")
        .style("font-color","white")
        .text("a simple tooltip");

    vis.wrangleData();

}




LineChart.prototype.wrangleData = function(){

    var vis = this;


    // In the first step no data wrangling/filtering needed
    vis.displayData = vis.data;


    // Update the visualization
    vis.updateVis();
}



LineChart.prototype.updateVis = function(){


    var vis = this;

    // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer

    var sel = document.getElementById('attribute');

    vis.selected  = sel.options[sel.selectedIndex].value;

    vis.line = d3.svg.line()
        .x(function (d) {
            return vis.x(d.Date);
        })
        .y(function (d) {
            return vis.y(d[vis.selected]);
        })

    vis.trans = function(theteam){
        for (var i in vis.displayData){
            if(vis.displayData[i].key==theteam){
                var values = vis.displayData[i].values
            }
        }
        var len = values.length;
        var right = vis.x(values[len-1].Date) + 10;
        var left = vis.y(values[len-1][vis.selected]);
        return "translate("+ right + "," + left + ")"

    }


    //vis.mousemove = function() {
    //    var x0 = x.invert(d3.mouse(this)[0]),
    //        i = bisectDate(vis.displayData, x0, 1),
    //        d0 = vis.displayData[i - 1],
    //        d1 = vis.displayData[i],
    //        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //    console.log(x0);
    //    console.log(i);
    //    focus.attr("transform", "translate(" + vis.x(d.date) + "," + vis.y(d[vis.selected]) + ")");
    //    focus.select("text").text(d[vis.selected]);
    //}

    vis.ymax = d3.max(vis.data, function (d) {
        return d3.max(d.values, function (e) {
            return e[vis.selected]
        })
    });

    vis.ymin = d3.min(vis.data, function (d) {
        return d3.min(d.values, function (e) {
            return e[vis.selected]
        })
    });


    vis.y.domain([vis.ymin, vis.ymax]);

    //console.log(vis.displayData);


    vis.lines
        .transition().duration(1000)
        .attr("d", function (d) {
            return vis.line(d.values);
        });

    vis.lines.style("stroke", function (d) {
         return vis.color(d.key);
        })
        .style("stroke-width",5)
        .style("opacity",.6)
        .on("mouseout", function(d, i) {
                vis.text.text("")
            }
        )
        .on("mouseover", function(d, i) {

            //d3.select(this).transition().duration(2).style("opacity", 1);
            vis.text.text(d.key)
            vis.text.style("fill",vis.color(d.key))
            vis.text.attr("transform",vis.trans(d.key))

        });


    var variable = "Variable Chosen"
    var parsedate = d3.time.format("%b %d %Y");

    //vis.tip.attr('class', 'd3-tip')
    //    .offset([-10, 0])
    //    .html(function(d) {
    //        console.log(d);
    //        var col = vis.color(d.Team);
    //        var colstyle = "color:"+col;
    //        return "<strong>Date:</strong> <span style="+colstyle+">" + parsedate(d.Date) + "</span>" + "<br>" + "<strong>Team:</strong> <span style="+colstyle+">" + d.Team + "</span>" + "<br>" + "<strong>" + variable + ":"+ "</strong> <span style="+colstyle+">"+ d[vis.selected] + "</span>" + "<br>";
    //    })


    vis.circlegroup2
        .transition().duration(1500)
        .attr("stroke", function(d) {
            return vis.color(d.Team);
        })
        .attr("fill", function(d) {
            return vis.color(d.Team);
        })
        .attr("cx", function(d) {
            return vis.x(d.Date); // use the fields directly; no reference to "values"
        })
        .attr("cy", function(d) {
            return vis.y(d[vis.selected])
        })
        .attr("r", 5);

    vis.circlegroup2
        .style("opacity",1)
        .on("mouseover", function(d){
            vis.text.text(d.Team)
            vis.text.style("fill",vis.color(d.Team));
            vis.text.attr("transform",vis.trans(d.Team));
            vis.tooltip.style("visibility", "visible");
            vis.tooltip.text(d[vis.selected]);
        })
        .on("mouseout", function(){
            vis.text.text("");
            vis.tooltip.style("visibility", "hidden");
            vis.tooltip.text("");
        })
        .on("mousemove", function(){
            vis.tooltip.style("top", (event.pageY+20)+"px").style("left",(event.pageX+20)+"px");
            vis.text.style("fill",vis.color(d.Team));
            vis.text.attr("transform",vis.trans(d.Team));
            vis.tooltip.style("visibility", "visible");
            vis.tooltip.text(d[vis.selected]);
        });

    //
    //circle.exit().remove();
    //
    //circle.enter().append("circle")
    //    .attr("r", 3)
    //    .on('mouseover', vis.tip.show).on('mouseout', vis.tip.hide);
    //
    //circle.attr("fill","blue").transition().duration(800).attr("cx", function(d) { return vis.x(d.Date)}).attr("cy", function(d) { return vis.y(d[vis.selected])});
    //

    //vis.svg.select("rect").on("mousemove", vis.mousemove);


    //var team = vis.svg.selectAll(".team")
    //    .data(vis.displayData);


    vis.svg.select(".x-axis").call(vis.xAxis);
    vis.svg.select(".y-axis").call(vis.yAxis);

    //
    //team.enter().append("path")
    //    .attr("class", "team");
    //
    //team
    //    .append("path")
    //    .attr("class", "line")
    //    .attr("d", function (d) {
    //        return vis.line(d.values);
    //    })
    //    .style("stroke", function (d) {
    //        return vis.color(d.key);
    //    })
    //    .style("stroke-width",5)
    //    .style("opacity",.6)
    //    .on("mouseout", function(d, i) {
    //        vis.text.text("");
    //        d3.select(this)
    //            .transition().duration(2)
    //            .style("opacity", 0.6);
    //        }
    //    )
    //    .on("mouseover", function(d, i) {
    //        d3.select(this).transition().duration(2).style("opacity", 1);
    //        vis.text.text(d.key)
    //        vis.text.style("fill",vis.color(d.key))
    //        vis.text.attr("transform",vis.trans(d.values))
    //
    //    }
    //
    //    );

    // Call axis functions with the new domain

}






