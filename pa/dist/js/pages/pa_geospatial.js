$(function () {
    //----------
    //- iCheck -
    //----------
    //Grey color scheme for iCheck
    $('input[type="checkbox"].minimal-grey, input[type="radio"].minimal-grey').iCheck({
        checkboxClass: 'icheckbox_minimal-grey',
        radioClass: 'iradio_minimal-grey'
    });
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

    // initialised default values and variable tables
    var sliderDefaultValue = [20, 70];
    var default_options = { segment: 'PMET',
        filter_type: 'demographics',
        age: '20,70',
        gender: 'BOTH',
        race: [ 'CHINESE', 'EURASIAN', 'INDIAN', 'MALAY', 'OTHERS' ],
        infer_residence_region: [ 'Central', 'East', 'North', 'North-East', 'West' ],
        infer_workplace_region: [ 'Central', 'East', 'North', 'North-East', 'West' ]
    };
    var default_demo_op = {
        age: '20,70',
        gender: 'BOTH',
        race: [ 'CHINESE', 'EURASIAN', 'INDIAN', 'MALAY', 'OTHERS' ],
        infer_residence_region: [ 'Central', 'East', 'North', 'North-East', 'West' ],
        infer_workplace_region: [ 'Central', 'East', 'North', 'North-East', 'West' ]
    };
    var default_pArea_op = {
        area_filter: 'infer_residence_',
        planning_area: 'Bishan'
    };
    var ageTable = {
        'age5': {},
        'age10': {}
    };

    // initialise slider and slider value
    $("#ageSlider").slider({
        ticks: sliderDefaultValue,
        value: sliderDefaultValue,
        // ticks_labels: [19, 65],
    });
    $('#ageSlider').on('slide', function(sldEvt) {
        $('#ageSliderValue').text(sldEvt.value[0] + ' - ' + sldEvt.value[1]);
    });

    // initialise calendar
    $("#calendar").datepicker({
        format: "mm-yyyy",
        viewMode: "months",
        minViewMode: "months"
    }).on('changeMonth', function(e) {
        $('#month_display').text('...');
        month = e.date.getMonth() + 1;
        year = e.date.getFullYear();
        $.ajax({
            url: 'cookie_set_date/' + year + '/' + month
        });
        query_data(year, month);
    });


    //---------------------
    //- initialise charts -
    //---------------------

    // // Chart.defaults.global.maintainAspectRatio = false;
    var barChartOptions = {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };

    loadSettingsFromCookie();

    function loadSettingsFromCookie() {
        $.ajax({
            url: 'read_cookie'
        }).success(function(results){
            if (results.filter_settings) {
                parseCurrentFilter(results.filter_settings);
                updateTopWidgets(results);
                year = results.dateParams.year;
                month = results.dateParams.month;
                query_data(year, month)
            } else {
                parseCurrentFilter(default_options);
                $('#submit').submit();
                year = 2016;
                month = 7;
                $.ajax({
                    url: 'cookie_set_date/2016/7'
                })
                query_data(2016, 7);
            }
        })
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
            $('#area_filter_infer_residence_').addClass('active');
            $('#area_filter_infer_workplace_').removeClass('active');
        } else  if (filter_op.filter_type == 'planning_area') {
            $('#filter_type_planning_area').addClass('active');
            $('#filter_type_demographics').removeClass('active');
            $('#planning_area-tab').addClass('active');
            $('#demographics-tab').removeClass('active');
            if (filter_op.area_filter == 'infer_residence_') {
                $('#area_filter_infer_residence_').addClass('active');
                $('#area_filter_infer_workplace_').removeClass('active');
            } else if (filter_op.area_filter == 'infer_workplace_') {
                $('#area_filter_infer_workplace_').addClass('active');
                $('#area_filter_infer_residence_').removeClass('active');
            }
        }
        disableOptions(filter_op.filter_type);
        if (filter_op.filter_type == 'demographics') {
            parseSelections(default_pArea_op);
        } else if (filter_op.filter_type == 'planning_area') {
            parseSelections(default_demo_op);
        }
    }

    function clearAllOptions() {
        $('input').prop('disabled', false);
        $('input').iCheck('uncheck');
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

    function checkThisOption(name, value) {
        $('input[name="' + name + '"]' + '[value="' + value + '"]').iCheck('check');
    }

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
    }

    $('input:radio[name="filter_type"]').change(function() {
        disableOptions($(this).val());
    });

    //filters applied, query new data, update charts
    $('#filter_form').submit(function(evt) {
        evt.preventDefault();
        var frm = $(this);
        $('#segment_display').text('...');
        $('#sampleSize_display').text('...');
        $('#ageRange_display').text('...');

        $.ajax({
            url: 'apply_filter',
            type: frm.attr('method'),
            data: frm.serialize()
        }).success(updateTopWidgets).then(function() {
            query_data(year, month);
        });
    });

    function updateTopWidgets(cookieData) {
        $('#segment_display').text(cookieData.filter_settings.segment);
        $('#sampleSize_display').text(cookieData.crmProp.count);
        $('#ageRange_display').text(cookieData.crmProp.minage + ' - ' + cookieData.crmProp.maxage);
    }

    function sortObject(obj, sortAttr) {
        return obj.sort(function(first, second) {
            return second[sortAttr] - first[sortAttr];
        })
    }

    function query_data(year, month){
        query_grid_daily(year, month);
        query_poi(year, month);
    }

    function query_grid_daily(year, month) {
        console.time('Grid_query');
        $.ajax({
            url: 'query_loc_grid_daily/' + year + '/' + month
        }).success(function(results) {

            console.timeEnd('Grid_query');
            $('#month_display').text(month + '/' + year);
        })
    }

    function query_poi(year, month) {
        $.ajax({
            url: 'query_loc_poi/' + year + '/' + month
        }).success(updatePOIData)
    }
    function updatePOIData(results){

    }

    function resetChart(chart) {
        for (i; i < chart.data.datasets[0].data.length; i++){
            chart.data.datasets.data[i] = 0;
        }
        chart.update();
    }

    function updateChart(chart, dataDict, dataLength, chartColourArray) {
        if (!dataDict) resetChart(chart);
        var dataSorted = dictToKeyValueArray(dataDict).sort(sortSecondValue);
        if (dataLength && dataLength > Object.keys(dataDict).length) dataLength = Object.keys(dataDict).length;
        dataLength = dataLength || Object.keys(dataDict).length;
        dataSorted = dataSorted.slice(0, dataLength);
        var labels = getKeys(dataSorted);
        var values = getValues(dataSorted);
        chartColourArray = chartColourArray || getColourArray(dataLength);
        chart.data.labels = labels;
        chart.data.datasets[0].backgroundColor = chartColourArray;
        chart.data.datasets[0].data = values;
        chart.update();
        var colourMap = {};
        for (i=0;i<dataLength;i++){
            colourMap[labels[i]] = chartColourArray[i];
        }
        return colourMap;
    }

    function updateChartWithColourMapping(chart, dataDict, dataLength, mapTable, colourMap) {
        if (!dataDict) resetChart(chart);
        var dataSorted = dictToKeyValueArray(dataDict).sort(sortSecondValue);
        if (dataLength && dataLength > Object.keys(dataDict).length) dataLength = Object.keys(dataDict).length;
        dataLength = dataLength || Object.keys(dataDict).length;
        dataSorted = dataSorted.slice(0, dataLength);
        var labels = getKeys(dataSorted);
        chartColourArray = labels.map(function(el){
            if (mapTable) return colourMap[mapTable[el]] || 'rgba(0,0,0,0.1)';
            else return colourMap[el] || 'rgba(0,0,0,0.1)';
        });
        var values = getValues(dataSorted);
        chart.data.labels = labels;
        chart.data.datasets[0].backgroundColor = chartColourArray;
        chart.data.datasets[0].data = values;
        chart.update();
    }

    function updateChartWithFilter(chart, dataDict, dataLength, mapTable, colourMap, filterValue) {
        var dataDictSub = {};
        for (var key in dataDict) {
            if (dataDict.hasOwnProperty(key) && mapTable[key] == filterValue){
                dataDictSub[key] = dataDict[key];
            }
        }
        updateChart(chart, dataDictSub, dataLength, colourMap[filterValue]);
    }

    function dictToKeyValueArray(dict) {
        return Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        })
    }
    // sort array by value
    function sortSecondValue(first, second) {
        return second[1] - first[1];
    }

    function getColourArray(numOfLabels) {
        var colourArray = [];
        if (numOfLabels == 1) {
            colourArray = "hsl(0,100%,75%)"
        } else {
            for (var i = 0; i < numOfLabels; i++) {
                var segmentAngle = parseInt(i * 360 / numOfLabels);
                colourArray.push("hsl(" + segmentAngle + ",100%,75%)");
            }
        }
        return colourArray
    }

    function getKeys(keyValueArray) {
        var keyArray = [];
        for (i = 0; i < keyValueArray.length; i++){
            keyArray.push(keyValueArray[i][0])
        }
        return keyArray
    }

    function getValues(keyValueArray) {
        var valueArray = [];
        for (i = 0; i < keyValueArray.length; i++){
            valueArray.push(keyValueArray[i][1])
        }
        return valueArray
    }
});