/**
 * Created by Eamon on 4/17/16.
 */
var margin = {top: 50, right: 60, bottom: 10, left: 50},
    width = 550,
    height = 550;

/* Initialize tooltip */
tipmatrix = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

tipmatrix.html(function(d) { return "<strong>Home:</strong> <span style='color:red'>" + d.HomeTeam + "</span><br/><strong>Away:</strong> <span style='color:red'>" +d.AwayTeam+ "</span><br/><strong>Date:</strong> <span style='color:red'>" +d.Date+ "</span>"});


var svg = d3.select("#matrix-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* Invoke the tip in the context of your visualization */
svg.call(tipmatrix);


var height_cell = width/22;
var width_cell = height_cell;

var Season_selection = "2014-2015";


d3.csv("data/matchesDates.csv", function(d) {

    return {
        Season: d.Season,
        HomeTeam: d.HomeTeam,
        AwayTeam: d.AwayTeam,
        FTR: d.FTR,
        FTHG: +d.FTHG,
        FTAG: +d.FTAG,
        Date: d.Date
    };
}, function(error, data) {

    data = data.filter(function(d) { return d.Season == Season_selection});

    //console.log(data)

    var nodes = [];

    for(i=0; i< data.length; i++)
    {
        if (nodes.indexOf(data[i].HomeTeam) == -1) {
            nodes.push(data[i].HomeTeam);
        }
    }







    //var placeholder ={};
    //var placeholders =[];
    //var team_count = 0;
    //var counter =0;
    //var loop_count = -1;
    //
    //function addPlaceholder()
    //{
    //    console.log(data.splice(loop_count, 0, placeholder));
    //    data.splice( loop_count,   // At index 2 (where the 'e' is),
    //    0,   // delete zero elements,
    //    placeholder);  // and insert the element 'c',
    //}
    //
    //for(i=0; i< data.length; i++)
    //{
    //    loop_count = loop_count+1;
    //    team_count = (i % nodes.length);
    //placeholder = {AwayTeam: nodes[team_count], FTAG:0, FTHG:0, FTR:"Na", HomeTeam: data[i].HomeTeam, Season: Season_selection}
    //
    //console.log(placeholder);
    //console.log(data[i].AwayTeam);
    //console.log(nodes[team_count]);
    //
    //    if (data[i].AwayTeam != nodes[team_count])
    //    {
    //        //counter = counter+1;
    //        //console.log(counter);
    //        //data.splice( i,   // At index 2 (where the 'e' is),
    //        //    0,   // delete zero elements,
    //        //    placeholder);  // and insert the element 'c',
    //        //
    //        break;
    //    }
    //}
    //
    //data = data.splice( loop_count,   // At index 2 (where the 'e' is),
    //        0,   // delete zero elements,
    //        placeholder);  // and insert the element 'c',

    //loop_count =0;
    //placeholder = [];
    //
    //
    //
    //
    //console.log(data);
    //console.log(placeholder);


//var placeholder = { AwayTeam: "Arsenal", FTAG:0, FTHG:0, FTR:"Na", HomeTeam:"Arsenal", Season:"2015-2016"};
//
//    data.splice( 0,   // At index 2 (where the 'e' is),
//        0,   // delete zero elements,
//        placeholder);  // and insert the element 'c',

    //data.push(placeholder);


    for(i=0; i< data.length; i++){
        placeholder ={
            AwayTeam: data[i].HomeTeam, FTAG:0, FTHG:0, FTR:"Na", HomeTeam: data[i].HomeTeam, Season: Season_selection};

        //console.log(placeholder);
        if (i == 0 || (i % 21 == 0) ) {
            data.splice(i, 0, placeholder);

            //console.log(placeholder);
            //console.log(data);
        }


    }

    data.splice(data.length, 0, placeholder);




    var count = 0;
    team_count = 0;


    //console.log(nodes);
    //console.log(placeholder);
    //console.log(data);

    var cell_size = height_cell;
    var rect = svg.selectAll("rect")
        .data(data);
// Enter (initialize the newly added elements)

    var cells = svg.selectAll("g")
        .data(data).enter()
        .append("g");


    cells.append("rect")
        .attr("class", "rect")
        .attr("height", height_cell)
        .attr("width", width_cell)
        .attr("x", function(d, index) {

            function check_count(){
                if (d.AwayTeam != nodes[team_count]) {
                    //count = count + 1;
                    //check_count();
                }
            }

            //count = 0;
            team_count = (index % nodes.length)

            //count = count + 1;
            check_count();


            return (((index % nodes.length) //+ count
            ) * cell_size) + 50 })
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);




            return Math.floor((index/nodes.length))* cell_size })
        .attr("stroke", "grey")
        .attr("fill", function(d){

                if (d.FTR == "H") {
                    return "#ADD8E6";
                }
                else if (d.FTR == "A"){
                    return "#FF7F7F";
                }
                else if (d.FTR == "D"){
                    return "#FFFF8B";
                }
                else if (d.FTR == "Na"){
                    return "grey";
                }
        });


    cells.append("text")
        .attr("x", function(d, index) {


           // count = 0;
            //team_count = (index % nodes.length)

            //count = count + 1;
            //check_count();
            return (((index % nodes.length)) * cell_size) + 55 })
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);




            return Math.floor((index/nodes.length))* cell_size })
        .attr("dy", "1.2em")
        .text(function(d){if (d.FTR != "Na")
        {
            return d.FTHG + "-" +d.FTAG
        } })
        .on('mouseover',console.log("HELLO"))
        .on('mouseout', tipmatrix.hide);

    //console.log(nodes);
    var nodes_trunc = nodes;

    for (i=0; i<nodes_trunc.length; i++)
    {
        nodes_trunc[i] = nodes_trunc[i].substring(0,3);
    }

cells.append("text")
        .attr("x", function(d, index) {


           // count = 0;
            //team_count = (index % nodes.length)

            //count = count + 1;
            //check_count();
            return (((index % nodes.length)) * cell_size) + 55 })
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);




            return Math.floor((index/nodes.length))* cell_size })
        .attr("dy", "-0.2em")
        .text(function(d, index){if (d.FTR != "Na")
        {
            return nodes_trunc[index];
        } });
        //.attr("transform", "rotate(10)");

    //cells.append("text")
    //    .attr("x", function(d, index) {
    //
    //
    //        // count = 0;
    //        //team_count = (index % nodes.length)
    //
    //        //count = count + 1;
    //        //check_count();
    //        console.log(nodes);
    //        return (((index % nodes.length)) * cell_size) + 55 })
    //    .attr("y", function(d,index) {
    //        //console.log(index);
    //        //console.log(nodes.length);
    //        //console.log(index % nodes.length);
    //
    //
    //
    //
    //        return Math.floor((index/nodes.length))* cell_size })
    //    .attr("dy", "0.5em")
    //    .text(function(index){
    //    {
    //        if (index <nodes.length) {
    //            return nodes[index];
    //        }
    //    } })
    //    .attr("transform", "rotate(90)");





cells.append("text")
        .attr("x", 17)
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);




            return (((index % nodes.length)) * cell_size) })
        .attr("dy", "1.2em")
        .text(function(d, index){if (d.FTR != "Na")
        {
            return nodes_trunc[index];
        } });
        //.attr("transform", "rotate(10)");

    //cells.append("text")
    //    .attr("x", function(d, index) {
    //
    //
    //        // count = 0;
    //        //team_count = (index % nodes.length)
    //
    //        //count = count + 1;
    //        //check_count();
    //        console.log(nodes);
    //        return (((index % nodes.length)) * cell_size) + 55 })
    //    .attr("y", function(d,index) {
    //        //console.log(index);
    //        //console.log(nodes.length);
    //        //console.log(index % nodes.length);
    //
    //
    //
    //
    //        return Math.floor((index/nodes.length))* cell_size })
    //    .attr("dy", "0.5em")
    //    .text(function(index){
    //    {
    //        if (index <nodes.length) {
    //            return nodes[index];
    //        }
    //    } })
    //    .attr("transform", "rotate(90)");



});




