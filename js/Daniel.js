

LineChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    this.initVis();
}




LineChart.prototype.initVis = function() {

    var vis = this;

    //console.log(vis.data);

    vis.parseDate = d3.time.format("%Y-%m-%d").parse;


    vis.data.forEach(function(d) {

        for (var name in d){
            if(name!="Date" && name != "Team" && name!="Season"){
                d[name] = +d[name]
            }
        }
        d.Date = vis.parseDate(d.Date)

    });


    vis.margin = {top: 20, right: 40, bottom: 30, left: 30};

    vis.width = 800 - vis.margin.left - vis.margin.right;

    vis.height = 400 - vis.margin.top - vis.margin.bottom;


    vis.x = d3.time.scale()
        .range([0, vis.width]);

    vis.y = d3.scale.linear()
        .range([vis.height, 0]);



    vis.svg = d3.select("#"+vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.linegroup = vis.svg.append("g").attr("id", "lines");

    vis.circlegroup = vis.svg.append("g").attr("id", "circles");


    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.wrangleData();




}




LineChart.prototype.wrangleData = function(){

    var vis = this;





    vis.season = $( "#slider" ).labeledslider( "option", "value" );
        //console.log(value);



    //var season = +document.getElementById("myRange").value;


    vis.season = vis.season.toString() + "-" + (vis.season+1).toString()


    function check(value) {
        return value.Season ==  vis.season;
    }

    vis.filtered = vis.data.filter(check);

    vis.nested  = d3.nest()
        .key(function(d) {return d.Team;})
        .sortKeys(d3.ascending)
        .entries(vis.filtered);

    // In the first step no data wrangling/filtering needed
    vis.displayData = vis.nested;

    //console.log(vis.displayData);
    // Update the visualization
    vis.updateVis();
}



LineChart.prototype.updateVis = function(){

    var vis = this;

    //vis.teams_unique = [];
    //
    //for (var i in vis.displayData) {
    //    vis.teams_unique.push(vis.displayData[i].key)
    //}
    //
    ////vis.color.domain(vis.teams_unique);
    //
    //console.log(vis.teams_unique);

    var sel = document.getElementById('attribute');

    vis.selected  = sel.options[sel.selectedIndex].value;

    vis.ymax = d3.max(vis.displayData, function (d) {
        return d3.max(d.values, function (e) {
            return e[vis.selected]
        })
    });

    vis.ymin = d3.min(vis.displayData, function (d) {
        return d3.min(d.values, function (e) {
            return e[vis.selected]
        })
    });

    vis.y.domain([vis.ymin, vis.ymax]);

    vis.xmin = d3.min(vis.displayData, function (d) {
        return d3.min(d.values, function (e) {
            return e.Date
        })
    });

    vis.xmax = d3.max(vis.displayData, function (d) {
        return d3.max(d.values, function (e) {
            return e.Date
        })
    });


    vis.x.domain([vis.xmin, vis.xmax]);

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");


    vis.line = d3.svg.line()
        .x(function (d) {
            return vis.x(d.Date);
        })
        .y(function (d) {
            return vis.y(d[vis.selected]);
        });



    vis.lines = vis.svg.select("#lines").selectAll(".firstline").data(vis.displayData)

    vis.lines.transition().duration(1000)
        .attr("d",function (d) { return vis.line(d.values);})
        .style("stroke", function (d) {
            return maincolor(d.key);
        })
        .attr("id",function(d){
            return(d.key.replace(/\s+/g, ''))
        })
        .style("opacity",.6)
        .style("stroke-width",3);

    vis.lines.enter().append("path").attr("class","firstline").transition().duration(500)
        .attr("d", function (d) {
            return vis.line(d.values);})
        .style("stroke", function (d) {
            return maincolor(d.key);
        })
        .style("stroke-width",3)
        .style("opacity",.6)
        .attr("id",function(d){
            return(d.key.replace(/\s+/g, ''))
        });

    vis.lines.on("mouseover", function(d) {
            highlightTeam(d.key);
        })
        .on("mouseout", function(d, i) {
            unhighlightTeam(d.key)
        });

    vis.lines.exit().transition().remove();


    vis.circlegroup2 = vis.svg.select("#circles").selectAll(".circlegroup").data(vis.displayData);


    vis.circlegroup2.selectAll("circle").data(function(d){return(d.values)}).transition().duration(1500)
        .attr("fill", function(d) {
            return strokecolor(d.Team);
        })
        .attr("stroke", "black")
        .attr("stroke-width",".5px")
        .attr("cx", function(d) {
            return vis.x(d.Date); // use the fields directly; no reference to "values"
        })
        .attr("cy", function(d) {
            return vis.y(d[vis.selected])
        })
        .attr("r", 3)
        .attr("id",function(d){
            return("game" + d.unique_id)
        })
        .style("opacity",.6);


    vis.circlegroup2.enter().append("g").attr("class","circlegroup").selectAll("circle").data(function(d){ return(d.values)}).enter()
        .append("circle")
        .attr("class","circle")
        .attr("stroke", "black"
        )
        .attr("fill", function(d) {
            return strokecolor(d.Team);
        })
        .attr("stroke-width",".5px")
        .attr("cx", function(d) {
            return vis.x(d.Date); // use the fields directly; no reference to "values"
        })
        .attr("cy", function(d) {
            return vis.y(d[vis.selected])
        })
        .attr("r", 3)
        .attr("id",function(d){
            return("game"+d.unique_id.toString())
        })
        .style("opacity",.6);



    vis.circlegroup2.on("mouseover", function(d) {
            highlightTeam(d.key);
        })
        .on("mouseout", function(d, i) {
            unhighlightTeam(d.key)
        });


        vis.circlegroup2.selectAll("circle")
            .on("click",function(d,i){
            highlightGame(d.unique_id.toString())
        });



    vis.circlegroup2.selectAll("circle").data(function(d){return(d.values)}).exit().remove();


    vis.circlegroup2.exit().remove();



    vis.svg.select(".x-axis").transition().duration(500).call(vis.xAxis);
    vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);




    //vis.circlegroup2 = vis.svg.select("#circles").selectAll(".teamgroup").data(vis.displayData);
    //
    //
    //vis.circlegroup2.selectAll("path").transition().duration(1000)
    //    .attr("d",function (d) { return vis.line(d);})
    //    .style("stroke", function (d) {
    //        return vis.maincolor(d.key);
    //    });
    //
    //
    //vis.circlegroup2.selectAll("circle").transition().duration(1500)
    //    .attr("fill", function(d) {
    //        return vis.strokecolor(d.Team);
    //    })
    //    .attr("stroke", "black")
    //    .attr("stroke-width",".5px")
    //    .attr("cx", function(d) {
    //        return vis.x(d.Date); // use the fields directly; no reference to "values"
    //    })
    //    .attr("cy", function(d) {
    //        return vis.y(d[vis.selected])
    //    })
    //    .attr("r", 3);
    //
    //
    //vis.circlegroup2.enter().append("path").attr("class","line").transition().duration(500)
    //    .attr("d", function (d) {
    //        return vis.line(d.values);})
    //    .style("stroke", function (d) {
    //        return vis.maincolor(d.key);
    //    })
    //    .style("stroke-width",3)
    //    .style("opacity",1)
    //
    //
    //
    //vis.circlegroup2.enter().append("g").attr("class","teamgroup").selectAll("circle").data(function(d){ return(d.values)}).enter()
    //    .append("circle")
    //    .attr("class","circle")
    //    .attr("stroke", "black")
    //    .attr("fill", function(d) {
    //        return vis.strokecolor(d.Team);
    //    })
    //    .attr("stroke-width",".5px")
    //    .attr("cx", function(d) {
    //        return vis.x(d.Date); // use the fields directly; no reference to "values"
    //    })
    //    .attr("cy", function(d) {
    //        return vis.y(d[vis.selected])
    //    })
    //    .attr("r", 3);
    //
    //
    //vis.circlegroup2.selectAll("circle").data(function(d){return(d.values)}).exit().remove();
    //
    //
    //vis.circlegroup2.exit().remove();

    //var rank = vis.svg.selectAll(".team")
    //    .data(vis.displayData)
    //    .enter().append("g")
    //    .attr("class", "team");
    //rank.append("path")
    //    .attr("class", "line")
    //    .attr("d", function(d) { return vis.line(d.values); })
    //    .style("stroke", function(d) { return vis.maincolor(d.key); })
    //
    //var point = rank.append("g")
    //    .attr("class", "line-point");
    //
    //point.selectAll('circle')
    //    .data(function(d){ return d.values})
    //    .enter().append('circle')
    //    .attr("cx", function(d) { return vis.x(d.Date) })
    //    .attr("cy", function(d) { return vis.y(d[vis.selected]) })
    //    .attr("r", 3.5)
    //    .style("stroke", "black")
    //    .style("stroke-width",".5px")
    //    .style("fill", function(d) { return vis.strokecolor(d.Team); });

    //rank.exit().remove();


    //
    //


    //    .
    //
    ////
    ////vis.circlegroup2.selectAll("circle").data(function(d) {
    ////    return d.values; // tell d3 where the children are
    ////}).attr("class","circle")
    ////    .attr("stroke", function(d) {
    ////        return vis.color(d.Team);
    ////    })
    ////    .attr("fill", function(d) {
    ////        return vis.color(d.Team);
    ////    })
    ////    .attr("cx", function(d) {
    ////        return vis.x(d.Date); // use the fields directly; no reference to "values"
    ////    })
    ////    .attr("cy", function(d) {
    ////        return vis.y(d[vis.selected])
    ////    })
    ////    .attr("r", 7);
    //
    //console.log(vis.displayData);
    //
    //var blah  = vis.circlegroup2.enter().append("g").attr("class","circlegroup")
    //    .data(function(d) { console.log(d); return d.values}).enter().append("circle").attr("class","circle")
    //    .attr("stroke", function(d) {
    //        return vis.color(d.Team);
    //    })
    //    .attr("fill", function(d) {
    //        return vis.color(d.Team);
    //    })
    //    .attr("cx", function(d) {
    //        return vis.x(d.Date); // use the fields directly; no reference to "values"
    //    })
    //    .attr("cy", function(d) {
    //        return vis.y(d[vis.selected])
    //    })
    //    .attr("r", 7);
    //


    //
    //vis.trans = function(theteam){
    //    for (var i in vis.displayData){
    //        if(vis.displayData[i].key==theteam){
    //            var values = vis.displayData[i].values
    //        }
    //    }
    //    var len = values.length;
    //    var right = vis.x(values[len-1].Date) + 10;
    //    var left = vis.y(values[len-1][vis.selected]);
    //    return "translate("+ right + "," + left + ")"
    //}


    //var variable = vis.selected
    //
    //var parsedate2 = d3.time.format("%b %d %Y");








    //.on("mouseout", vis.text.text(""))
        //.on("mouseover", function(d, i) {
        //    //vis.text.text(d.key)
        //    //vis.text.style("fill",vis.color(d.key))
        //    //vis.text.attr("transform",vis.trans(d.key))
        //
        //});

    //vis.tip.attr('class', 'd3-tip')
    //    .offset([-10, 0])
    //    .html(function(d) {
    //        console.log(d);
    //        return "<strong>Year:</strong> <span style='color:red'>" + parsedate2(d.Date) + "</span>" + "<br>" + "<strong>Team:</strong> <span style='color:red'>" + d.Team + "</span>" + "<br>" + "<strong>" + variable + ":"+ "</strong> <span style='color:red'>" + d[vis.selected] + "</span>" + "<br>";
    //    })


    //
    //vis.circlegroup2
    //    .style("opacity",1);
        //.on("mouseover",function(d){
        //    //vis.text.text(d.Team);
        //    //vis.text.style("fill",vis.color(d.Team));
        //    //vis.text.attr("transform",vis.trans(d.Team));
        //    ////d3.select(this).transition().duration(300).attr("r", 12);
        //    //vis.text.style("fill",vis.color(d.Team));
        //})
        //.on("mouseout", vis.text.text(""));

            //d3.select(this).transition().duration(300).attr("r", 5);
            //vis.tip.hide
        //.on("mouseout",vis.tip.hide)
        //.on("mousemove", function(d){
        //    vis.text.style("fill",vis.color(d.Team));
        //    vis.text.attr("transform",vis.trans(d.Team));
        //});

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

    //.on("mouseout", function(d, i) {
    //        vis.text.text("");
    //        d3.select(this)
    //            .transition().duration(2)
    //            .style("opacity", 0.6);
    //    }
    //)
    //    .on("mouseover", function(d, i) {
    //        d3.select(this).transition().duration(2).style("opacity", 1);
    //        vis.text.text(d.key)
    //        vis.text.style("fill",vis.color(d.key))
    //        vis.text.attr("transform",vis.trans(d.values))
    //    }

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

    //
    //    );

    // Call axis functions with the new domain

}






