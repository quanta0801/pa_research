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
    var sliderDefaultValue = [19, 69];
    var default_options = { segment: 'PMET',
        filter_type: 'demographics',
        age: '19,69',
        gender: ['Male', 'Female'],
        race: [ 'Chinese', 'Eurasian', 'Indian', 'Malay', 'Others' ],
        infer_residence_region: [ 'Central', 'East', 'North', 'North-East', 'West' ],
        infer_workplace_region: [ 'Central', 'East', 'North', 'North-East', 'West' ]
    };
    var default_demo_op = {
        age: '19,69',
        gender: ['Male', 'Female'],
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
    var totalsTable = {};
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
    var pairedColourArray =    ['#a6cee3',
                                '#1f78b4',
                                '#b2df8a',
                                '#33a02c',
                                '#e31a1c',
                                '#fdbf6f',
                                '#ff7f00',
                                '#cab2d6',
                                '#6a3d9a',
                                '#b15928',
                                '#ffff99',
                                '#fb9a99'];
    var set3ColourArray =   ['#fb8072',
                                '#80b1d3',
                                '#fdb462',
                                '#b3de69',
                                '#fccde5',
                                '#d9d9d9',
                                '#bc80bd',
                                '#ccebc5',
                                '#ffed6f',
                                '#8dd3c7',
                                '#ffffb3',
                                '#bebada'];
    var spectralColourArray =   ['rgba(50,136,189,0.7)',
                                'rgba(102,194,165,0.7)',
                                'rgba(171,221,164,0.7)',
                                'rgba(230,245,152,0.7)',
                                'rgba(254,224,139,0.7)',
                                'rgba(253,174,97,0.7)',
                                'rgba(244,109,67,0.7)',
                                'rgba(213,62,79,0.7)',
                                'rgba(158,1,66,0.7)']; //'rgba(94,79,162,0.7)','rgba(255,255,191,0.7)',
    var spectralColourArray2 = [['rgba(153,213,148,0.7)'],
        ['rgba(153,213,148,0.7)','rgba(252,141,89,0.7)'],
        ['rgba(153,213,148,0.7)','rgba(255,255,191,0.7)',
            'rgba(252,141,89,0.7)'],
        ['rgba(43,131,186,0.7)','rgba(171,221,164,0.7)',
            'rgba(253,174,97,0.7)','rgba(215,25,28,0.7)'],
        ['rgba(43,131,186,0.7)','rgba(171,221,164,0.7)',
            'rgba(255,255,191,0.7)','rgba(253,174,97,0.7)',
            'rgba(215,25,28,0.7)'],
        ['rgba(50,136,189,0.7)','rgba(153,213,148,0.7)',
            'rgba(230,245,152,0.7)','rgba(254,224,139,0.7)',
            'rgba(252,141,89,0.7)','rgba(213,62,79,0.7)'],
        ['rgba(50,136,189,0.7)','rgba(153,213,148,0.7)',
            'rgba(230,245,152,0.7)','rgba(255,255,191,0.7)',
            'rgba(254,224,139,0.7)','rgba(252,141,89,0.7)',
            'rgba(213,62,79,0.7)'],
        ['rgba(50,136,189,0.7)','rgba(102,194,165,0.7)',
            'rgba(171,221,164,0.7)','rgba(230,245,152,0.7)',
            'rgba(254,224,139,0.7)','rgba(253,174,97,0.7)',
            'rgba(244,109,67,0.7)','rgba(213,62,79,0.7)'],
        ['rgba(50,136,189,0.7)','rgba(102,194,165,0.7)',
            'rgba(171,221,164,0.7)','rgba(230,245,152,0.7)',
            'rgba(255,255,191,0.7)','rgba(254,224,139,0.7)',
            'rgba(253,174,97,0.7)','rgba(244,109,67,0.7)',
            'rgba(213,62,79,0.7)'],
        ['rgba(94,79,162,0.7)','rgba(50,136,189,0.7)',
            'rgba(102,194,165,0.7)','rgba(171,221,164,0.7)',
            'rgba(230,245,152,0.7)','rgba(254,224,139,0.7)',
            'rgba(253,174,97,0.7)','rgba(244,109,67,0.7)',
            'rgba(213,62,79,0.7)','rgba(158,1,66,0.7)'],
        ['rgba(94,79,162,0.7)','rgba(50,136,189,0.7)',
            'rgba(102,194,165,0.7)','rgba(171,221,164,0.7)',
            'rgba(230,245,152,0.7)','rgba(255,255,191,0.7)',
            'rgba(254,224,139,0.7)','rgba(253,174,97,0.7)',
            'rgba(244,109,67,0.7)','rgba(213,62,79,0.7)',
            'rgba(158,1,66,0.7)']];
    var spectralLightColourArray = [['rgba(204, 234, 202, 0.7)'],
        ['rgba(204, 234, 202, 0.7)','rgba(253, 198, 172, 0.7)'],
        ['rgba(204, 234, 202, 0.7)','rgba(255, 255, 223, 0.7)',
            'rgba(253, 198, 172, 0.7)'],
        ['rgba(141, 195, 229, 0.7)','rgba(213, 238, 210, 0.7)',
            'rgba(254, 214, 176, 0.7)','rgba(241, 134, 136, 0.7)'],
        ['rgba(141, 195, 229, 0.7)','rgba(213, 238, 210, 0.7)',
            'rgba(255, 255, 223, 0.7)','rgba(254, 214, 176, 0.7)',
            'rgba(241, 134, 136, 0.7)'],
        ['rgba(148, 197, 227, 0.7)','rgba(204, 234, 202, 0.7)',
            'rgba(242, 250, 203, 0.7)','rgba(255, 239, 197, 0.7)',
            'rgba(253, 198, 172, 0.7)','rgba(234, 158, 167, 0.7)'],
        ['rgba(148, 197, 227, 0.7)','rgba(204, 234, 202, 0.7)',
            'rgba(242, 250, 203, 0.7)','rgba(255, 255, 223, 0.7)',
            'rgba(255, 239, 197, 0.7)','rgba(253, 198, 172, 0.7)',
            'rgba(234, 158, 167, 0.7)'],
        ['rgba(148, 197, 227, 0.7)','rgba(178, 224, 210, 0.7)',
            'rgba(213, 238, 210, 0.7)','rgba(242, 250, 203, 0.7)',
            'rgba(255, 239, 197, 0.7)','rgba(254, 214, 176, 0.7)',
            'rgba(249, 182, 161, 0.7)','rgba(234, 158, 167, 0.7)'],
        ['rgba(148, 197, 227, 0.7)','rgba(178, 224, 210, 0.7)',
            'rgba(213, 238, 210, 0.7)','rgba(242, 250, 203, 0.7)',
            'rgba(255, 255, 223, 0.7)','rgba(255, 239, 197, 0.7)',
            'rgba(254, 214, 176, 0.7)','rgba(249, 182, 161, 0.7)',
            'rgba(234, 158, 167, 0.7)'],
        ['rgba(173, 165, 211, 0.7)','rgba(148, 197, 227, 0.7)',
            'rgba(178, 224, 210, 0.7)','rgba(213, 238, 210, 0.7)',
            'rgba(242, 250, 203, 0.7)','rgba(255, 239, 197, 0.7)',
            'rgba(254, 214, 176, 0.7)','rgba(249, 182, 161, 0.7)',
            'rgba(234, 158, 167, 0.7)','rgba(254, 81, 152, 0.7)'],
        ['rgba(173, 165, 211, 0.7)','rgba(148, 197, 227, 0.7)',
            'rgba(178, 224, 210, 0.7)','rgba(213, 238, 210, 0.7)',
            'rgba(242, 250, 203, 0.7)','rgba(255, 255, 223, 0.7)',
            'rgba(255, 239, 197, 0.7)','rgba(254, 214, 176, 0.7)',
            'rgba(249, 182, 161, 0.7)','rgba(234, 158, 167, 0.7)',
            'rgba(254, 81, 152, 0.7)']];
    var colourMap = {
        residence: {},
        workplace: {}
    };
    var month = 7, year = 2016;
    var mapmode = 'residence';

    // initialise slider and slider value
    var sliderCanvas = $('#ageSlider');
    var sliderValueCanvas = $('#ageSliderValue');
    sliderCanvas.slider({
        ticks: sliderDefaultValue,
        value: sliderDefaultValue,
        // ticks_labels: [19, 65],
    }).on('slide', function(sldEvt) {
        sliderValueCanvas.text(sldEvt.value[0] + ' - ' + sldEvt.value[1]);
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
        tooltips: {
            intersect: false,
            mode: "x",
            callbacks: {
                label: function(item, data) {
                    return data.datasets[item.datasetIndex].label + ": " +
                        data.datasets[item.datasetIndex].data[item.index] + '%';
                }
            }
        },
        hover: {
            intersect: false,
            mode: "x"
        },
        scales: {
            yAxes: [{
                beginAtZero: true
            }],
            xAxes: [{
                ticks: {
                    callback: function(value, index, values) {
                        if (value.length > 20) return value.slice(0,15) + '...';
                        else return value

                    }
                }
            }]
        }
    };
    var pieChartOptions = {
        tooltips: {
            callbacks: {
                label: function(item, data) {
                    return data.labels[item.index] + ' ' + data.datasets[item.datasetIndex].label
                        + ": " + data.datasets[item.datasetIndex].data[item.index] + '%';
                }
            }
        }
    };
    var ageChartColour = getColourArray(1)[0];//'rgba(153,213,148,0.7)';

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
    //             label: 'Segment %',
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
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                data: [1]
            }]
        },
        options: pieChartOptions
    });
    // race chart
    var raceChartCanvas = $("#raceChart");
    var raceChart = new Chart(raceChartCanvas, {
        type: 'pie',
        data: {
            datasets: [{
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                data: [1]
            }]
        },
        options: pieChartOptions
    });
    // age10 chart
    var age10Data = {
        labels: ["Under 30", "30-39", "40-49", "50-59", "Above 59"],
        datasets: [{
            label: 'Segment',
            data: [1, 1, 1, 1, 1],
            backgroundColor: ageChartColour
        }]
    };
    var age10ChartCanvas = $("#age10Chart");
    var age10Chart = new Chart(age10ChartCanvas, {
        type: 'bar',
        data: age10Data,
        options: barChartOptions
    });
    // age5 chart
    var age5Data = {
        labels: ["Under 25", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "Above 64"],
        datasets: [{
            label: 'Segment',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: ageChartColour
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
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                data: [1]
            }]
        },
        options: pieChartOptions
    });
    var regionWorkplaceChartCanvas = $("#regionWorkplaceChart");
    var regionWorkplaceChart = new Chart(regionWorkplaceChartCanvas, {
        type: 'pie',
        data: {
            datasets: [{
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                data: [1]
            }]
        },
        options: pieChartOptions
    });
    // planning area chart
    var pAreaResidenceChartCanvas = $("#pAreaResidenceChart");
    var pAreaResidenceChart = new Chart(pAreaResidenceChartCanvas, {
        type: 'bar',
        data: {
            datasets: [{
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                type: 'line',
                fill: false,
                backgroundColor: 'rgba(0,0,0,0.7)',
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
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                type: 'line',
                fill: false,
                backgroundColor: 'rgba(0,0,0,0.7)',
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
                label: 'Segment',
                data: [1]
            }, {
                label: 'Population',
                type: 'line',
                fill: false,
                backgroundColor: 'rgba(0,0,0,0.7)',
                data: [1]
            }]
        },
        options: barChartOptions
    });

    loadSettingsFromCookie();
    loadPopulationData();

    function loadSettingsFromCookie() {
        $.ajax({
            url: 'read_cookie'
        }).success(function(results){
            if (results.filter_settings) {
                parseCurrentFilter(results.filter_settings);
                updateTopWidgets(results);
                updateDataTable();
                updateCharts();
                updatePAreaRender(attrTable, mapmode);
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
                sliderCanvas.slider('setValue', ageRange);
                sliderValueCanvas.text(ageRange[0] + ' - ' + ageRange[1]);
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
            sliderCanvas.slider('disable');
        } else if (value == 'demographics') {
            bool = false;
            sliderCanvas.slider('enable');
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
        console.time('CRM query:');
        evt.preventDefault();
        var frm = $(this);
        $('#segment_display').text('...');
        $('#sampleSize_display').text('...');
        $('#ageRange_display').text('...');

        $.ajax({
            url: 'apply_filter',
            type: frm.attr('method'),
            data: frm.serialize()
        }).success(updateTopWidgets).then(updateDataTable).then(updateCharts).then(function() {
            updatePAreaRender(attrTable, mapmode)
            }
        )
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
        totalsTable[column] = null;
        $.ajax({
            url: 'query_crm/' + column,
            async: false
        }).success(function (results) {
            for (i = 0; i < results.length; i++) {
                var row = results[i];
                if (row[column] && (row[column] != "UNKNOWN" && (row[column] != "Unknown"))) {
                    if (!totalsTable[column]) totalsTable[column] = parseInt(row.count);
                    else totalsTable[column] += parseInt(row.count);
                }
            }
            for (i = 0; i < results.length; i++) {
                row = results[i];
                if (row[column] && (row[column] != "UNKNOWN" && (row[column] != "Unknown"))) {
                    if (column != 'age') {
                        attrTable[column][row[column]] = convertToPercent(parseFloat(row.count) / totalsTable[column]);
                    } else {
                        attrTable[column][row[column]] = parseFloat(row.count) / totalsTable[column];
                    }
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
        Object.keys(ageBandDict).map(function(key){
            ageBandDict[key] = convertToPercent(ageBandDict[key])
        });
        return ageBandDict
    }

    function loadPopulationData() {
        $.ajax({
            url: 'query_population'
        }).success(processPopulationData).then(addPopulationCharts)
    }

    function processPopulationData(results) {
        for (i=0;i<results.length;i++) {
            var row = results[i];
            if (!populationData[row.field]) populationData[row.field] = {};
            populationData[row.field][row.value] = row.percent;
        }
        populationData['age5'] = makeAgeHist(populationData.age, 5);
        populationData['age10'] = makeAgeHist(populationData.age, 10);
    }

    function addPopulationCharts() {
        addPopulationChart(genderChart, populationData.gender, true);
        addPopulationChart(raceChart, populationData.race, true);
        addPopulationAge10Chart(age10Chart, populationData.age10);
        addPopulationAge5Chart(age5Chart, populationData.age5);
        addPopulationChart(regionResidenceChart, populationData.infer_residence_region, true);
        addPopulationChart(regionWorkplaceChart, populationData.infer_workplace_region, true);
        addPopulationChart(pAreaWorkplaceChart, populationData.infer_workplace_planning_area);
        addPopulationChart(pAreaResidenceChart, populationData.infer_residence_planning_area);
        addPopulationChart(residenceTypeChart, populationData.residence_type);
    }

    function updateCharts() {
        console.log('Updating charts');
        updateChart(genderChart, attrTable.gender, populationData.gender);
        updateChart(raceChart, attrTable.race, populationData.race);
        updateAge5Chart(age5Chart, ageTable.age5);
        updateAge10Chart(age10Chart, ageTable.age10);
        colourMap.residence = updateChart(regionResidenceChart, attrTable.infer_residence_region, populationData.infer_residence_region);
        colourMap.workplace = updateChart(regionWorkplaceChart, attrTable.infer_workplace_region, populationData.infer_workplace_region);
        updateChartWithColourMapping(pAreaResidenceChart, attrTable.infer_residence_planning_area, populationData.infer_residence_planning_area, 20, regionTable, colourMap.residence);
        updateChartWithColourMapping(pAreaWorkplaceChart, attrTable.infer_workplace_planning_area, populationData.infer_workplace_planning_area, 20, regionTable, colourMap.workplace);
        updateChart(residenceTypeChart, attrTable.residence_type, populationData.residence_type);
        console.log('Update charts complete!');
        console.log(attrTable);
        console.timeEnd('CRM query:');
    }

    function resetChart(chart) {
        for (i; i < chart.data.datasets[0].data.length; i++){
            chart.data.datasets.data[i] = 0;
        }
    }

    function updateChart(chart, dataDict, popDataDict, dataLength, chartColourArray) {
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
        if (popDataDict) updatePopulationChart(chart, popDataDict);
        chart.update();
        var colourMap = {};
        for (i=0;i<dataLength;i++){
            colourMap[labels[i]] = chartColourArray[i];
        }
        return colourMap;
    }

    function updateChartWithColourMapping(chart, dataDict, popDataDict, dataLength, mapTable, colourMap) {
        if (!dataDict) resetChart(chart);
        var dataSorted = dictToKeyValueArray(dataDict).sort(sortSecondValue);
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
        if (popDataDict) updatePopulationChart(chart, popDataDict);
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

    // function getColourArray(numOfLabels) {
    //     var colourArray = [];
    //     for (var i = 0; i < numOfLabels; i++) {
    //         var segmentAngle = parseInt(i * 360 / numOfLabels);
    //         colourArray.push("hsl(" + segmentAngle + ",100%,75%)");
    //     }
    //     return colourArray
    // }
    function getColourArray(numOfLabels) {
        var idx = numOfLabels - 1;
        return spectralColourArray2[idx]
    }
    function getColourArray2(numOfLabels) {
        var idx = numOfLabels - 1;
        return spectralLightColourArray[idx];
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

    function convertToPercent(value, dp) {
        dp = dp || 2;
        return (value * 100).toFixed(dp);
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
    function addPopulationChart(chart, dataDict) {
        chart.data.datasets[1].data = chart.data.labels.map(function(key) {
            return convertToPercent(dataDict[key])
        });
        if (chart.config.type == 'pie') {
            var dataLength = chart.data.labels.length;
            chart.data.datasets[1].backgroundColor = getColourArray2(dataLength);
        }
        chart.update();
    }
    function updatePopulationChart(chart, dataDict) {
        chart.data.datasets[1].data = chart.data.labels.map(function(key) {
            return convertToPercent(dataDict[key])
        });
        if (chart.config.type == 'pie') {
            var dataLength = chart.data.labels.length;
            chart.data.datasets[1].backgroundColor = getColourArray2(dataLength);
        }
    }
    function addPopulationAge10Chart(chart, dataDict) {
        popData = {
            label: 'Population',
            type: 'line',
            fill: false,
            backgroundColor: 'rgba(0,0,0,0.7)',
            data: [dataDict['20'],
                dataDict['30'],
                dataDict['40'],
                dataDict['50'],
                dataDict['60']]
        };
        chart.data.datasets[1] = popData;
        chart.update();
    }
    function addPopulationAge5Chart(chart, dataDict) {
        popData = {
            label: 'Population',
            type: 'line',
            fill: false,
            backgroundColor: 'rgba(0,0,0,0.7)',
            data: [dataDict['20'],
                dataDict['25'],
                dataDict['30'],
                dataDict['35'],
                dataDict['40'],
                dataDict['45'],
                dataDict['50'],
                dataDict['55'],
                dataDict['60'],
                dataDict['65']]
        };
        chart.data.datasets[1] = popData;
        chart.update();
    }

    // mapbox
    /**********************************
     * MAPBOX TOKEN AND INITIALISATION *
     ***********************************/

    mapboxgl.accessToken = 'pk.eyJ1IjoidGF5eWg4OSIsImEiOiJjaXh1NjNpOGYwMDRlMzJueWpvM3Y5cWh3In0.JcG3gPgPbOposSrudP8t1w';
    let map1 = new mapboxgl.Map({
        container: 'map1',
        center: [103.8198, 1.3521],
        zoom: 11,
        style: 'mapbox://styles/mapbox/dark-v9'
    });

    // disable map rotation using right click + drag
    map1.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map1.touchZoomRotate.disableRotation();

    // Create a popup, but don't add it to the map yet.
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    var mapmode = 'residence';
    $('input:radio[name="mapmode"]').change(function() {
        mapmode = $(this).val();
        updatePAreaRender(attrTable, mapmode);
    });

    map1.on('load', function () {
        renderPArea();
    });

    let data_render_pArea = null;
    let map_pArea = {};
    let layer_pArea = "layer_pArea";
        let source_pArea = "source_pArea";
    function renderPArea() {
        $.getJSON("json/planning_area", function (result) {
            data_render_pArea = result;

            for (let i = 0; i < result.features.length; i++) {
                let some_area = result.features[i];
                let some_area_name = some_area["properties"]["planning_area"];
                map_pArea[some_area_name] = i;
            }

            map1.addSource(source_pArea, {
                type: 'geojson',
                data: data_render_pArea
            });

            map1.addLayer({
                'id': layer_pArea,
                'type': 'fill',
                'source': source_pArea,
                'layout': {},
                'paint': {
                    'fill-color': {
                        "property": "count",
                        "stops": [
                            // "freq" is 0   -> circle color will be blue
                            [-2, '#888888'],
                            [-1, '#ffffff'],
                            [0, '#ffffff'],
                            [0.01, '#37FF00'],
                            [4, '#FFFB00'],
                            // "freq" is 100 -> circle color will be red
                            [7, '#FF0000']
                        ]
                    },
                    'fill-outline-color': '#bbbbbb',
                    'fill-opacity': {
                        "property": "count",
                        "stops": [
                            [-2, 0.1],
                            [-1, 0.3],
                            [0, 0.0],
                            [1, 0.2],
                            [7, 0.9]
                        ]
                    }
                }
            });
            console.log("renderPArea OK");

        }).fail(function () {
            console.log("error");
        }).success(function () {
            updatePAreaRender (attrTable, mapmode)
        });
    }

    function updatePAreaRender(attrDict, attr) {
        if (!data_render_pArea) return;
        var dataDict = attrDict["infer_" + attr + "_planning_area"];
        for (var i=0;i<data_render_pArea.features.length;i++) {
            var planning_area = data_render_pArea.features[i].properties.planning_area;
            data_render_pArea.features[i].properties.count = dataDict[planning_area] || 0;
        }

        map1.getSource(source_pArea).setData(data_render_pArea);
    }

    map1.on('mousemove', function (e) {
        let features = map1.queryRenderedFeatures(e.point, {layers: [layer_pArea]});
        map1.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) return;

        popup.remove();

        var feature = features[0];
        // if (feature.properties.count == 0) {
        //     return;
        // }

        var centroid = JSON.parse(feature.properties.cent);
        var ll = new mapboxgl.LngLat(centroid[0], centroid[1]);

        var planning_area = feature.properties.planning_area;
        var residence_count = attrTable.infer_residence_planning_area[planning_area] || 0;
        var workplace_count = attrTable.infer_workplace_planning_area[planning_area] || 0;

        popup = new mapboxgl.Popup({closeButton: false})
            .setLngLat(ll) //.setLngLat(map.unproject(e.point))
            // .setHTML(planning_area)
            .setHTML("<strong>" + feature.properties.planning_area + "</strong>" +
                "<p>" + "Residence: " + residence_count + "% of segment" + "</p>" +
                "<p>" + "Workplace: " + workplace_count + "% of segment" + "</p>"
            )
            .addTo(map1);
    });

});