var attrTable = {
    'gender': {},
    'race': {},
    'age': {},
    'infer_residence_region': {},
    'infer_residence_planning_area': {},
    'infer_workplace_region': {},
    'infer_workplace_planning_area': {},
    'residence_districtcode': {},
    'residence_type': {}
};

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


    //initialise charts
    // Chart.defaults.global.maintainAspectRatio = false;
    // gender chart
    var genderData = {
        labels: ["Male", "Female"],
        datasets: [{
            data: [1, 1],
            backgroundColor: ['red', 'green']
        }]
    };
    var genderChartCanvas = $("#genderChart");
    var genderChart = new Chart(genderChartCanvas, {
        type: 'pie',
        data: genderData,
    });
    // race chart
    var raceData = {
        labels: ["Chinese", "Malay", "Indian", "Eurasian", "Others"],
        datasets: [{
            data: [1, 1, 1, 1, 1],
            backgroundColor: ['red', 'orange', 'green', 'blue', 'purple']
        }]
    };
    var raceChartCanvas = $("#raceChart");
    var raceChart = new Chart(raceChartCanvas, {
        type: 'pie',
        data: raceData,
    });
    // age10 chart
    var age10Data = {
        labels: ["20-29", "30-39", "40-49", "50-59", "Above 59"],
        datasets: [{
            label: '# of People',
            data: [1, 1, 1, 1, 1],
            backgroundColor: 'red'
        }]
    };
    var age10ChartCanvas = $("#age10Chart");
    var age10Chart = Chart.Bar(age10ChartCanvas, {
        data: age10Data
    });
    // age5 chart
    var age5Data = {
        labels: ["20-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "Above 64"],
        datasets: [{
            label: '# of People',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: 'red'
        }]
    };
    var age5ChartCanvas = $("#age5Chart");
    var age5Chart = Chart.Bar(age5ChartCanvas, {
        data: age5Data
    });

    loadSettingsFromCookie();

    function loadSettingsFromCookie() {
        $.ajax({
            url: 'read_cookie'
        }).success(function(results){
            if (results.filter_settings) {
                parseCurrentFilter(results.filter_settings);
                updateTopWidgets(results);
                updateDataTable();
                updateCharts();
            } else {
                parseCurrentFilter(default_options);
                $('#submit').submit();
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

        $.ajax({
            url: 'apply_filter',
            type: frm.attr('method'),
            data: frm.serialize()
        }).success(updateTopWidgets).then(updateDataTable).then(updateCharts);
        // }).success(updateTopWidgets).success(updateDataTable).success(updateCharts)
    });

    function updateTopWidgets(cookieData) {
        $('#segment_display').text(cookieData.filter_settings.segment);
        $('#sampleSize_display').text(cookieData.crmProp.count);
        $('#ageRange_display').text(cookieData.crmProp.minage + ' - ' + cookieData.crmProp.maxage);
    }

    function updateDataTable() {
        Object.keys(attrTable).map(updateCRMAttrData);
        console.log(attrTable);
        updateAgeTable();
    }

    function updateCRMAttrData(column) {
        attrTable[column] = {};
        $.ajax({
            url: 'query_crm/' + column,
            async: false
        }).success(function(results){
            for (i=0; i < results.length; i++) {
                var row = results[i];
                if (row[column] && (row[column] != "UNKNOWN") ) {
                    attrTable[column][row[column]] = row.count;
            }
        })
    }

    function updateAgeTable() {
        ageTable.age5 = makeAgeHist(attrTable.age, 5);
        ageTable.age10 = makeAgeHist(attrTable.age, 10);
    }

    function makeAgeHist(ageDict, ageBand) {
        var ageBandDict = {};
        Object.keys(ageDict).map(function(key){
            var ageFloor = (key / ageBand >> 0) * ageBand;
            if (ageFloor >= 70) ageFloor = 60;
            if (!ageBandDict[ageFloor]) {
                ageBandDict[ageFloor] = parseInt(ageDict[key]);
            } else {
                ageBandDict[ageFloor] += parseInt(ageDict[key]);
            }
        })
        return ageBandDict
    }

    function updateCharts() {
        updateGenderChart(genderChart);
        updateRaceChart(raceChart);
        updateAge5Chart(age5Chart);
        updateAge10Chart(age10Chart);
    }

    function resetChart(chart) {
        for (i; i < chart.data.datasets[0].data.length; i++){
            chart.data.datasets.data[i] = 0;
        }
        chart.update();
    }

    function updateChart(chart, dataDict, dataLength, chartColourArray) {
        var dataSorted = dictToKeyValueArray(dataDict).sort(sortSecondValue);
        if (!dataLength) var dataLength = data.Dict.length;
        if (!chartColourArray) {
            var chartColourArray = [];
            for (var i = 0; i < dataLength; i++) {
                var segmentAngle = parseInt(i * 360 / dataLength);
                chartColourArray.push("HSL(" + segmentAngle + ",100%,50%)");
            }
        }
        var labels = getKeys(dataSorted);
        var values = getValues(dataSorted);
    }

    function dictToKeyValueArray(dict){
        return Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        })
    }
    // sort array by value
    function sortSecondValue(first, second) {
        return second[1] - first[1];
    }

    function getKeys(keyValueArray) {
        var keyArray = [];
        for (i = 0; i < keyValueArray.length; i++){
            keyArray.push(keyArray[i][0])
        }
    }

    function getValues(keyValueArray) {
        var keyArray = [];
        for (i = 0; i < keyValueArray.length; i++){
            keyArray.push(keyArray[i][1])
        }
    }

    function updateGenderChart(chart) {
        if (!attrTable.gender) {
            resetChart(chart);
        }
        chart.data.datasets[0].data[0] = attrTable.gender.MALE || 0;
        chart.data.datasets[0].data[1] = attrTable.gender.FEMALE || 0;
        chart.update();
    }
    function updateRaceChart(chart) {
        if (!attrTable.race) {
            resetChart(chart);
        }
        chart.data.datasets[0].data[0] = attrTable.race.CHINESE || 0;
        chart.data.datasets[0].data[1] = attrTable.race.MALAY || 0;
        chart.data.datasets[0].data[2] = attrTable.race.INDIAN || 0;
        chart.data.datasets[0].data[3] = attrTable.race.EURASIAN || 0;
        chart.data.datasets[0].data[4] = attrTable.race.OTHERS || 0;
        chart.update();
    }
    function updateAge10Chart(chart) {
        if (!ageTable.age10) {
            resetChart(chart);
        }
        chart.data.datasets[0].data[0] = ageTable.age10['20'] || 0;
        chart.data.datasets[0].data[1] = ageTable.age10['30'] || 0;
        chart.data.datasets[0].data[2] = ageTable.age10['40'] || 0;
        chart.data.datasets[0].data[3] = ageTable.age10['50'] || 0;
        chart.data.datasets[0].data[4] = ageTable.age10['60'] || 0;
        chart.update();
    }
    function updateAge5Chart(chart) {
        if (!ageTable.age5) {
            resetChart(chart);
        }
        chart.data.datasets[0].data[0] = ageTable.age5['20'] || 0;
        chart.data.datasets[0].data[1] = ageTable.age5['25'] || 0;
        chart.data.datasets[0].data[2] = ageTable.age5['30'] || 0;
        chart.data.datasets[0].data[3] = ageTable.age5['35'] || 0;
        chart.data.datasets[0].data[4] = ageTable.age5['40'] || 0;
        chart.data.datasets[0].data[5] = ageTable.age5['45'] || 0;
        chart.data.datasets[0].data[6] = ageTable.age5['50'] || 0;
        chart.data.datasets[0].data[7] = ageTable.age5['55'] || 0;
        chart.data.datasets[0].data[8] = ageTable.age5['60'] || 0;
        chart.data.datasets[0].data[9] = ageTable.age5['65'] || 0;
        chart.update();
    }
});