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
        gender: 'Both',
        race: [ 'Chinese', 'Eurasian', 'Indian', 'Malay', 'Others' ],
        infer_residence_region: [ 'Central', 'East', 'North', 'North-East', 'West' ],
        infer_workplace_region: [ 'Central', 'East', 'North', 'North-East', 'West' ]
    };
    var default_demo_op = {
        age: '20,70',
        gender: 'Both',
        race: [ 'Chinese', 'Eurasian', 'Indian', 'Malay', 'Others' ],
        infer_residence_region: [ 'Central', 'East', 'North', 'North-East', 'West' ],
        infer_workplace_region: [ 'Central', 'East', 'North', 'North-East', 'West' ]
    };
    var default_pArea_op = {
        area_filter: 'infer_residence_',
        planning_area: 'Bishan'
    };
    var ageTable = {
        age5: {},
        age10: {}
    };
    var attrTable = {
        gender: {},
        race: {},
        age: {},
        infer_residence_region: {},
        infer_residence_planning_area: {},
        infer_workplace_region: {},
        infer_workplace_planning_area: {},
        residence_districtcode: {},
        residence_type: {}
    };
    var populationData = {};
    var regionTable = {
        'Ang Mo Kio': 'North-East',
        'Bedok': 'East',
        'Bishan': 'Central',
        'Boon Lay': 'West',
        'Bukit Batok': 'West',
        'Bukit Merah': 'Central',
        'Bukit Panjang': 'West',
        'Bukit Timah': 'Central',
        'Central Water Catchment': 'North',
        'Changi': 'East',
        'Changi Bay': 'East',
        'Choa Chu Kang': 'West',
        'Clementi': 'West',
        'Downtown Core': 'Central',
        'Geylang': 'Central',
        'Hougang': 'North-East',
        'Jurong East': 'West',
        'Jurong West': 'West',
        'Kallang': 'Central',
        'Lim Chu Kang': 'North',
        'Mandai': 'North',
        'Marina East': 'Central',
        'Marina South': 'Central',
        'Marine Parade': 'Central',
        'Museum': 'Central',
        'Newton': 'Central',
        'North-Eastern Islands': 'North-East',
        'Novena': 'Central',
        'Orchard': 'Central',
        'Outram': 'Central',
        'Pasir Ris': 'East',
        'Paya Lebar': 'East',
        'Pioneer': 'West',
        'Punggol': 'North-East',
        'Queenstown': 'Central',
        'River Valley': 'Central',
        'Rochor': 'Central',
        'Seletar': 'North-East',
        'Sembawang': 'North',
        'Sengkang': 'North-East',
        'Serangoon': 'North-East',
        'Simpang': 'North',
        'Singapore River': 'Central',
        'Southern Islands': 'Central',
        'Straits View': 'Central',
        'Sungei Kadut': 'North',
        'Tampines': 'East',
        'Tanglin': 'Central',
        'Tengah': 'West',
        'Toa Payoh': 'Central',
        'Tuas': 'West',
        'Western Islands': 'West',
        'Western Water Catchment': 'West',
        'Woodlands': 'North',
        'Yishun': 'North'
    };
    var colourMap = {
        residence: {},
        workplace: {}
    };
    var month = 7, year = 2016;

    // initialise slider and slider value
    $("#ageSlider").slider({
        ticks: sliderDefaultValue,
        value: sliderDefaultValue,
        // ticks_labels: [19, 65],
    }).on('slide', function(sldEvt) {
        $('#ageSliderValue').text(sldEvt.value[0] + ' - ' + sldEvt.value[1]);
    });

    // initialise calendar
    $("#calendar").datepicker({
        format: "mm-yyyy",
        viewMode: "months",
        minViewMode: "months"
    }).on('changeMonth', function(e) {
        month = e.date.getMonth() + 1;
        year = e.date.getFullYear();
        $.ajax({
            url: 'cookie_set_date/' + year + '/' + month
        });
        $('#month_display').text(month + '/' + year);
    });


    //---------------------
    //- initialise charts -
    //---------------------
    // Chart.defaults.global.maintainAspectRatio = false;
    var barChartOptions = {
        legend: {
            display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    // var chartOptions = {
    //     bar: {
    //         legend: {
    //             display: false
    //         },
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero: true
    //                 }
    //             }]
    //         }
    //     }
    // };
    // var defaultChartData = {
    //     pie: {
    //         datasets: [{
    //             data: [1]
    //         }]
    //     },
    //     bar: {
    //         datasets: [{
    //             label: '# of people',
    //             data: [1]
    //         }]
    //     }
    // };
    // function createNewChart(canvas, chartType, chartData) {
    //     return new Chart($('#' + canvas), {
    //         type: chartType,
    //         data: chartData || defaultChartData[chartType],
    //         options: chartOptions[chartType]
    //     })
    // }
    // var genderChart = createNewChart('genderChart', 'pie');
    // var raceChart = createNewChart('raceChart', 'pie');
    // var age10Chart = createNewChart('age10Chart', 'bar', age10Data);
    // var age5Chart = createNewChart('age5Chart', 'bar', age5Data);
    // var regionResidenceChart = createNewChart('regionResidenceChart', 'pie');
    // var regionWorkplaceChart = createNewChart('regionWorkplaceChart', 'pie');
    // var pAreaResidenceChart = createNewChart('pAreaResidenceChart', 'bar');
    // var pAreaWorkplaceChart = createNewChart('pAreaWorkplaceChart', 'bar');
    // var residenceTypeChart = createNewChart('residenceTypeChart', 'bar');


    // gender chart
    var genderChartCanvas = $("#genderChart");
    var genderChart = new Chart(genderChartCanvas, {
        type: 'pie',
        data: {
            datasets: [{
                data: [1]
            }]
        }
    });
    // race chart
    var raceChartCanvas = $("#raceChart");
    var raceChart = new Chart(raceChartCanvas, {
        type: 'pie',
        data: {
            datasets: [{
                data: [1]
            }]
        }
    });
    // age10 chart
    var age10Data = {
        labels: ["Under 30", "30-39", "40-49", "50-59", "Above 59"],
        datasets: [{
            label: '# of People',
            yAxisID: 'a',
            data: [1, 1, 1, 1, 1],
            backgroundColor: "hsl(0,100%,75%)"
        }]
    };
    var age10ChartCanvas = $("#age10Chart");
    var age10Chart = new Chart(age10ChartCanvas, {
        type: 'bar',
        data: age10Data,
        options: {
            legend: {
                display: false
            },
            tooltips: {
                intersect: false,
                mode: "x"
            },
            hover: {
                intersect: false,
                mode: "x"
            },
            scales: {
                yAxes: [{
                    id: 'a',
                    position: 'left',
                    ticks: {
                        beginAtZero: true
                    }
                }, {
                    id: 'b',
                    position: 'right',
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    // age5 chart
    var age5Data = {
        labels: ["Under 25", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "Above 64"],
        datasets: [{
            label: '# of People',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: "hsl(0,100%,75%)"
        }]
    };
    var age5ChartCanvas = $("#age5Chart");
    var age5Chart = new Chart(age5ChartCanvas, {
        type: 'bar',
        data: age5Data,
        options: barChartOptions
    });
    // region chart
    var regionResidenceChartCanvas = $("#regionResidenceChart");
    var regionResidenceChart = new Chart(regionResidenceChartCanvas, {
        type: 'pie',
        data: {
            datasets: [{
                data: [1]
            }]
        }
    });
    var regionWorkplaceChartCanvas = $("#regionWorkplaceChart");
    var regionWorkplaceChart = new Chart(regionWorkplaceChartCanvas, {
        type: 'pie',
        data: {
            datasets: [{
                data: [1]
            }]
        }
    });
    // planning area chart
    var pAreaResidenceChartCanvas = $("#pAreaResidenceChart");
    var pAreaResidenceChart = new Chart(pAreaResidenceChartCanvas, {
        type: 'bar',
        data: {
            datasets: [{
                label: '# of People',
                data: [1]
            }]
        },
        options: barChartOptions
    });
    var pAreaWorkplaceChartCanvas = $("#pAreaWorkplaceChart");
    var pAreaWorkplaceChart = new Chart(pAreaWorkplaceChartCanvas, {
        type: 'bar',
        data: {
            datasets: [{
                label: '# of People',
                data: [1]
            }]
        },
        options: barChartOptions
    });
    var residenceTypeChartCanvas = $("#residenceTypeChart");
    var residenceTypeChart = new Chart(residenceTypeChartCanvas, {
        type: 'bar',
        data: {
            datasets: [{
                label: '# of People',
                data: [1]
            }]
        },
        options: barChartOptions
    });

    loadSettingsFromCookie();
    loadPopulationMetrics();

    function loadSettingsFromCookie() {
        $.ajax({
            url: 'read_cookie'
        }).success(function(results){
            if (results.filter_settings) {
                parseCurrentFilter(results.filter_settings);
                updateTopWidgets(results);
                updateDataTable();
                updateCharts();
                year = results.dateParams.year;
                month = results.dateParams.month;
                $('#month_display').text(month + '/' + year)
            } else {
                parseCurrentFilter(default_options);
                $('#submit').submit();
                year = 2016;
                month = 7;
                $.ajax({
                    url: 'cookie_set_date/2016/7'
                })
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
        }).success(updateTopWidgets).then(updateDataTable).then(updateCharts);
    });

    function updateTopWidgets(cookieData) {
        $('#segment_display').text(cookieData.filter_settings.segment);
        $('#sampleSize_display').text(cookieData.crmProp.count);
        $('#ageRange_display').text(cookieData.crmProp.minage + ' - ' + cookieData.crmProp.maxage);
    }

    function updateDataTable() {
        Object.keys(attrTable).map(updateCRMAttrData);
        updateAgeTable();
    }

    function updateCRMAttrData(column) {
        attrTable[column] = {};
        $.ajax({
            url: 'query_crm/' + column,
            async: false
        }).success(function (results) {
            for (i = 0; i < results.length; i++) {
                var row = results[i];
                if (row[column] && (row[column] != "UNKNOWN")) {
                    attrTable[column][row[column]] = row.count;
                }
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
            var ageBandFloor = (key / ageBand >> 0) * ageBand;
            if (ageBandFloor >= 70) ageBandFloor -= ageBand;
            else if (ageBandFloor < 20) ageBandFloor += ageBand;
            if (!ageBandDict[ageBandFloor]) {
                ageBandDict[ageBandFloor] = parseFloat(ageDict[key]);
            } else {
                ageBandDict[ageBandFloor] += parseFloat(ageDict[key]);
            }
        });
        return ageBandDict
    }

    function loadPopulationMetrics() {
        $.ajax({
            url: 'query_population'
        }).success(updatePopulationData).then(updatePopulationCharts)
    }

    function updatePopulationData(results) {
        for (i=0;i<results.length;i++) {
            var row = results[i];
            if (!populationData[row.field]) populationData[row.field] = {};
            populationData[row.field][row.value] = row.percent;
        }
        populationData['age5'] = makeAgeHist(populationData.age, 5);
        populationData['age10'] = makeAgeHist(populationData.age, 10);
        updatePopulationAge10Chart(age10Chart, populationData.age10)
    }

    function updatePopulationCharts() {

    }

    function updateCharts() {
        genderChart.data.datasets[1] = {
            label: 'Population %',
            data: [3000, 4000]
        };
        updateChart(genderChart, attrTable.gender);
        updateChart(raceChart, attrTable.race);
        updateAge5Chart(age5Chart, ageTable.age5);
        updateAge10Chart(age10Chart, ageTable.age10);
        colourMap.residence = updateChart(regionResidenceChart, attrTable.infer_residence_region);
        colourMap.workplace = updateChart(regionWorkplaceChart, attrTable.infer_workplace_region);
        updateChartWithColourMapping(pAreaResidenceChart, attrTable.infer_residence_planning_area, 20, regionTable, colourMap.residence);
        updateChartWithColourMapping(pAreaWorkplaceChart, attrTable.infer_workplace_planning_area, 20, regionTable, colourMap.workplace);
        updateChart(residenceTypeChart, attrTable.residence_type);
    }

    function resetChart(chart) {
        for (i; i < chart.data.datasets[0].data.length; i++){
            chart.data.datasets.data[i] = 0;
        }
    }

    function updateChart(chart, dataDict, dataLength, chartColourArray) {
        if (!dataDict) resetChart(chart);
        var dataSorted = dictToKeyValueArray(dataDict).sort(sortSecondValue);
        dataLength = dataLength || Object.keys(dataDict).length;
        dataSorted = dataSorted.slice(0, dataLength);
        chartColourArray = chartColourArray || getColourArray(dataLength);
        var labels = getKeys(dataSorted);
        var values = getValues(dataSorted);
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
        dataLength = dataLength || Object.keys(dataDict).length;
        dataSorted = dataSorted.slice(0, dataLength);
        var labels = getKeys(dataSorted);
        chartColourArray = labels.map(function(el){
            return colourMap[mapTable[el]] || 'rgba(0,0,0,0.1)';
        });
        var values = getValues(dataSorted);
        chart.data.labels = labels;
        chart.data.datasets[0].backgroundColor = chartColourArray;
        chart.data.datasets[0].data = values;
        chart.update();
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

    function getColourArray(numOfLabels) {
        var colourArray = [];
        for (var i = 0; i < numOfLabels; i++) {
            var segmentAngle = parseInt(i * 360 / numOfLabels);
            colourArray.push("hsl(" + segmentAngle + ",100%,75%)");
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

    function convertToPercent(value) {
        return (value * 100).toFixed(1);
    }

    function updateAge10Chart(chart, dataDict) {
        if (!dataDict) {
            resetChart(chart);
        }
        chart.data.datasets[0].data[0] = dataDict['20'] || 0;
        chart.data.datasets[0].data[1] = dataDict['30'] || 0;
        chart.data.datasets[0].data[2] = dataDict['40'] || 0;
        chart.data.datasets[0].data[3] = dataDict['50'] || 0;
        chart.data.datasets[0].data[4] = dataDict['60'] || 0;
        chart.update();
    }
    function updateAge5Chart(chart, dataDict) {
        if (!dataDict) {
            resetChart(chart);
        }
        chart.data.datasets[0].data[0] = dataDict['20'] || 0;
        chart.data.datasets[0].data[1] = dataDict['25'] || 0;
        chart.data.datasets[0].data[2] = dataDict['30'] || 0;
        chart.data.datasets[0].data[3] = dataDict['35'] || 0;
        chart.data.datasets[0].data[4] = dataDict['40'] || 0;
        chart.data.datasets[0].data[5] = dataDict['45'] || 0;
        chart.data.datasets[0].data[6] = dataDict['50'] || 0;
        chart.data.datasets[0].data[7] = dataDict['55'] || 0;
        chart.data.datasets[0].data[8] = dataDict['60'] || 0;
        chart.data.datasets[0].data[9] = dataDict['65'] || 0;
        chart.update();
    }
    function updatePopulationAge10Chart(chart, dataDict) {
        popData = {
            label: 'Population %',
            yAxisID: 'b',
            data: [convertToPercent(dataDict['20']),
                convertToPercent(dataDict['30']),
                convertToPercent(dataDict['40']),
                convertToPercent(dataDict['50']),
                convertToPercent(dataDict['60'])]
        };
        chart.data.datasets[1] = popData;
        chart.update();
    }
});