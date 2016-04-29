/**
 * Created by Daniel on 4/29/16.
 */




$(function() {

    $( "#slider" ).slider({
        min: 1993,
        max: 2014,
        step:1,
        value: 2000,
        change: function (event, ui) { sliderUpdate() },
});





});

