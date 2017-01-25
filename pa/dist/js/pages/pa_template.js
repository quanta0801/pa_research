$(function () {
    //----------
    //- iCheck -
    //----------
    //Green color scheme for iCheck
    $('input[type="checkbox"].minimal-green, input[type="radio"].minimal-green').iCheck({
        checkboxClass: 'icheckbox_minimal-green',
        radioClass: 'iradio_minimal-green'
    });
    //Red color scheme for iCheck
    $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
        checkboxClass: 'icheckbox_minimal-red',
        radioClass: 'iradio_minimal-red'
    });
    //Yellow color scheme for iCheck
    $('input[type="checkbox"].minimal-yellow, input[type="radio"].minimal-yellow').iCheck({
        checkboxClass: 'icheckbox_minimal-yellow',
        radioClass: 'iradio_minimal-yellow'
    });

    var sliderDefaultValue = [19, 65];

    $("#ageSlider").slider({
        ticks: sliderDefaultValue,
        value: sliderDefaultValue,
        // ticks_labels: [19, 65],
    });

    $('#ageSlider').on('slide', function(sldEvt) {
        $('#ageSliderValue').text(sldEvt.value[0] + ' - ' + sldEvt.value[1]);
    });

    $('input[name="area_filter"]').prop('disabled', true);
    $('input[name="planning_area"]').prop('disabled', true);

    var default_options = { segment: 'PMET',
        filter_type: 'demographics',
        age: '19,65',
        gender: 'BOTH',
        race: [ 'CHINESE', 'EURASIAN', 'INDIAN', 'MALAY', 'OTHERS' ],
        infer_residence_region: [ 'central', 'east', 'north', 'northeast', 'west' ],
        infer_workplace_region: [ 'central', 'east', 'north', 'northeast', 'west' ] };

    var sample_submit1 = { segment: 'PMET',
        filter_type: 'demographics',
        age: '19,65',
        gender: 'BOTH',
        race: [ 'CHINESE', 'EURASIAN', 'INDIAN', 'MALAY', 'OTHERS' ],
        infer_residence_region: [ 'central', 'east', 'north', 'northeast', 'west' ],
        infer_workplace_region: [ 'central', 'east', 'north', 'northeast', 'west' ] };

    var sample_submit2 = { segment: 'Parents',
        filter_type: 'planning_area',
        area_filter: 'infer_residence_',
        planning_area: 'bishan'
    };
    var sample_submit3 = { segment: 'PMET',
        filter_type: 'planning_area',
        area_filter: 'infer_workplace_',
        planning_area: 'bukit_merah'
    };

    var default_demo_op = {
        age: '19,65',
        gender: 'BOTH',
        race: [ 'CHINESE', 'EURASIAN', 'INDIAN', 'MALAY', 'OTHERS' ],
        infer_residence_region: [ 'central', 'east', 'north', 'northeast', 'west' ],
        infer_workplace_region: [ 'central', 'east', 'north', 'northeast', 'west' ]
    };

    var default_pArea_op = {
        area_filter: 'infer_residence_',
        planning_area: 'bishan'
    };

    // getCookieData(){
    //     urlParth = "cookie_data"
    //     $.ajax(
    //         url: urlPath
    //     ).then(parseCookie)
    // }

    parseCurrentFilter(default_options);

    function disableOptions(value) {
        var bool = null;
        if (value == 'planning_area') {
            bool = true;
            $('#ageSlider').slider('disable');
        } else if (value == 'demographics') {
            bool = false;
            $('#ageSlider').slider('enable');
        } else {
            console.log('Invalid Option!');
            console.log('filter_type: ' + value)
        }
        $('input[name="gender"]').prop('disabled', bool);
        $('input[name="race"]').prop('disabled', bool);
        $('input[name="infer_residence_region"]').prop('disabled', bool);
        $('input[name="infer_workplace_region"]').prop('disabled', bool);
        $('input[name="area_filter"]').prop('disabled', !bool);
        $('input[name="planning_area"]').prop('disabled', !bool);
    };

    function clearAllOptions() {
        $('input').prop('disabled', false);
        $('input').iCheck('uncheck');
    }

    function checkThisOption(name, value) {
        $('input[name="' + name + '"]' + '[value="' + value + '"]').iCheck('check');
    }

    function parseCurrentFilter(filter_op) {
        clearAllOptions();
        parseSelections(filter_op);
        if (filter_op.segment == 'PMET') {
            $('#segment_PMET').addClass('active');
            $('#segment_Parents').removeClass('active');
        } else if (filter_op.segment == 'Parents') {
            $('#segment_Parents').addClass('active');
            $('#segment_PMET').removeClass('active');
        }
        if (filter_op.filter_type == 'demographics') {
            $('#filter_type_demographics').addClass('active');
            $('#filter_type_planning_area').removeClass('active');
            $('#demographics-tab').addClass('active');
            $('#planning_area-tab').removeClass('active');
        } else  if (filter_op.filter_type == 'planning_area') {
            $('#filter_type_planning_area').addClass('active');
            $('#filter_type_demographics').removeClass('active');
            $('#planning_area-tab').addClass('active');
            $('#demographics-tab').removeClass('active');
            if (filter_op.area_filter == 'infer_residence_') {
                $('#area_filter_infer_residence_').addClass('active');
                $('#area_filter_infer_workplace_').removeClass('active');
                console.log('residence activated')
            } else if (filter_op.area_filter == 'infer_workplace_') {
                $('#area_filter_infer_workplace_').addClass('active');
                $('#area_filter_infer_residence_').removeClass('active');
                console.log('workplace activated')
            } else {
                console.log('wrong area_filter')
            }
        }
        disableOptions(filter_op.filter_type);
        if (filter_op.filter_type == 'demographics') {
            parseSelections(default_pArea_op);
        } else if (filter_op.filter_type == 'planning_area') {
            parseSelections(default_demo_op);
        }
    }

    function parseSelections(selected) {
        Object.keys(selected).map(function(key) {
            if (key == 'age') {
                var ageRange = selected[key].split(',').map(Number);
                $('#ageSlider').slider('setValue', ageRange);
                $('#ageSliderValue').text(ageRange[0] + ' - ' + ageRange[1]);
            } else if (typeof selected[key] === 'string'){
                checkThisOption(key, selected[key]);
            } else {
                selected[key].map(function(value){
                    checkThisOption(key, value);
                })
            }
        });
    }

    $('input:radio[name="filter_type"]').change(function() {
        disableOptions($(this).val());
    });

    // $('#button1').click(function() {
    //     parseCurrentFilter(sample_submit1);
    // });
    //
    // $('#button2').click(function() {
    //     parseCurrentFilter(sample_submit3);
    // });
});