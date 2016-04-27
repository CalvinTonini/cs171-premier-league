/**
 * Created by Eamon on 4/17/16.
 */

var margin = {top: 20, right: 0, bottom: 10, left: 80},
    width = 720,
    height = 550;

/* Initialize tooltip */
tiptext = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);

//tipcell = d3.tip()
//    .attr('class', 'd3-tip')
//    .offset([-10, 0]);

tiptext.html(function(d) { return "<strong>Home:</strong> <span style='color:red'>" + d.HomeTeam + "</span><br/><strong>Away:</strong> <span style='color:red'>" +d.AwayTeam+ "</span><br/><strong>Date:</strong> <span style='color:red'>" +formatDate(d.Date)+ "</span>"});
//tipcell.html(function(d) { return "<strong>Home:</strong> <span style='color:red'>" + d.HomeTeam + "</span><br/><strong>Away:</strong> <span style='color:red'>" +d.AwayTeam+ "</span><br/><strong>Date:</strong> <span style='color:red'>" +d.Date+ "</span>"});

var formatDate = d3.time.format("%B %m %Y");

var toggle = 0;

var svg_cells = d3.select("#matrix-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_info = d3.select("#matrix-info-area").append("svg")
    .attr("width", 390)
    .attr("height", 390)
    .append("g")
    .attr("transform", "translate(0, 50)");

svg_info.append("text")
    .attr("class", "tip");

/* Invoke the tip in the context of your visualization */
svg_cells.call(tiptext);
//svg.call(tipcell);


var tab = '\u00A0' + '\u00A0'+ '\u00A0'+ '\u00A0'+ '\u00A0'+ '\u00A0';

var Season_selection = "2014-2015";


d3.csv("data/matchesDates.csv", function(d) {

    return {
        Season: d.Season,
        HomeTeam: d.HomeTeam,
        AwayTeam: d.AwayTeam,
        FTR: d.FTR,
        FTHG: +d.FTHG,
        FTAG: +d.FTAG,
        Date: new Date (d.Date)
    };
}, function(error, data) {

    var vis = this;



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

    var cell_width = 32;
    var cell_height = 25;
    var rect = svg_cells.selectAll("rect")
        .data(data);
// Enter (initialize the newly added elements)

    var cells = svg_cells.selectAll("g")
        .data(data).enter()
        .append("g");


    cells.append("rect")
        .attr("class", "rect")
        .attr("id", function(d){return d.HomeTeam;})
        .attr("height", cell_height)
        .attr("width", 32)
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
                ) * cell_width) + 50 })
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);




            return Math.floor((index/nodes.length))* (cell_height +1) })
        .attr("stroke", "grey")
        .attr("fill", function(d){

            if (d.FTR == "H") {
                return "#72BCD4";
            }
            else if (d.FTR == "A"){
                return "#FF9999";
            }
            else if (d.FTR == "D"){
                return "lightgrey";
            }
            else if (d.FTR == "Na"){
                return "grey";
            }
        });
        //.on('mouseover', tipcell.show)
        //.on('mouseout', tipcell.hide);


    cells.append("text")
        .attr("x", function(d, index) {


            // count = 0;
            //team_count = (index % nodes.length)

            //count = count + 1;
            //check_count();
            return (((index % nodes.length)) * cell_width) + 55 })
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);





            return Math.floor((index/nodes.length))* (cell_height +1) })
        .attr("dy", "1.2em")
        .attr("class", "txtscore")
        .text(function(d){if (d.FTR != "Na")
        {
            return d.FTHG + "-" +d.FTAG
        } })
        .on('mouseover', tiptext.show)
        .on('mouseout', tiptext.hide)
        .on('click', function(d){

            //
            //if (toggle == 0)
            //{
            //    console.log(this);
            //    d3.select(this).style("fill","yellow");
            //    toggle = 1;
            //
            //}
            //else
            //{
            //    d3.selectAll(cells.txtscore).style("fill","black");
            //    toggle = 0;
            //}


            d3.selectAll("text.info")
                .remove();

            d3.selectAll("image.info")
                .remove();

            d3.selectAll("rect.box")
                .remove();


            svg_info.append("rect")
                .attr("class", "box")
                .attr("x", "5")
                .attr("y", "120")
                .attr("width", "380")
                .attr("height", "210")
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", "2");

            svg_info.append("text")
                .attr("class", "info")
                .attr("x", "190")
                .attr("y", "320")
                .style("text-anchor","middle")
                .text(formatDate(d.Date));


            svg_info.append("image")
                .attr("xlink:href", 'data/logos/' + d.HomeTeam  +'.png')
                .attr("class", "info")
                .attr("x", "20")
                .attr("y", "150")
                .attr("width", "130")
                .attr("height", "130");

            svg_info.append("image")
                .attr("xlink:href", 'data/logos/' + d.AwayTeam  +'.png')
                .attr("class", "info")
                .attr("x", "250")
                .attr("y", "150")
                .attr("width", "130")
                .attr("height", "130");



            svg_info.append("text")
                .attr("class", "info")
                .attr("x", "85")
                .attr("y", "145")
                .style("text-anchor","middle")
                .text(d.HomeTeam);


            svg_info.append("text")
                .attr("class", "info score")
                .attr("x", "160")
                .attr("y", "220")
                .text(d.FTHG + "-" +d.FTAG);

            svg_info.append("text")
                .attr("class", "info")
                .attr("x", "315")
                .attr("y", "145")
                .style("text-anchor","middle")
                .text(d.AwayTeam);

            //var imgs = svg.selectAll("image");




            //var para = document.createElement("p");
            //var node = document.createTextNode("This is new.");
            //para.appendChild(node);
            //var element = document.getElementById("matrix-info-area");
            //element.appendChild(para);

        });

    //console.log(nodes);
    var nodes_trunc = nodes;

    for (i=0; i<nodes_trunc.length; i++) {
        if (nodes_trunc[i] == "Blackburn") {
            nodes_trunc[i] = "Bbn";
        }
        else if (nodes_trunc[i] == "Man City") {
            nodes_trunc[i] = "MC";
        }
        else if (nodes_trunc[i] == "Man United") {
            nodes_trunc[i] = "MU";
        }
        else if (nodes_trunc[i] == "Sheffield United") {
            nodes_trunc[i] = "SU";
        }
        else if (nodes_trunc[i] == "Sheffield Weds") {
            nodes_trunc[i] = "SW";
        }
        else if (nodes_trunc[i] == "West Brom") {
            nodes_trunc[i] = "WB";
        }
        else if (nodes_trunc[i] == "West Ham") {
            nodes_trunc[i] = "WH";
        }
        else {
            nodes_trunc[i] = nodes_trunc[i].substring(0, 3);
        }

    };


    cells.append("text")
        .attr("x", function(d, index) {


            // count = 0;
            //team_count = (index % nodes.length)

            //count = count + 1;
            //check_count();
            return (((index % nodes.length)) * cell_width) + 56 })
        .attr("y", function(d,index) {
            //console.log(index);
            //console.log(nodes.length);
            //console.log(index % nodes.length);




            return Math.floor((index/nodes.length))* cell_width })
        .attr("dy", "-0.2em")
        .text(function(d, index){return nodes_trunc[index];});
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




            return (((index % nodes.length)) * cell_height) })
        .attr("dy", "1.2em")
        .text(function(d, index){return nodes_trunc[index];});
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
