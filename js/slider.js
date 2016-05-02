/**
 * Created by Daniel on 4/29/16.
 */




$(function() {




    $('#slider').labeledslider({
        min: 1993,
        max: 2014,
        tickinterval: 1,
        value: 2000,
        change: function (event, ui) { sliderUpdate() },
    });

});
