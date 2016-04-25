
// SVG drawing area

BarChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    this.displayData = []; // see data wrangling
    this.initVis();
}


BarChart.prototype.initVis = function() {

    var vis = this;

    vis.margin = {top: 10, right: 0, bottom: 50, left: 100};

    vis.width = 500 - vis.margin.left - vis.margin.right;

    vis.height = 600 - vis.margin.top - vis.margin.bottom;


    vis.y = d3.scale.ordinal()
        .rangeRoundBands([0, vis.height], .2);

    vis.x = d3.scale.linear()
        .range([0, vis.width]);

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

    vis.strokecolor = d3.scale.ordinal();
    vis.strokecolor.domain(['Arsenal', 'Aston Villa', 'Barnsley', 'Birmingham', 'Blackburn',
        'Blackpool', 'Bolton', 'Bournemouth', 'Bradford', 'Burnley',
        'Cardiff', 'Charlton', 'Chelsea', 'Coventry', 'Crystal Palace',
        'Derby', 'Everton', 'Fulham', 'Hull', 'Ipswich', 'Leeds',
        'Leicester', 'Liverpool', 'Man City', 'Man United',
        'Middlesbrough', 'Newcastle', 'Norwich', "Nott'm Forest", 'Oldham',
        'Portsmouth', 'QPR', 'Reading', 'Sheffield United',
        'Sheffield Weds', 'Southampton', 'Stoke', 'Sunderland', 'Swansea',
        'Swindon', 'Tottenham', 'Watford', 'West Brom', 'West Ham', 'Wigan',
        'Wimbledon', 'Wolves']);

    vis.strokecolor.range(["#9c824a","#ffe600","#996026","#f1f1f1","#e2001a","black","#df0024","#c51217","#84424a","#070e19","#b01b27",
        "#ffffff","#eee200","#04f482","#17519c","white","white","#cc0000","black","#3a64a3","#244593","#ffb556","#00a398","#ffce65","#ffe500",
        "#white","pink","#fff200","grey","#002f63","#e0e0ef","#d0d3ce","#004494","#ffffff","#e9aa3f","#ffffff","#ffffff","#ffffff","#ffffff","#db1116","#fffff","#fbee23",
        "#592d09","#f7c240","#1d59af","#2e3192","black"]);

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

    vis.wrangleData();


}

BarChart.prototype.wrangleData = function(){

    var vis = this;

    console.log("newdata");

    console.log(vis.data);

    var season = +document.getElementById("myRange").value;


    var season = season.toString() + "-" + (season+1).toString()


    function check(value) {
        return value.Season ==  season;
    }

    vis.filtered = vis.data.filter(check);


    var sel = document.getElementById('attribute');

    vis.selected  = sel.options[sel.selectedIndex].value;

    console.log(vis.selected)

    vis.selected = vis.selected.split("_")[1]

    console.log(vis.selected)

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


    console.log(d3.max(vis.displayData, function (d) { return d[vis.selected] }));


    vis.x.domain([0, d3.max(vis.displayData, function (d) {
        return d[vis.selected]
    })]);

    if(vis.selected =="GoalDifferential"){
        vis.x.domain([d3.min(vis.displayData, function (d) { return d[vis.selected] }), d3.max(vis.displayData, function (d) {
            return d[vis.selected]
        })]);
    }

    vis.rect = vis.svg.selectAll("rect").data(vis.displayData);         // Enter (initialize the newly added elements)
    vis.rect.enter().append("rect").attr("class", "bar")
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
            return vis.maincolor(d.Team)
        })
        .attr("stroke",function(d){
            return vis.strokecolor(d.Team)
        })
        .attr("stroke-width","1.5px")
        .attr("opacity",.6)
        .attr("id",function(d){return (d.Team)});

    vis.rect
        .on("mouseover", function(d) {
            highlightTeam(d.Team);

        })
        .on("mouseout", function(d, i) {
            d3.select(this).attr("opacity",1)
                .attr("fill", function() {
                return vis.maincolor(d.Team)
            });
            unhighlightTeam(d.Team);
        });

    vis.rect.exit().transition().remove();


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
