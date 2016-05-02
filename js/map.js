/**
 * Created by cni on 2016-05-01.
 */

UKmap = function(_mapData, _logosData){
    this.mapData = _mapData;
    this.logosData = _logosData;
    this.initVis();
};

UKmap.prototype.initVis = function () {
    var vis = this;

    vis.widthy = 600;
    vis.heighty = 800;

    vis.projection = d3.geo.albers()
        .center([2.5, 54.0])
        .rotate([4.4, 0])
        .parallels([50, 60])
        .scale(750 * 10)
        .translate([vis.widthy / 2, vis.heighty / 3]);

    vis.path = d3.geo.path()
        .projection(vis.projection)
        .pointRadius(2);

    vis.toggle = true;

    vis.logoSelect = null;

//var zoom = d3.behavior.zoom()
//    .scaleExtent([1,5])
//    .on("zoom", zoomed);

    vis.svg1 = d3.select("#map").append("svg")
        .attr("width", vis.widthy)
        .attr("height", vis.heighty)
        .attr("id","seas");

    vis.g = vis.svg1.append("g");

    vis.tips = d3.select("#map").append("div").attr("class","tooltip hidden");

//var tips = d3.tip().attr('class', 'd3-tip').html(function(d) {
//    return "<strong>"+d.properties.club+"</strong> <br/> <span style='color:red'>" + d.properties.name + "</span>";
//});
//tips.offset([-10, 0]);
//svg1.call(tips);
    vis.updateMap();
};

UKmap.prototype.updateMap = function (){
    var vis = this;

    vis.dats = vis.mapData;
    vis.dat1 = vis.logosData;

    var selected = $( "#slider" ).labeledslider( "option", "value" );

    //var selected = +document.getElementById("myRange").value;

    vis.subunits = topojson.feature(vis.logosData, vis.logosData.objects.subunits);
    vis.places = {
            type: "FeatureCollection",
            features: topojson.feature(vis.dat1, vis.dat1.objects.places).features
                .filter(function(d){ return d.properties.seasons.includes(selected+1); })
        };


    vis.subunit1 = vis.g.selectAll(".subunit")
        .data(vis.subunits.features);

    vis.subunit1
        .enter().append("path");

    vis.subunit1
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", vis.path)
        .on("click",clicked)
        .on("dblclick",dblclicked);

    function clicked () {
        var x = d3.mouse(this)[0],
            y = d3.mouse(this)[1],
            k;

        if (!vis.toggle) { k = 4;}
        else { k = 1;}
        vis.g.transition()
            .duration(750)
            .attr("transform", "translate(" + ((vis.widthy / 2) + 3.5) + "," +
                ((vis.heighty  / 3) + 200) + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    }
    function dblclicked () {
        var x, y, k;

        if (vis.toggle) {
            x = d3.mouse(this)[0];
            y = d3.mouse(this)[1];
            k = 4;
            d3.selectAll(".enter")
                .transition()
                .duration(750)
                .attr("height", 15)
                .attr("width",  15);
            d3.select(".logoZoom")
                .attr("width",25)
                .attr("height",25);
            vis.toggle = !vis.toggle;
        } else {
            x = vis.widthy / 2;
            y = vis.heighty / 3;
            k = 1;
            d3.selectAll(".enter")
                .transition()
                .duration(750)
                .attr("height", 30)
                .attr("width",  30);
            d3.select(".logoZoom")
                .attr("width",40)
                .attr("height",40);
            vis.toggle = !vis.toggle;
        }

        vis.g.transition()
            .duration(750)
            .attr("transform", "translate(" + vis.widthy / 2 + ","
                + vis.heighty / 3 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    }
    //svg1.append("path")
    //    .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
    //    .attr("d", path)
    //    .attr("class", "subunit-boundary");
    //
    //svg1.append("path")
    //    .datum(topojson.mesh(mapData, mapData.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
    //    .attr("d", path)
    //    .attr("class", "subunit-boundary IRL");

    vis.subunit2 = vis.g.selectAll(".subunit-label")
        .data(vis.subunits.features);

    vis.subunit2
        .enter().append("text");

    vis.subunit2
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + vis.path.centroid(d) +")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

    //var dots = g.selectAll("circle")
    //    .data(places.features,function(d){ return d.properties.name;});
    //
    //dots.attr("class","update")
    //    .transition()
    //    .duration(2000)
    //    .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
    //    .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];});

    //dots.enter().append("circle")
    //    .attr("class","enter")
    //    .attr("class","place")
    //    .attr("fill","black")
    //    .attr("r",0)
    //    .attr("cx", function(d){ return projection(d.geometry.coordinates)[0];})
    //    .attr("cy", function(d){ return projection(d.geometry.coordinates)[1];})
    //    .transition()
    //    .duration(2000)
    //    .attr("r",4);
    vis.svg1.selectAll("image").classed({"logoZoom" : false, "enter" : true });
    vis.svg1.selectAll("image").style("opacity",1).attr("height",dimensionFunction).attr("width",dimensionFunction);


    vis.logos = vis.g.selectAll("image")
        .data(vis.places.features,function(d){ return d.properties.name});

    vis.logos.attr("x",function(d){ return vis.projection(d.geometry.coordinates)[0];})
        .attr("y",function(d){ return vis.projection(d.geometry.coordinates)[1];});

    vis.logos.enter().append("image")
        .attr("class","enter")
        .attr("id", function(d){ return d.properties.team;})
        .attr("xlink:href", function(d){ return 'data/logos/' + d.properties.team + '.png';})
        .attr("width","0")
        .attr("height","0")
        .attr("x",function(d){ return vis.projection(d.geometry.coordinates)[0];})
        .attr("y",function(d){ return vis.projection(d.geometry.coordinates)[1];})
        .transition()
        .duration(750)
        .attr("height", dimensionFunction)
        .attr("width", dimensionFunction);

    vis.logos.on("mousemove", function(d) {
            var mouse = d3.mouse(vis.svg1.node()).map( function(d) { return parseInt(d); } );
            vis.tips
                .classed("hidden", false)
                .attr("style", "left:"+(mouse[0])+"px;top:"+(mouse[1])+"px")
                .html(d.properties.name + " of " + d.properties.club + " Football Club");
        })
        .on("mouseout",  function() {
            vis.tips.classed("hidden", true);
        })
        .on("click", function(d){

            // Erase all selections opacities, start off fresh with opacity 1, regular sized logos
            vis.svg1.selectAll("image").classed({"logoZoom" : false, "enter" : true });
            vis.svg1.selectAll("image")
                .transition()
                .style("opacity",1)
                .attr("height",dimensionFunction)
                .attr("width",dimensionFunction);
            vis.places.features.forEach(function(d){
                unhighlightTeam(d.properties.team);
            });

            // Turn off the single-click centering on logos when zoomed, on when not zoomed
            if(vis.toggle){
                var x = d3.mouse(this)[0],
                    y = d3.mouse(this)[1],
                    k;

                if (!vis.toggle) { k = 4;}
                else { k = 1;}

                vis.g.transition()
                    .duration(750)
                    .attr("transform", "translate(" + ((vis.widthy / 2) + 2.5) + "," +
                        ((vis.heighty / 3) + 200) + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
            }

            // Onclick actions, make sure to "select"/"deselect" same logo, easily select others
            if(d && vis.logoSelect !== d){
                d3.select(this).classed("enter",false);
                d3.select(this).classed("logoZoom", true);
                d3.selectAll(".enter")
                    .transition()
                    .duration(750)
                    .style("opacity",0.3)
                    .attr("width",dimensionFunction)
                    .attr("height",dimensionFunction);
                d3.select(this)
                    .transition()
                    .duration(750)
                    .style("opacity",1)
                    .attr("width",logoHover)
                    .attr("height",logoHover);
                highlightTeam(d.properties.team);
                vis.logoSelect = d;
            }
            else{
                d3.select(this).classed({"enter" : true, "logoZoom" : false});
                d3.selectAll(".enter")
                    .transition()
                    .duration(750)
                    .style("opacity",1)
                    .attr("width",dimensionFunction)
                    .attr("height",dimensionFunction);
                unhighlightTeam(d.properties.team);
                vis.logoSelect = null;
            }
        });

    function dimensionFunction () {
        if(vis.toggle){ return 30;}
        else{ return 15;}
    }
    function logoHover () {
        if(vis.toggle){ return 40;}
        else{ return 25;}
    }

    //dots.on("mousemove", function(d,i) {
    //        var mouse = d3.mouse(svg1.node()).map( function(d) { return parseInt(d); } );
    //        tips
    //            .classed("hidden", false)
    //            .attr("style", "left:"+(mouse[0])+"px;top:"+(mouse[1])+"px")
    //            .html(d.properties.club)
    //    })
    //    .on("mouseout",  function(d,i) {
    //        tips.classed("hidden", true)
    //    })
    //    .on('click',function(d) {
    //        currentColor = currentColor == "black" ? "yellow" : "black";
    //        d3.selectAll("circle").style("fill","black");
    //        places.features.forEach(function(d){
    //            unhighlightTeam(d.properties.team);
    //        });
    //        if(currentColor == "yellow"){
    //            d3.select(this).style("fill", currentColor);
    //            highlightTeam(d.properties.team)
    //        }
    //        else{
    //            unhighlightTeam(d.properties.team)
    //        }
    //    });

    //dots.exit()
    //    .transition()
    //    .duration(2000)
    //    .attr("r", 0)
    //    .remove();

    vis.logos.exit().transition().duration(800).attr("height",0).attr("width",0).remove();
    vis.subunit1.exit().remove();
    vis.subunit2.exit().remove();

    d3.select("#sliderlabel").text(selected);


};

//function zoomed() {
//    var t = d3.event.translate;
//    var s = d3.event.scale;
//    var h = heighty / 3;
//    var w = widthy / 4;
//
//    t[0] = Math.min(widthy / 2 * (s - 1) + w * s, Math.max(widthy / 2 * (1 - s) - w * s, t[0]));
//    t[1] = Math.min(heighty / 2 * (s - 1) + h * s, Math.max(heighty / 2 * (1 - s) - h * s, t[1]));
//
//    zoom.translate(t);
//    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
//
//    //g.selectAll("circle")
//    //    .attr("r", function() {
//    //        var self = d3.select(this);
//    //        var r = 4 / d3.event.scale;
//    //        self.style("stroke-width", r < 4 ? (r < 2 ? 0.5 : 1) : 2);
//    //        return r;
//    //    });
//    g.selectAll("image")
//        .attr("height", function(){
//            //var self = d3.select(this);
//            var h = 25 / d3.event.scale;
//            //h = (h < 8  ? 5 : h)
//            //(h < 20 ? (w < 10 ? (h < 5 ? 5 : 10) : 15) : 25) : 30);
//            return h;
//        })
//        .attr("width", function() {
//            //var self = d3.select(this);
//            var w = 25 / d3.event.scale;
//            //w = (w < 8 ? 5 : w)
//            //(w < 20 ? (w < 10 ? (w < 5 ? 5 : 10) : 15) : 25) : 30);
//            return w;
//        });
//}

//svg1.call(zoom);
