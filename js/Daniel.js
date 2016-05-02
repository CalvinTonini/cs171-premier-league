

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

    vis.width = 750 - vis.margin.left - vis.margin.right;

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


    // Update the visualization
    vis.updateVis();
};



LineChart.prototype.updateVis = function(){

    var vis = this;

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




};






