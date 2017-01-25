$(function () {
    // $('#ageSlider').slider();
    $("#ageSlider").slider({
        ticks: [19, 25, 30, 35, 40, 45, 50, 55, 60, 65],
        value: [19, 65],
        ticks_labels: [19, 25, 30, 35, 40, 45, 50, 55, 60, 65],
    });
    $('#ageSlider').on('slide', function(sldEvt) {
        $('#ageSliderValue').text(sldEvt.value[0] + ' - ' + sldEvt.value[1]);
    });

    //Flat red color scheme for iCheck
    $('input[type="checkbox"].square-red, input[type="radio"].square-red').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    });

    //Flat red color scheme for iCheck
    $('input[type="checkbox"].square-green, input[type="radio"].square-green').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });

    //Flat red color scheme for iCheck
    $('input[type="checkbox"].square-orange, input[type="radio"].square-orange').iCheck({
        checkboxClass: 'icheckbox_square-orange',
        radioClass: 'iradio_square-orange'
    });

    $('#filter_save').on('click', function() {
       console.log('Segment selected is: ' + $('input[name="segment_selector"]:checked').val());
       // console.log('trying to print out e: ' + e);
    });
});