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

var season_for_info = 0;


// Object constructor function
matrix_object = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.data = _data;
    // Call an object function
    this.initVis();
};

matrix_object.prototype.initVis = function() {

    var vis = this;

    //document.querySelector( '#matrix-area' ).innerHTML = '';
    //document.querySelector( '#matrix-info-area' ).innerHTML = '';

    vis.data.forEach(function (d) {
        var unique = 1;
        for (var name in d) {
            if (name != "Date" && name != "AwayTeam" && name != "FTR" && name != "Season" && name != "HomeTeam") {
                d[name] = +d[name]
            }
        }
        d.Date = d3.time.format("%m/%e/%y").parse(d.Date)

    });

    vis.cell_width = 32;
    vis.cell_height = 25;


    vis.margin = {top: 60, right: 0, bottom: 10, left: 80};
    vis.width = 820;
    vis.height = 600;

        /* Initialize tooltip */
    vis.tiptext = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

    vis.tiptext.html(function (d) {
        return "<strong>Home:</strong> <span style='color:red'>" + d.HomeTeam + "</span><br/><strong>Away:</strong> <span style='color:red'>" + d.AwayTeam + "</span><br/><strong>Date:</strong> <span style='color:red'>" + vis.formatDate(d.Date) + "</span>"
    });


    vis.formatDate = d3.time.format("%B, %e %Y");


    vis.svg_cells = d3.select("#matrix-area").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .style("margin-left", -vis.margin.left + "px")
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //vis.svg_cells.selectAll("*").remove();


    vis.svg_info = d3.select("#matrix-info-area").append("svg")
        .attr("width", 400)
        .attr("height", 580)
        .append("g")
        .attr("transform", "translate(0, 50)")

    vis.svg_info.append("text")
        .attr("class", "tip");

    vis.svg_cells.call(vis.tiptext);

    vis.svg_cells.append("rect")
        .attr("height", vis.cell_height)
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
        .attr("height", vis.cell_height)
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
        .attr("height", vis.cell_height)
        .attr("width", 32)
        .attr("x", "280")
        .attr("y", "-45")
        .attr("stroke", "grey")
        .attr("fill", "#FF9999");

    vis.svg_cells.append("text")
        .attr("x", "320")
        .attr("y", "-28")
        .text("Home Team Loss");


    vis.svg_cells.append("text")
        .attr("x", 18)
        .attr("y", -25)
        .attr("dy", ".1em")
        .style("text-anchor", "middle")
        .attr("class", "label")
        .text("Home ╲ Away");


    vis.svg_info.append("image")
        .attr("class", "info")
        .attr("x", "20")
        .attr("y", "50")
        .attr("width", "130")
        .attr("height", "130")
        .attr("id","image1");

    vis.svg_info.append("image")
        .attr("class", "info")
        .attr("x", "250")
        .attr("y", "50")
        .attr("width", "130")
        .attr("height", "130")
        .attr("id","image2");

    vis.svg_info.append("text")
        .attr("class", "info")
        .attr("x", "190")
        .attr("y", "220")
        .style("text-anchor", "middle")
        .attr("id","infodate");


    vis.svg_info.append("text")
        .attr("class", "info")
        .attr("x", "85")
        .attr("y", "45")
        .style("text-anchor", "middle")
        .attr("id","hometeam");


    vis.svg_info.append("text")
        .attr("class", "info score")
        .attr("x", "160")
        .attr("y", "120")
        .attr("id","score");

    vis.svg_info.append("text")
        .attr("class", "info")
        .attr("x", "315")
        .attr("y", "45")
        .style("text-anchor", "middle")
        .attr("id","awayteam");




        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "315")
            .attr("y", "260")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "shots1")
            .text("Shots: ");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "80")
            .attr("y", "260")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "shots2")
            .text("Shots: ");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "350")
            .attr("y", "260")
            .style("text-anchor", "middle")
            .attr("id", "awayshots");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "115")
            .attr("y", "260")
            .style("text-anchor", "middle")
            .attr("id", "homeshots");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "315")
            .attr("y", "280")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "shotsontarget1")
            .text("Shots on Target: ");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "85")
            .attr("y", "280")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "shotsontarget2")
            .text("Shots on Target: ");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "315")
            .attr("y", "300")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "yellowcards1")
            .text("Yellow Cards: ");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "85")
            .attr("y", "300")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "yellowcards2")
            .text("Yellow Cards: ");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "315")
            .attr("y", "320")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "redcards1")
            .text("Red Cards: ");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "85")
            .attr("y", "320")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .attr("id", "redcards2")
            .text("Red Cards: ");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "385")
            .attr("y", "280")
            .style("text-anchor", "middle")
            .attr("id", "awayshotstarget");

        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "155")
            .attr("y", "280")
            .style("text-anchor", "middle")
            .attr("id", "homeshotstarget");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "375")
            .attr("y", "300")
            .style("text-anchor", "middle")
            .attr("id", "awayyellowcards");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "145")
            .attr("y", "300")
            .style("text-anchor", "middle")
            .attr("id", "homeyellowcards");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "365")
            .attr("y", "320")
            .style("text-anchor", "middle")
            .attr("id", "awayredcards");


        vis.svg_info.append("text")
            .attr("class", "info_small")
            .attr("x", "135")
            .attr("y", "320")
            .style("text-anchor", "middle")
            .attr("id", "homeredcards");


    vis.wrangleData();


}

matrix_object.prototype.wrangleData = function() {


    var vis = this;


    vis.season = $("#slider").labeledslider("option", "value");
    //console.log(value);


    vis.season = vis.season.toString() + "-" + (vis.season + 1).toString()


    function check(value) {
        return value.Season == vis.season;
    }

    season_for_info = vis.season;



    vis.filtered = vis.data.filter(check);

    console.log(vis.filtered);


    //console.log(data)

    vis.nodes = [];


    for (i = 0; i < vis.filtered.length; i++) {
        if (vis.nodes.indexOf(vis.filtered[i].HomeTeam) == -1) {
            vis.nodes.push(vis.filtered[i].HomeTeam);
        }
    }

    console.log('nodes');
    console.log(vis.nodes.length);
    console.log(vis.nodes);


    console.log(vis.filtered.length);

    for (i = 0; i < vis.filtered.length; i++) {
        placeholder = {
            AwayTeam: vis.filtered[i].HomeTeam,
            FTAG: 0,
            FTHG: 0,
            FTR: "Na",
            HomeTeam: vis.filtered[i].HomeTeam,
            Season: vis.season,
            unique_id: 9999
        };

        //console.log(placeholder);
        if (i == 0 || (i % (vis.nodes.length + 1) == 0)) {
            vis.filtered.splice(i, 0, placeholder);

            //console.log(placeholder);
            //console.log(data);
        }


    }

    vis.svg_info.style("display","none");

    vis.filtered.splice(vis.filtered.length, 0, placeholder);

    vis.displayData = vis.filtered;


    vis.updateVis();


}

matrix_object.prototype.updateVis= function() {

    var vis = this;

    var count = 0;

    var cell_width = 32;
    var cell_height = 25;

    //vis.rect = vis.svg_cells.selectAll("rect")
    //        .data(vis.displayData);

// Enter (initialize the newly added elements)
//

    vis.gamecells = vis.svg_cells.selectAll(".gamecells").data(vis.displayData);

    vis.gamecells.transition().duration(500)
        .attr("id", function (d) {
            return "game"+ d.unique_id.toString();
        })
        .attr("height", cell_height)
        .attr("width", 32)
        .attr("x", function (d, index) {

            return (((index % vis.nodes.length) //+ count
                ) * cell_width) + 50
        }).attr("y", function (d, index) {

            return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
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

    vis.gamecells.enter().append("rect")
        .attr("class","gamecells")
        .attr("id", function (d) {
            return "game"+ d.unique_id.toString();
        })
        .attr("height", cell_height)
        .attr("width", 32)
        .attr("x", function (d, index) {

            return (((index % vis.nodes.length) //+ count
                ) * cell_width) + 50
        }).attr("y", function (d, index) {

            return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
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

    vis.gamecells.exit().remove();



    vis.gametext = vis.svg_cells.selectAll(".resultstext").data(vis.displayData);


    vis.gametext.transition().duration(500)
        .attr("x", function (d, index) {

            return (((index % vis.nodes.length)) * cell_width) + 55
        })
        .attr("y", function (d, index) {

            return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
        })
        .attr("dy", "1.2em")
        .attr("id", function (d) {
            return "game" + d.unique_id.toString();
        })
        .text(function (d) {
            if (d.FTR != "Na") {
                return d.FTHG + "-" + d.FTAG
            }
        });


    vis.gametext.enter().append("text")
        .attr("class","resultstext")
        .attr("x", function (d, index) {

            return (((index % vis.nodes.length)) * cell_width) + 55
        })
        .attr("y", function (d, index) {

            return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
        })
        .attr("dy", "1.2em")
        .attr("id", function (d) {
            return "game" + d.unique_id.toString();
        })
        .text(function (d) {
            if (d.FTR != "Na") {
                return d.FTHG + "-" + d.FTAG
            }
        });


    vis.gametext
        .on('mouseover', vis.tiptext.show)
        .on('mouseout', vis.tiptext.hide)
        .on('click', function (d) {

            vis.svg_info.style("display","block");
            vis.svg_info.select("#image1").attr("xlink:href", 'data/logos/' + d.HomeTeam + '.png')
            vis.svg_info.select("#image2").attr("xlink:href", 'data/logos/' + d.AwayTeam + '.png')
            vis.svg_info.select("#infodate").text(vis.formatDate(d.Date));
            vis.svg_info.select("#hometeam").text(d.HomeTeam);
            vis.svg_info.select("#awayteam").text(d.AwayTeam);
            vis.svg_info.select("#score").text(d.FTHG + "-" + d.FTAG);

            var selected = $( "#slider" ).labeledslider( "option", "value" );

            console.log ("Here");
            console.log (selected);
            if ( selected > 1999) {

            vis.svg_info.select("#awayshots").text(d.AS);
            vis.svg_info.select("#homeshots").text(d.HS);
            vis.svg_info.select("#awayshotstarget").text(d.AST);
            vis.svg_info.select("#homeshotstarget").text(d.HST);
            vis.svg_info.select("#awayyellowcards").text(d.AY);
            vis.svg_info.select("#awayredcards").text(d.AR);
            vis.svg_info.select("#homeyellowcards").text(d.HY);
            vis.svg_info.select("#homeredcards").text(d.HR);

            vis.svg_info.select("#awayshots").style('opacity', 1);
            vis.svg_info.select("#homeshots").style('opacity', 1);
            vis.svg_info.select("#awayshotstarget").style('opacity', 1);
            vis.svg_info.select("#homeshotstarget").style('opacity', 1);
            vis.svg_info.select("#awayyellowcards").style('opacity', 1);
            vis.svg_info.select("#awayredcards").style('opacity', 1);
            vis.svg_info.select("#homeyellowcards").style('opacity', 1);
            vis.svg_info.select("#homeredcards").style('opacity', 1);
            vis.svg_info.select("#shots1").style('opacity', 1);
            vis.svg_info.select("#shots2").style('opacity', 1);
            vis.svg_info.select("#shotsontarget1").style('opacity', 1);
            vis.svg_info.select("#shotsontarget2").style('opacity', 1);
            vis.svg_info.select("#redcards1").style('opacity', 1);
            vis.svg_info.select("#redcards2").style('opacity', 1);
            vis.svg_info.select("#yellowcards1").style('opacity', 1);
            vis.svg_info.select("#yellowcards2").style('opacity', 1);

        }
            if ( selected <= 1999) {

                vis.svg_info.select("#awayshots").style('opacity', 0);
                vis.svg_info.select("#homeshots").style('opacity', 0);
                vis.svg_info.select("#awayshotstarget").style('opacity', 0);
                vis.svg_info.select("#homeshotstarget").style('opacity', 0);
                vis.svg_info.select("#awayyellowcards").style('opacity', 0);
                vis.svg_info.select("#awayredcards").style('opacity', 0);
                vis.svg_info.select("#homeyellowcards").style('opacity', 0);
                vis.svg_info.select("#homeredcards").style('opacity', 0);
                vis.svg_info.select("#shots1").style('opacity', 0);
                vis.svg_info.select("#shots2").style('opacity', 0);
                vis.svg_info.select("#shotsontarget1").style('opacity', 0);
                vis.svg_info.select("#shotsontarget2").style('opacity', 0);
                vis.svg_info.select("#redcards1").style('opacity', 0);
                vis.svg_info.select("#redcards2").style('opacity', 0);
                vis.svg_info.select("#yellowcards1").style('opacity', 0);
                vis.svg_info.select("#yellowcards2").style('opacity', 0);

            }

        });

    vis.gametext.exit().remove();



    //vis.gametext.exit().remove();



    //vis.cells.enter().append("g");
    //
    //vis.cells.selectAll("rect")
    //    .attr("id", function (d) {
    //        return "game"+ d.unique_id.toString();
    //    })
    //    .attr("height", cell_height)
    //    .attr("width", 32)
    //    .attr("x", function (d, index) {
    //
    //        return (((index % vis.nodes.length) //+ count
    //            ) * cell_width) + 50
    //    }).attr("y", function (d, index) {
    //
    //        return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
    //    })
    //    .attr("stroke", "grey")
    //    .attr("fill", function (d) {
    //
    //        if (d.FTR == "H") {
    //            return "#72BCD4";
    //        }
    //        else if (d.FTR == "A") {
    //            return "#FF9999";
    //        }
    //        else if (d.FTR == "D") {
    //            return "lightgrey";
    //        }
    //        else if (d.FTR == "Na") {
    //            return "grey";
    //        }
    //    });
    //
    //vis.cells.selectAll(".results")
    //    .attr("x", function (d, index) {
    //
    //        return (((index % vis.nodes.length)) * cell_width) + 55
    //    })
    //    .attr("y", function (d, index) {
    //
    //        return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
    //    })
    //    .attr("dy", "1.2em")
    //    .attr("class", "txtscore")
    //    .attr("id", function (d) {
    //        return "game" + d.unique_id.toString();
    //    })
    //    .text(function (d) {
    //        if (d.FTR != "Na") {
    //            return d.FTHG + "-" + d.FTAG
    //        }
    //    })
    //    .on('mouseover', vis.tiptext.show)
    //    .on('mouseout', vis.tiptext.hide)
    //    .on('click', function (d) {
    //
    //        vis.svg_info.style("display","block");
    //        vis.svg_info.select("#image1").attr("xlink:href", 'data/logos/' + d.HomeTeam + '.png')
    //        vis.svg_info.select("#image2").attr("xlink:href", 'data/logos/' + d.AwayTeam + '.png')
    //        vis.svg_info.select("#infodate").text(vis.formatDate(d.Date));
    //        vis.svg_info.select("#hometeam").text(d.HomeTeam);
    //        vis.svg_info.select("#awayteam").text(d.AwayTeam);
    //        vis.svg_info.select("#awayshots").text(d.AS);
    //        vis.svg_info.select("#homeshots").text(d.HS);
    //        vis.svg_info.select("#score").text(d.FTHG + "-" + d.FTAG);
    //        vis.svg_info.select("#awayshotstarget").text(d.AST);
    //        vis.svg_info.select("#homeshotstarget").text(d.HST);
    //        vis.svg_info.select("#awayyellowcards").text(d.AY);
    //        vis.svg_info.select("#awayredcards").text(d.AR);
    //        vis.svg_info.select("#homeyellowcards").text(d.HY);
    //        vis.svg_info.select("#homeredcards").text(d.HR);
    //
    //
    //    });
    //
    //vis.cells.append("rect")
    //    .attr("class", "rect")
    //    .attr("id", function (d) {
    //        return "game"+ d.unique_id.toString();
    //    })
    //    .attr("height", cell_height)
    //    .attr("width", 32)
    //    .attr("x", function (d, index) {
    //
    //        return (((index % vis.nodes.length) //+ count
    //            ) * cell_width) + 50
    //    }).attr("y", function (d, index) {
    //
    //        return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
    //    })
    //    .attr("stroke", "grey")
    //    .attr("fill", function (d) {
    //
    //        if (d.FTR == "H") {
    //            return "#72BCD4";
    //        }
    //        else if (d.FTR == "A") {
    //            return "#FF9999";
    //        }
    //        else if (d.FTR == "D") {
    //            return "lightgrey";
    //        }
    //        else if (d.FTR == "Na") {
    //            return "grey";
    //        }
    //    });
    //
    //
    //vis.cells.append("text")
    //    .attr("class","results")
    //    .attr("x", function (d, index) {
    //
    //        return (((index % vis.nodes.length)) * cell_width) + 55
    //    })
    //    .attr("y", function (d, index) {
    //
    //        return Math.floor((index / vis.nodes.length)) * (cell_height + 1)
    //    })
    //    .attr("dy", "1.2em")
    //    .attr("class", "txtscore")
    //    .attr("id", function (d) {
    //        return "game" + d.unique_id.toString();
    //    })
    //    .text(function (d) {
    //        if (d.FTR != "Na") {
    //            return d.FTHG + "-" + d.FTAG
    //        }
    //    })
    //    .on('mouseover', vis.tiptext.show)
    //    .on('mouseout', vis.tiptext.hide)
    //    .on('click', function (d) {
    //
    //        vis.svg_info.style("display","block");
    //        vis.svg_info.select("#image1").attr("xlink:href", 'data/logos/' + d.HomeTeam + '.png')
    //        vis.svg_info.select("#image2").attr("xlink:href", 'data/logos/' + d.AwayTeam + '.png')
    //        vis.svg_info.select("#infodate").text(vis.formatDate(d.Date));
    //        vis.svg_info.select("#hometeam").text(d.HomeTeam);
    //        vis.svg_info.select("#awayteam").text(d.AwayTeam);
    //        vis.svg_info.select("#awayshots").text(d.AS);
    //        vis.svg_info.select("#homeshots").text(d.HS);
    //        vis.svg_info.select("#score").text(d.FTHG + "-" + d.FTAG);
    //        vis.svg_info.select("#awayshotstarget").text(d.AST);
    //        vis.svg_info.select("#homeshotstarget").text(d.HST);
    //        vis.svg_info.select("#awayyellowcards").text(d.AY);
    //        vis.svg_info.select("#awayredcards").text(d.AR);
    //        vis.svg_info.select("#homeyellowcards").text(d.HY);
    //        vis.svg_info.select("#homeredcards").text(d.HR);
    //
    //
    //
    //    });
    //
    ////vis.cells.selectAll("text").data(function(d){return(d)}).exit().remove();
    //
    ////vis.cells.selectAll("rect").remove();
    ////vis.cells.selectAll("text").remove();
    //
    //
    //vis.cells.exit().remove();


    //vis.cells.selectAll("rect").data(function(d){return(d)}).exit().remove();

    //vis.gs.exit().remove();

    vis.teamlabels = vis.svg_cells.selectAll(".teamlabels").data(vis.displayData);

    vis.teamlabels.transition()
            .attr("x", 0)
            .attr("y", function (d, index) {

                return (((index % vis.nodes.length)) * (cell_height + 1) )
            })
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .text(function (d, index) {
                return vis.nodes[index];
            });

    vis.teamlabels.enter().append("text")
        .attr("class","teamlabels")
        .attr("x", 0)
        .attr("y", function (d, index) {

            return (((index % vis.nodes.length)) * (cell_height + 1) )
        })
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .text(function (d, index) {
            return vis.nodes[index];
        });

    vis.teamlabels.exit().transition().remove();

//
//
//
//
//
//
//
//
//var nodes_trunc = vis.nodes;
//
//    for (i = 0; i < nodes_trunc.length; i++) {
//        if (nodes_trunc[i] == "Blackburn") {
//            nodes_trunc[i] = "Bbn";
//        }
//        else if (nodes_trunc[i] == "Man City") {
//            nodes_trunc[i] = "MC";
//        }
//        else if (nodes_trunc[i] == "Man United") {
//            nodes_trunc[i] = "MU";
//        }
//        else if (nodes_trunc[i] == "Sheffield United") {
//            nodes_trunc[i] = "SU";
//        }
//        else if (nodes_trunc[i] == "Sheffield Weds") {
//            nodes_trunc[i] = "SW";
//        }
//        else if (nodes_trunc[i] == "West Brom") {
//            nodes_trunc[i] = "WB";
//        }
//        else if (nodes_trunc[i] == "West Ham") {
//            nodes_trunc[i] = "WH";
//        }
//        else {
//            nodes_trunc[i] = nodes_trunc[i].substring(0, 3);
//        }
//
//    }
//
//

    var nodes_trunc = vis.nodes;

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

    vis.abbreviated = vis.svg_cells.selectAll(".abbreviated").data(vis.displayData);

    vis.abbreviated.transition()
        .attr("x", function (d, index) {

        return (((index % vis.nodes.length)) * cell_width) + 56
        })
    .   attr("y", function (d, index) {

        return Math.floor((index / vis.nodes.length)) * cell_width
        })
        .attr("dy", "-0.2em")
        .text(function (d, index) {
            return vis.nodes[index];
        });

    vis.abbreviated.enter().append("text").attr("class","abbreviated")
        .attr("x", function (d, index) {

            return (((index % vis.nodes.length)) * cell_width) + 56
        })
        .attr("y", function (d, index) {

            return Math.floor((index / vis.nodes.length)) * cell_width
        })
        .attr("dy", "-0.2em")
        .text(function (d, index) {
            return vis.nodes[index];
        });




};

