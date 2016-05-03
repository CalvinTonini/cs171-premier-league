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

    vis.svg1 = d3.select("#map").append("svg")
        .attr("width", vis.widthy)
        .attr("height", vis.heighty)
        .attr("id","seas");

    vis.g = vis.svg1.append("g");

    //vis.tips = d3.select("#map").append("div").attr("class","tooltip hidden");

    //vis.tiptext = d3.tip()
    //    .attr('class', 'd3-tip')
    //    .offset([-10, 0]);

    vis.tip = d3.select("#map").append("div").attr("class","tooltip hidden");

    vis.updateMap();
};

UKmap.prototype.updateMap = function (){
    var vis = this;

    vis.dats = vis.mapData;
    vis.dat1 = vis.logosData;

    var selected = $( "#slider" ).labeledslider( "option", "value" );

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
                .attr("height", 20)
                .attr("width",  20);
            d3.select(".logoZoom")
                .transition()
                .duration(750)
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
                .transition()
                .duration(750)
                .attr("width",50)
                .attr("height",50);
            vis.toggle = !vis.toggle;
        }

        vis.g.transition()
            .duration(750)
            .attr("transform", "translate(" + vis.widthy / 2 + ","
                + vis.heighty / 3 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    }

    vis.subunit2 = vis.g.selectAll(".subunit-label")
        .data(vis.subunits.features);

    vis.subunit2
        .enter().append("text");

    vis.subunit2
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + vis.path.centroid(d) +")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });

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

    vis.logos.on("mousemove", function(d,i) {
            var mouse = d3.mouse(vis.svg1.node()).map(function (d) {
                return parseInt(d);
            });
            vis.tip.classed("hidden", false)
                .attr("style", "left:" + (mouse[0]) + "px;top:" + (mouse[1]) + "px")
                .html(d.properties.club + " at " + "<span style='color:blue'>" + d.properties.name + "</span>");
        })
        .on("mouseout", function(d,i) {
            vis.tip.classed("hidden", true);
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
        else{ return 20;}
    }
    function logoHover () {
        if(vis.toggle){ return 50;}
        else{ return 25;}
    }

    vis.logos.call(vis.tiptext);
    vis.logos.exit().transition().duration(750).attr("height",0).attr("width",0).remove();
    vis.subunit1.exit().remove();
    vis.subunit2.exit().remove();

    d3.select("#sliderlabel").text(selected);

};
