
// SVG drawing area

BarChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    this.initVis();
};


BarChart.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 20, right: 20, bottom: 30, left: 105};

    vis.width = 430 - vis.margin.left - vis.margin.right;

    vis.height = 400 - vis.margin.top - vis.margin.bottom;


    vis.y = d3.scale.ordinal()
        .rangeRoundBands([0, vis.height], .2);

    vis.x = d3.scale.linear()
        .range([0, vis.width]);


    vis.svg = d3.select("#"+vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + (vis.height)+ ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");

    vis.text = vis.svg.append("text").style("text-anchor", "middle").style("font-size",15)
        .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height + vis.margin.bottom -10)+ ")");

    vis.wrangleData();

};

BarChart.prototype.wrangleData = function(){

    var vis = this;

    vis.season = $( "#slider" ).labeledslider( "option", "value" );

    vis.season = vis.season.toString() + "-" + (vis.season+1).toString();

    function check(value) {
        return value.Season ==  vis.season;
    }

    vis.filtered = vis.data.filter(check);

    var sel = document.getElementById('attribute');

    vis.selected  = sel.options[sel.selectedIndex].value;

    vis.nice = d3.select("#Daniel").selectAll("option").filter(function(d, i) {
        return this.selected;
    })[0][0]["label"];

    vis.selected = vis.selected.split("_")[1];

    vis.filtered.sort(function(a, b) { return b[vis.selected] - a[vis.selected]; });

    vis.displayData = vis.filtered;

    // Update the visualization
    vis.updateVis();
};



BarChart.prototype.updateVis = function() {

    var vis = this;

    vis.y.domain(vis.displayData.map(function (d) {
        return d.Team;
    }));


    vis.x.domain([0, d3.max(vis.displayData, function (d) {
        return d[vis.selected]
    })]);

    //var sortItems = function(a, b) { return b[vis.selected] - a[vis.selected]; }

    if(vis.selected =="GoalDifferential"){
        vis.x.domain([d3.min(vis.displayData, function (d) { return d[vis.selected] }), d3.max(vis.displayData, function (d) {
            return d[vis.selected]
        })]);
    }

    vis.xAxis = d3.svg.axis()
        .scale(vis.x)
        .orient("bottom");

    vis.yAxis = d3.svg.axis()
        .scale(vis.y)
        .orient("left");

    vis.rect = vis.svg.selectAll("rect").data(vis.displayData);

    vis.rect.transition().duration(1500)
        .attr("y", function (d) {
            return vis.y(d.Team);
        })
        .attr("x", 2)
        .attr("height", vis.y.rangeBand())
        .attr("width", function (d) {
            return vis.x(d[vis.selected]);
        })
        .attr("fill",function(d){
            return maincolor(d.Team)
        })
        .attr("stroke",function(d){
            return strokecolor(d.Team)
        })
        .attr("stroke-width","1.5px")
        .attr("opacity",.6)
        .attr("id",function(d){
            return d.Team.replace(/ +/g, "")});


    // Enter (initialize the newly added elements)
    vis.rect.enter().append("rect").attr("class", "bar")
        .attr("y", function (d) {
            return vis.y(d.Team);
        })
        .attr("x", 2)
        .attr("height", vis.y.rangeBand())
        .attr("width", function (d) {
            return vis.x(d[vis.selected]);
        })
        .attr("fill",function(d){
            return maincolor(d.Team)
        })
        .attr("stroke",function(d){
            return strokecolor(d.Team)
        })
        .attr("stroke-width","1.5px")
        .attr("opacity",.6)
        .attr("id",function(d){
            return d.Team.replace(/ +/g, "")});


    vis.rect
        .on("mouseover", function(d) {
            highlightTeam(d.Team);

        })
        .on("mouseout", function(d, i) {
            d3.select(this).attr("opacity",1)
                .attr("fill", function() {
                    return maincolor(d.Team)
                });
            unhighlightTeam(d.Team);
        });


    vis.rect.exit().transition().remove();
    vis.text.text(vis.nice);


    vis.svg.select(".y-axis").transition().duration(800)
        .call(vis.yAxis);
    vis.svg.select(".x-axis").transition().duration(800)
        .call(vis.xAxis);


};


/**
 * Created by Daniel on 4/23/16.
 */
