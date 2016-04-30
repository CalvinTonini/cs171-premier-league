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



    //
    //$( "#slider" ).labeledslider({
    //    min: 1993,
    //    max: 2014,
    //    step:1,
    //    value: 2000,
    //    change: function (event, ui) { sliderUpdate() },
    //});

    //var $slider =  $('#slider');
    //var max =  $slider.slider("option", "max") -  $slider.slider("option", "min")
    //var spacing =  100 / (max -1);
    //
    //$slider.find('.ui-slider-tick-mark').remove();
    //for (var i = 0; i < max ; i++) {
    //    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
    //}
    //
    //var number = 1993;
    //for (var i = 0; i < max ; i++) {
    //    $('<text class = "sliderticks">'+number.toString()+" "+ '</text>').css('left', (spacing * i -5) +  '%').appendTo($slider);
    //    number = number+=1
    //}

});



//function setSliderTicks(){
//    var $slider =  $('#slider');
//    var max =  $slider.slider("option", "max");
//    var spacing =  100 / (max -1);
//
//    $slider.find('.ui-slider-tick-mark').remove();
//    for (var i = 0; i < max ; i++) {
//        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
//    }
//}