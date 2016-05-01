/**
 * Created by Eamon on 4/17/16.
 */



//$(function() {
//
//    $( "#slider" ).slider({
//        min: 1993,
//        max: 2014,
//        step:1,
//        value: 2000,
//        change: function (event, ui) { update_matrix();}
//    });
//
//});




// Object constructor function
matrix = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    // Call an object function
    this.initVis();
};

matrix.prototype.initVis = function(data) {

    document.querySelector( '#matrix-area' ).innerHTML = '';
    document.querySelector( '#matrix-info-area' ).innerHTML = '';


    d3.csv("data/eamon.csv", function(data) {
        var vis = this;

        //console.log(data);


        vis.margin = {top: 60, right: 0, bottom: 10, left: 80},
            vis.width = 720,
            vis.height = 650;

        var trunc_id = -1;

        /* Initialize tooltip */
        vis.tiptext = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0]);

//tipcell = d3.tip()
//    .attr('class', 'd3-tip')
//    .offset([-10, 0]);

        vis.tiptext.html(function (d) {
            return "<strong>Home:</strong> <span style='color:red'>" + d.HomeTeam + "</span><br/><strong>Away:</strong> <span style='color:red'>" + d.AwayTeam + "</span><br/><strong>Date:</strong> <span style='color:red'>" + vis.formatDate(d.Date) + "</span>"
        });
//tipcell.html(function(d) { return "<strong>Home:</strong> <span style='color:red'>" + d.HomeTeam + "</span><br/><strong>Away:</strong> <span style='color:red'>" +d.AwayTeam+ "</span><br/><strong>Date:</strong> <span style='color:red'>" +d.Date+ "</span>"});

        vis.formatDate = d3.time.format("%B, %e %Y");

        //var toggle = 0;

        vis.svg_cells = d3.select("#matrix-area").append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .style("margin-left", -vis.margin.left + "px")
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.svg_cells.selectAll("*").remove();


        vis.svg_info = d3.select("#matrix-info-area").append("svg")
            .attr("width", 400)
            .attr("height", 580)
            .append("g")
            .attr("transform", "translate(0, 50)");

        vis.svg_info.append("text")
            .attr("class", "tip");

        /* Invoke the tip in the context of your visualization */
        vis.svg_cells.call(vis.tiptext);
//svg.call(tipcell);


        //  var tab = '\u00A0' + '\u00A0' + '\u00A0' + '\u00A0' + '\u00A0' + '\u00A0';

        var slider = $("#slider").labeledslider("option", "value");


        var slider_2 = slider + 1;

        var Season_selection = slider + "-" + slider_2;
        //console.log(Season_selection)


        //console.log(data);

        //var vis = this;
        //
        //var parseDate = d3.time.format("%Y-%m-%d").parse;


        data.forEach(function (d) {

            var unique = 1;
            for (var name in d) {
                if (name != "Date" && name != "AwayTeam" && name != "FTR" && name != "Season" && name != "HomeTeam") {
                    d[name] = +d[name]
                }
            }
            //d.Date = parseDate(d.Date)
            d.Date = d3.time.format("%m/%e/%y").parse(d.Date)


        });

//console.log(data);

        data = data.filter(function (d) {
            return d.Season == Season_selection
        });

        console.log("HERE:")
       console.log(data);


        //console.log(data)

        var nodes = [];

        for (i = 0; i < data.length; i++) {
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


        for (i = 0; i < data.length; i++) {
            placeholder = {
                AwayTeam: data[i].HomeTeam,
                FTAG: 0,
                FTHG: 0,
                FTR: "Na",
                HomeTeam: data[i].HomeTeam,
                Season: Season_selection,
                unique_id: data[i].unique_id
            };

            //console.log(placeholder);
            if (i == 0 || (i % 21 == 0)) {
                data.splice(i, 0, placeholder);

                //console.log(placeholder);
                //console.log(data);
            }


        }

        data.splice(data.length, 0, placeholder);



        var count = 0;
        //team_count = 0;


        //console.log(nodes);
        //console.log(placeholder);
        //console.log(data);

        var cell_width = 32;
        var cell_height = 25;
        vis.rect = vis.svg_cells.selectAll("rect")
            .data(data);
// Enter (initialize the newly added elements)

        vis.cells = vis.svg_cells.selectAll("g")
            .data(data).enter()
            .append("g");


        vis.cells.append("rect")
            .attr("class", "rect")
            .attr("id", function (d) {

                return "game"+ d.unique_id.toString();
            })
            .attr("height", cell_height)
            .attr("width", 32)
            .attr("x", function (d, index) {

                //function check_count(){
                //    if (d.AwayTeam != nodes[team_count]) {
                //        //count = count + 1;
                //        //check_count();
                //    }
                //}

                //count = 0;
                //team_count = (index % nodes.length)

                //count = count + 1;
                //check_count();


                return (((index % nodes.length) //+ count
                    ) * cell_width) + 50
            })
            .attr("y", function (d, index) {
                //console.log(index);
                //console.log(nodes.length);
                //console.log(index % nodes.length);


                return Math.floor((index / nodes.length)) * (cell_height + 1)
            })
            .attr("stroke", "grey")
            .attr("fill", function (d) {

                if (d.FTR == "H") {
                    return "#72BCD4";
                }
                else if (d.FTR == "A") {
                    return "#FF9999";
                }
                else if (d.FTR == "D") {
                    return "lightgrey";
                }
                else if (d.FTR == "Na") {
                    return "grey";
                }
            });
        //.on('mouseover', tipcell.show)
        //.on('mouseout', tipcell.hide);


        vis.svg_cells.append("rect")
            .attr("height", cell_height)
            .attr("width", 32)
            .attr("x", "445")
            .attr("y", "-45")
            .attr("stroke", "grey")
            .attr("fill", "lightgrey");

        vis.svg_cells.append("text")
            .attr("x", "485")
            .attr("y", "-28")
            .text("Draw");

        vis.svg_cells.append("rect")
            .attr("height", cell_height)
            .attr("width", 32)
            .attr("x", "120")
            .attr("y", "-45")
            .attr("stroke", "grey")
            .attr("fill", "#72BCD4");

        vis.svg_cells.append("text")
            .attr("x", "160")
            .attr("y", "-28")
            .text("Home Team Win");

        vis.svg_cells.append("rect")
            .attr("height", cell_height)
            .attr("width", 32)
            .attr("x", "280")
            .attr("y", "-45")
            .attr("stroke", "grey")
            .attr("fill", "#FF9999");

        vis.svg_cells.append("text")
            .attr("x", "320")
            .attr("y", "-28")
            .text("Home Team Loss");

        vis.cells.append("text")
            .attr("x", function (d, index) {


                // count = 0;
                //team_count = (index % nodes.length)

                //count = count + 1;
                //check_count();
                return (((index % nodes.length)) * cell_width) + 55
            })
            .attr("y", function (d, index) {
                //console.log(index);
                //console.log(nodes.length);
                //console.log(index % nodes.length);


                return Math.floor((index / nodes.length)) * (cell_height + 1)
            })
            .attr("dy", "1.2em")
            .attr("class", "txtscore")
            .attr("id", function (d) {
                return "game" + d.unique_id.toString();
            })
            .text(function (d) {
                if (d.FTR != "Na") {
                    return d.FTHG + "-" + d.FTAG
                }
            })
            .on('mouseover', vis.tiptext.show)
            .on('mouseout', vis.tiptext.hide)
            .on('click', function (d) {
                console.log(d.unique_id);

                trunc_id = d.unique_id.toString;

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
                //    toggle = 0; .
                //}

                highlightGame(trunc_id, d.HomeTeam, d.AwayTeam)


                d3.selectAll("text.info")
                    .remove();

                d3.selectAll("image.info")
                    .remove();

                //d3.selectAll("rect.box")
                //    .remove();

                d3.selectAll("text.info_small")
                    .remove();


                //vis.svg_info.append("rect")
                //    .attr("class", "box")
                //    .attr("x", "5")
                //    .attr("y", "20")
                //    .attr("width", "390")
                //    .attr("height", "320")
                //    .attr("fill", "white")
                //    .attr("stroke", "black")
                //    .attr("stroke-width", "2");

                vis.svg_info.append("text")
                    .attr("class", "info")
                    .attr("x", "190")
                    .attr("y", "220")
                    .style("text-anchor", "middle")
                    .text(vis.formatDate(d.Date));


                vis.svg_info.append("image")
                    .attr("xlink:href", 'data/logos/' + d.HomeTeam + '.png')
                    .attr("class", "info")
                    .attr("x", "20")
                    .attr("y", "50")
                    .attr("width", "130")
                    .attr("height", "130");

                vis.svg_info.append("image")
                    .attr("xlink:href", 'data/logos/' + d.AwayTeam + '.png')
                    .attr("class", "info")
                    .attr("x", "250")
                    .attr("y", "50")
                    .attr("width", "130")
                    .attr("height", "130");


                vis.svg_info.append("text")
                    .attr("class", "info")
                    .attr("x", "85")
                    .attr("y", "45")
                    .style("text-anchor", "middle")
                    .text(d.HomeTeam);


                vis.svg_info.append("text")
                    .attr("class", "info score")
                    .attr("x", "160")
                    .attr("y", "120")
                    .text(d.FTHG + "-" + d.FTAG);

                vis.svg_info.append("text")
                    .attr("class", "info")
                    .attr("x", "315")
                    .attr("y", "45")
                    .style("text-anchor", "middle")
                    .text(d.AwayTeam);


                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "315")
                    .attr("y", "260")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Shots: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "350")
                    .attr("y", "260")
                    .style("text-anchor", "middle")
                    .text(d.AS);


                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "80")
                    .attr("y", "260")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Shots: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "115")
                    .attr("y", "260")
                    .style("text-anchor", "middle")
                    .text(d.HS);

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "315")
                    .attr("y", "280")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Shots on Target: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "385")
                    .attr("y", "280")
                    .style("text-anchor", "middle")
                    .text(d.AST);

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "85")
                    .attr("y", "280")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Shots on Target: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "155")
                    .attr("y", "280")
                    .style("text-anchor", "middle")
                    .text(d.HST);

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "315")
                    .attr("y", "300")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Yellow Cards: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "375")
                    .attr("y", "300")
                    .style("text-anchor", "middle")
                    .text(d.AY);

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "85")
                    .attr("y", "300")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Yellow Cards: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "145")
                    .attr("y", "300")
                    .style("text-anchor", "middle")
                    .text(d.HY);

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "315")
                    .attr("y", "320")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Red Cards: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "365")
                    .attr("y", "320")
                    .style("text-anchor", "middle")
                    .text(d.AR);

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "85")
                    .attr("y", "320")
                    .style("text-anchor", "middle")
                    .style("font-weight", "bold")
                    .text("Red Cards: ");

                vis.svg_info.append("text")
                    .attr("class", "info_small")
                    .attr("x", "135")
                    .attr("y", "320")
                    .style("text-anchor", "middle")
                    .text(d.HR);


                //var imgs = svg.selectAll("image");


                //var para = document.createElement("p");
                //var node = document.createTextNode("This is new.");
                //para.appendChild(node);
                //var element = document.getElementById("matrix-info-area");
                //element.appendChild(para);

            });

        vis.cells.append("text")
            .attr("x", 0)
            .attr("y", function (d, index) {
                //console.log(index);
                //console.log(nodes.length);
                //console.log(index % nodes.length);


                return (((index % nodes.length)) * (cell_height + 1) )
            })
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .text(function (d, index) {
                return nodes[index];
            });

        vis.svg_cells.append("text")
            .attr("x", 18)
            .attr("y", -25)
            .attr("dy", ".1em")
            .style("text-anchor", "middle")
            .attr("class", "label")
            .text("Home ╲ Away");


        //console.log(nodes);
        var nodes_trunc = nodes;

        for (i = 0; i < nodes_trunc.length; i++) {
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

        }


        vis.cells.append("text")
            .attr("x", function (d, index) {


                // count = 0;
                //team_count = (index % nodes.length)

                //count = count + 1;
                //check_count();
                return (((index % nodes.length)) * cell_width) + 56
            })
            .attr("y", function (d, index) {
                //console.log(index);
                //console.log(nodes.length);
                //console.log(index % nodes.length);


                return Math.floor((index / nodes.length)) * cell_width
            })
            .attr("dy", "-0.2em")
            .text(function (d, index) {
                return nodes[index];
            });

        //vis.svg_cells.exit().remove();
        //vis.svg_info.exit().remove();
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
};

