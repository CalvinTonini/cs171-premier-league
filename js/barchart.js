
// SVG drawing area

BarChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    this.initVis();
}


BarChart.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 20, right: 20, bottom: 50, left: 120};

    vis.width = 400 - vis.margin.left - vis.margin.right;

    vis.height = 400 - vis.margin.top - vis.margin.bottom;


    vis.y = d3.scale.ordinal()
        .rangeRoundBands([0, vis.height], .2);

    vis.x = d3.scale.linear()
        .range([0, vis.width]);



    //.interpolate("step-before")


    //vis.div = d3.select("body").append("div")
    //    .attr("class", "tooltip")
    //    .style("opacity", 0);

    vis.svg = d3.select("#"+vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //vis.text = vis.svg.append("text").style("text-anchor", "start").style("font-size",15);

    //vis.circlegroup = vis.svg.append("g").attr("id", "circles");

    //vis.linegroup = vis.svg.append("g").attr("id", "lines");

    //vis.linegroup2 = vis.svg.append("g").attr("id", "lines2");


    //vis.linegroup = vis.svg.append("g").attr("id", "lines");

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + (vis.height)+ ")");

    vis.svg.append("g")
        .attr("class", "y-axis axis");
    //
    //vis.tip = d3.tip();
    //
    //vis.svg.call(vis.tip);

    vis.text = vis.svg.append("text").style("text-anchor", "middle").style("font-size",15)
        .attr("transform", "translate(" + (vis.width/2) + "," + (vis.height + vis.margin.bottom -10)+ ")");



    vis.wrangleData();


}

BarChart.prototype.wrangleData = function(){

    var vis = this;



    vis.season = $( "#slider" ).labeledslider( "option", "value" );
        //console.log(value);

    //var season = +document.getElementById("myRange").value;


    vis.season = vis.season.toString() + "-" + (vis.season+1).toString()


    function check(value) {
        return value.Season ==  vis.season;
    }

    vis.filtered = vis.data.filter(check);


    var sel = document.getElementById('attribute');

    vis.selected  = sel.options[sel.selectedIndex].value;

    vis.nice = d3.select("#Daniel").selectAll("option").filter(function(d, i) {
        return this.selected;
    })[0][0]["label"];

    console.log(vis.nice);


    vis.selected = vis.selected.split("_")[1]


    vis.filtered.sort(function(a, b) { return b[vis.selected] - a[vis.selected]; });

    //vis.nested  = d3.nest()
    //    .key(function(d) {return d.Season;})
    //    .sortKeys(d3.ascending)
    //    .entries(vis.filtered);
    // In the first step no data wrangling/filtering needed

    vis.displayData = vis.filtered;


    // Update the visualization
    vis.updateVis();
}



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


}


//
//var margin = {top: 40, right: 10, bottom: 60, left: 60};
//
//var width = 960 - margin.left - margin.right,
//    height = 500 - margin.top - margin.bottom;
//
//var svg = d3.select("#chart-area").append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//
//var g = svg.append("g").attr("transform", "translate("+margin.left+"," + margin.top +")");
//
//var yAxisGroup = g.append("g")
//    .attr("class", "y-axis axis")
//    .attr("transform","translate(-5,0)");
//
//
//var xAxisGroup = g.append("g")
//    .attr("class","x-axis axis")
//    .attr("transform","translate(0,"+height+")");
//// Scales
//var x = d3.scale.ordinal()
//    .rangeRoundBands([0, width], .1);
//
//var xAxis = d3.svg.axis()
//    .scale(x)
//    .orient("bottom")
//
//
//var y = d3.scale.linear()
//    .range([height, 0]);
//
//var yAxis = d3.svg.axis()
//    .scale(y)
//    .orient("left")
//
//// Initialize data
//loadData();
//
//// d3.select("#ranking-type").on("change", updateVisualization());
//
//// Coffee chain data
//var data;
//
//// Load CSV file
//function loadData() {
//    d3.csv("data/coffee-house-chains.csv", function(error, csv) {
//
//        csv.forEach(function(d){
//            d.revenue = +d.revenue;
//            d.stores = +d.stores;
//        });
//
//        // Store csv data in global variable
//        data = csv;
//
//        // Draw the visualization for the first time
//        updateVisualization();
//    });
//}
//
//// Render visualization
//function updateVisualization() {
//    var value = d3.select("#ranking-type").property("value");
//    data.sort(function(a, b) { return b[value] - a[value]; });
//    x.domain(data.map(function(d) { return d.company; }));
//    y.domain([0, d3.max(data, function(d) { return d[value] })])
//    var rect = g.selectAll("rect").data(data);         // Enter (initialize the newly added elements)
//    rect.enter().append("rect").attr("class", "bar")
//    rect.transition().duration(5000).attr("x", function(d) { return x(d.company); })
//        .attr("y", function(d) { return y(d[value]); })
//        .attr("width", x.rangeBand())
//        .attr("height", function(d) { return height - y(d[value]); })
//    rect.exit().transition().remove();
//    g.select(".y-axis").transition().duration(800)
//        .call(yAxis);
//    g.select(".x-axis").transition().duration(800)
//        .call(xAxis);
//}



// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'
// var	margin = {top: 30, right: 60, bottom: 60, left: 60},
//     width = 600 - margin.left - margin.right,
//     height = 300 - margin.top - margin.bottom;

// var svg = d3.select("#chart-area").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
// var g = svg.append("g").attr("transform", "translate("+margin.left+"," + margin.top +")")
// var textbox = g.append("text")
// var yaxisGroup = g.append("g").attr("class","y-axis axis")

// var o = d3.scale.category10()
//     .domain(data.map(function(d) { return d.product; }));

// var y = d3.scale.linear()
//     .range([height, 0]);

// var yAxis = d3.svg.axis().scale(y).orient("left")


// function updateVisualization(orders) {
// 	console.log(orders);
// 	textbox.text("Orders: "+orders.length.toString())
// 	var circle = g.selectAll("circle").data(orders);         // Enter (initialize the newly added elements)
// 	circle.enter().append("circle").attr("class", "dot").attr("fill",function(d){return o(d.product)})
// 	circle.attr("r", 10).attr("cx", function(d, index) { return (index * 80) + 50 }).attr("cy", 80)
// 	circle.exit().remove();
// 	svg.select(".y-axis").call(yAxis);

// }





/**
 * Created by Daniel on 4/23/16.
 */
