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
    var rawData = {
        domain: [],
        thread: [],
        network_name: [],
        data_activity: {}
    };
    var aggData = {
        domainTier1: {},
        domainTier2: {},
        network_type: {},
        forum: {}
    };
    var aggDataPercent = {
        domainTier1: {},
        domainTier2: {},
        network_type: {},
        forum: {}
    };
    var mapTable = {
        domainTier2: {}
    };
    var colourMap = {
        domainTier1: {},
        network_type: {},
        forum: {}
    };
    var populationData = {
        data_activity: {},
        tier1: {},
        tier2: {},
        forum: {},
        network_type: {}
    };
    var populationRaw = {
        domain: {},
        thread: {},
        network_name: {}
    };
    // var spectralColourArray =   ['rgba(50,136,189,0.7)',
    //                             'rgba(102,194,165,0.7)',
    //                             'rgba(171,221,164,0.7)',
    //                             'rgba(230,245,152,0.7)',
    //                             'rgba(255,255,191,0.7)',
    //                             'rgba(254,224,139,0.7)',
    //                             'rgba(253,174,97,0.7)',
    //                             'rgba(244,109,67,0.7)',
    //                             'rgba(213,62,79,0.7)',
    //                             'rgba(158,1,66,0.7)']; //'rgba(94,79,162,0.7)',
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
    var month = null, year = null;

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
        $('#month_display').text('...');
        month = e.date.getMonth() + 1;
        year = e.date.getFullYear();
        $.ajax({
            url: 'cookie_set_date/' + year + '/' + month
        });
        query_data(year, month);
        loadPopulationData(year, month);
    });


    //---------------------
    //- initialise charts -
    //---------------------

    // // Chart.defaults.global.maintainAspectRatio = false;
    var barChartOptions = {
        legend: {
            display: false
        },
        tooltips: {
            intersect: false,
            mode: "x",
            callbacks: {
                title: function (item, data) {return data.labels[item[0].index];},
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
                ticks: {
                    beginAtZero:true
                }
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
    var barChartOptions2 = {
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
                id: 0,
                position: 'left',
                ticks: {
                    beginAtZero: true
                }
            }, {
                id: 1,
                position: 'right',
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    // activity chart
    var activityLabels = [];
    for (i=0;i<24;i++) {
        activityLabels.push(('0' + i).slice(-2) + ':00');
        activityLabels.push(('0' + i).slice(-2) + ':30');
    }
    var activityData = {
        labels: activityLabels,
        datasets: [{
            label: 'Segment Weekday Usage',
            fill: false,
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: getColourArray(2)[0]
        }, {
            label: 'Segment Weekend Usage',
            fill: false,
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: getColourArray(2)[1]
        }, {
            label: 'Population Weekday Usage',
            fill: false,
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: getColourArray2(2)[0]
        }, {
            label: 'Population Weekend Usage',
            fill: false,
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            backgroundColor: getColourArray2(2)[1]
        }]
    };
    var activityChartCanvas = $("#activityChart");
    var activityChart = new Chart(activityChartCanvas, {
        type: 'line',
        data: activityData,
        options: barChartOptions
    });
    // tier1 chart
    var tier1ChartCanvas = $("#tier1Chart");
    var tier1Chart = new Chart(tier1ChartCanvas, {
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
    // tier2 chart
    var tier2ChartCanvas = $("#tier2Chart");
    var tier2Chart = new Chart(tier2ChartCanvas, {
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
    var forumChartCanvas = $("#forumChart");
    var forumChart = new Chart(forumChartCanvas, {
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
    var networkTypeChartCanvas = $("#networkTypeChart");
    var networkTypeChart = new Chart(networkTypeChartCanvas, {
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
    var domainTable = $("#top_domain_table").DataTable();
    var threadTable = $("#top_thread_table").DataTable();
    var networkNameTable = $("#top_networkName_table").DataTable();

    loadSettingsFromCookie();
    $('#month_display').text('...');

    function loadSettingsFromCookie() {
        $.ajax({
            url: 'read_cookie'
        }).success(function(results){
            if (results.filter_settings) {
                parseCurrentFilter(results.filter_settings);
                updateTopWidgets(results);
                year = results.dateParams.year;
                month = results.dateParams.month;
                query_data(year, month);
                loadPopulationData(year, month);
            } else {
                parseCurrentFilter(default_options);
                $('#submit').submit();
                $.ajax({
                    url: 'cookie_set_date/2016/7'
                });
                query_data(2016, 7);
                loadPopulationData(2016, 7);
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

    tier1ChartCanvas.click(function(evt){
        var activePoints = tier1Chart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        if (firstPoint) {
            var label = tier1Chart.data.labels[firstPoint._index];
            updateChartWithFilter(tier2Chart, aggDataPercent.domainTier2, populationData.tier2, 20, mapTable.domainTier2,  colourMap.domainTier1, label);
            updateDomainTable('traffic', 'tier1', label);
        }
    });
    tier2ChartCanvas.click(function(evt) {
        var activePoints = tier2Chart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        if (firstPoint) {
            var label = tier2Chart.data.labels[firstPoint._index];
            updateDomainTable('traffic', 'tier2', label);
        }
    });
    networkTypeChartCanvas.click(function(evt) {
        var activePoints = networkTypeChart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        if (firstPoint) {
            var label = networkTypeChart.data.labels[firstPoint._index];
            updateNetworkTable('traffic', label);
        }
    });
    forumChartCanvas.click(function(evt) {
        var activePoints = forumChart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        if (firstPoint) {
            var label = forumChart.data.labels[firstPoint._index];
            updateThreadTable('traffic', label);
        }
    });

    $('#tier2Reset').click(function() {
        updateChartWithColourMapping(tier2Chart, aggDataPercent.domainTier2, populationData.tier2, 20, mapTable.domainTier2, colourMap.domainTier1);
    });
    $('#domainReset').click(function() {
        updateDomainTable('traffic');
    });
    $('#threadReset').click(function() {
        updateThreadTable('traffic');
    });
    $('#networkReset').click(function() {
        updateNetworkTable('traffic');
    });

    //filters applied, query new data, update charts
    $('#filter_form').submit(function(evt) {
        evt.preventDefault();
        var frm = $(this);
        $('#segment_display').text('...');
        $('#sampleSize_display').text('...');
        $('#ageRange_display').text('...');
        $('#month_display').text('...');

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
        console.time('Domain query:');
        query_domain(year, month);
        query_forum(year, month);
        query_interest_group(year, month);
        query_data_activity(year, month);
    }

    function query_domain(year, month) {
        $.ajax({
            url: 'query_mc_domain/' + year + '/' + month
        }).success(updateDomainData).success(function() {
            colourMap.domainTier1 = updateChart(tier1Chart, aggDataPercent.domainTier1, populationData.tier1, 10);
            updateChartWithColourMapping(tier2Chart, aggDataPercent.domainTier2, populationData.tier2, 20, mapTable.domainTier2, colourMap.domainTier1);
            updateDomainTable('traffic');
            $('#month_display').text(month + '/' + year);
            console.timeEnd('Domain query:');
        });
    }
    function updateDomainData(results) {
        aggDataPercent.domainTier1 = {};
        aggDataPercent.domainTier2 = {};
        rawData.domain = results;
        for (i = 0; i < results.length; i++) {
            var row = results[i];
            if (!aggDataPercent.domainTier1[row.tier1]) aggDataPercent.domainTier1[row.tier1] = parseFloat(row.percent_traffic);
            else aggDataPercent.domainTier1[row.tier1] += parseFloat(row.percent_traffic);
            if (!aggDataPercent.domainTier2[row.tier2]) aggDataPercent.domainTier2[row.tier2] = parseFloat(row.percent_traffic);
            else aggDataPercent.domainTier2[row.tier2] += parseFloat(row.percent_traffic);
            if (!mapTable.domainTier2[row.tier2]) mapTable.domainTier2[row.tier2] = row.tier1;
        }
    }
    function updateDomainTable(sortedCol, filterCol, filterValue) {
        var data = sortObject(rawData.domain, sortedCol);
        domainTable.destroy();
        $("#top_domain_list").html("");
        var i = 0, j = 0;
        while (i<100 && j < data.length) {
            var row = data[j];
            j++;
            if (filterValue) if (row[filterCol] != filterValue) continue;
            var rowHtml = "<tr>";
            rowHtml += "<td>" + j + "</td>";
            rowHtml += "<td>" + row.domain + "</td>";
            rowHtml += "<td>" + row.tier2 + "</td>";
            rowHtml += "<td>" + row.tier1 + "</td>";
            rowHtml += "<td><span style=\"background-color:" + colourMap.domainTier1[row.tier1] +"\">" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>";
            rowHtml += "<td>" + row.traffic + "</td>";
            rowHtml += "<td>" + convertToPercent(row.percent_traffic, 4) + "</td>";
            rowHtml += "<td>" + row.count + "</td>";
            rowHtml += "<td>" + convertToPercent(populationRaw.domain[row.tier1][row.tier2][row.domain].traffic, 4) || 0 + "</td>";
            rowHtml += "</tr>";
            $("#top_domain_list").append(rowHtml);
            i++;
        }
        domainTable = $("#top_domain_table").DataTable({
            "paging": true,
            "autoWidth": true,
            "pageLength": 10,
            "order": [[ 5, 'desc' ],  [6, 'desc' ]],
            "scrollX": true,
            "retrieve": true
        });
    }

    function query_forum(year, month) {
        $.ajax({
            url: 'query_mc_forum/' + year + '/' + month
        }).success(updateForumData).success(function() {
            colourMap.forum = updateChart(forumChart, aggDataPercent.forum, populationData.forum, 10);
            updateThreadTable('traffic');
        });
    }
    function updateForumData(results) {
        aggDataPercent.forum = {};
        rawData.thread = results;
        for (i = 0; i < results.length; i++) {
            var row = results[i];
            if (!aggDataPercent.forum[row.forum]) aggDataPercent.forum[row.forum] = parseFloat(row.percent_traffic);
            else aggDataPercent.forum[row.forum] += parseFloat(row.percent_traffic);
        }
    }
    function updateThreadTable(sortedCol, filterValue) {
        if (!Object.keys(populationRaw.thread).length) return;
        if (!rawData.thread) return;
        // var data = sortObject(rawData.thread, sortedCol);
        var data = rawData.thread;
        threadTable.destroy();
        $("#top_thread_list").html("");
        var i = 0, j = 0;
        while (i<20 && j < data.length) {
            var row = data[j];
            j++;
            if (filterValue) if (row.forum != filterValue) continue;
            var rowHtml = "<tr>";
            rowHtml += "<td>" + j + "</td>";
            rowHtml += "<td>" + row.thread + "</td>";
            rowHtml += "<td>" + row.forum + "</td>";
            rowHtml += "<td><span style=\"background-color:" + colourMap.forum[row.forum] +"\">" +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>";
            rowHtml += "<td>" + row.traffic + "</td>";
            rowHtml += "<td>" + convertToPercent(row.percent_traffic, 4) + "</td>";
            rowHtml += "<td>" + row.count + "</td>";
            rowHtml += "<td>" + row.avg_duration.toFixed(0) + "</td>";
            if (populationRaw.thread[row.forum][row.thread]) {
                rowHtml += "<td>" + convertToPercent(populationRaw.thread[row.forum][row.thread].traffic, 4) + "</td>";
            } else {
                rowHtml += "<td>0</td>";
            }

            rowHtml += "</tr>";
            $("#top_thread_list").append(rowHtml);
            i++;
        }
        threadTable = $("#top_thread_table").DataTable({
            "paging": true,
            "autoWidth": true,
            "pageLength": 5,
            "order": [[ 4, 'desc' ],  [5, 'desc' ]],
            "scrollX": true,
            "retrieve": true,
        });
    }

    function secondToMinute(seconds) {
        return (seconds / 60).toFixed(2);
    }

    function query_interest_group(year, month) {
        $.ajax({
            url: 'query_mc_interest_group/' + year + '/' + month
        }).success(updateNetworkData).success(function() {
            colourMap.network_type = updateChart(networkTypeChart, aggDataPercent.network_type, populationData.network_type, 10);
            updateNetworkTable('traffic');
        });
    }
    function updateNetworkData(results) {
        aggDataPercent.network_type = {};
        rawData.network_name = results;
        for (i = 0; i < results.length; i++) {
            var row = results[i];
            if (!aggDataPercent.network_type[row.network_type]) {
                aggDataPercent.network_type[row.network_type] = parseFloat(row.percent_traffic);
            }
            else aggDataPercent.network_type[row.network_type] += parseFloat(row.percent_traffic);
        }
    }
    function updateNetworkTable(sortedCol, filterValue) {
        if (!Object.keys(populationRaw.network_name).length) return;
        if (!rawData.network_name) return;
        // var data = sortObject(rawData.network_name, sortedCol);
        var data = rawData.network_name;
        networkNameTable.destroy();
        $("#top_networkName_list").html("");
        var i = 0, j = 0;
        while (i<100 && j < data.length) {
            var row = data[j];
            j++;
            if (filterValue) if (row.network_type != filterValue) continue;
            var rowHtml = "<tr>";
            rowHtml += "<td>" + j + "</td>";
            rowHtml += "<td>" + row.network_name + "</td>";
            rowHtml += "<td>" + row.network_type + "</td>";
            rowHtml += "<td><span style=\"background-color:" + colourMap.network_type[row.network_type] +"\">" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></td>";
            rowHtml += "<td>" + row.traffic + "</td>";
            rowHtml += "<td>" + convertToPercent(row.percent_traffic, 4) + "</td>";
            rowHtml += "<td>" + row.count + "</td>";
            rowHtml += "<td>" + row.avg_duration.toFixed(0) + "</td>";
            rowHtml += "<td>" + convertToPercent(populationRaw.network_name[row.network_type][row.network_name].traffic, 4) || 0 + "</td>";
            rowHtml += "</tr>";
            $("#top_networkName_list").append(rowHtml);
            i++;
        }
        networkNameTable = $("#top_networkName_table").DataTable({
            "paging": true,
            "autoWidth": true,
            "pageLength": 10,
            "order": [[ 4, 'desc' ],  [5, 'desc' ]],
            "scrollX": true,
            "retrieve": true,
        });
    }

    function query_data_activity(year, month) {
        $.when(
            $.ajax({
                url: 'query_mc_data_activity/' + year + '/' + month + '?is_weekend=false'
            }).then(function(results) {
                updateActivityData(results, 'weekday', rawData.data_activity)
            }),
            $.ajax({
                url: 'query_mc_data_activity/' + year + '/' + month + '?is_weekend=true'
            }).then(function(results) {
                updateActivityData(results, 'weekend', rawData.data_activity)
            })
        ).then(function() {
            updateActivityChart(activityChart, rawData.data_activity)
        })
    }
    function updateActivityData(results, day_of_week, dataDict) {
        var newDataDict = {};
        for (i = 0; i < results.length; i++) {
            newDataDict[results[i].start_timeband.slice(0,5)] = results[i].percentage_usage
        }
        dataDict[day_of_week] = newDataDict;
    }

    function loadPopulationData(year, month) {
        loadPopulationActivityData(year, month);
        loadPopulationDomainData(year, month);
        loadPopulationForumData(year, month);
        loadPopulationNetworkData(year, month);
    }
    function loadPopulationActivityData(year, month) {
        $.when(
            $.ajax({
                url: 'query_mc_data_activity_population/' + year + '/' + month + '?is_weekend=false'
            }).then(function(results) {
                updateActivityData(results, 'weekday', populationData.data_activity)
            }),
            $.ajax({
                url: 'query_mc_data_activity_population/' + year + '/' + month + '?is_weekend=true'
            }).then(function(results) {
                updateActivityData(results, 'weekend', populationData.data_activity)
            })).then(function() {
            updatePopulationActivityChart(activityChart, populationData.data_activity)
        })
    }
    function loadPopulationDomainData(year, month) {
        $.ajax({
            url: 'query_mc_domain_population/' + year + '/' + month
        }).then(updatePopulationDomainData).then(function() {
            addPopulationChart(tier1Chart, populationData.tier1);
            addPopulationChart(tier2Chart, populationData.tier2);
        });
    }
    function updatePopulationDomainData(results) {
        populationData.tier1 = {};
        populationData.tier2 = {};
        for (i=0;i<results.length;i++) {
            var row = results[i];
            if (!populationData.tier1[row.tier1]) {
                populationData.tier1[row.tier1] = row.percent_traffic;
            } else {
                populationData.tier1[row.tier1] += row.percent_traffic;
            }
            if (!populationData.tier2[row.tier2]) {
                populationData.tier2[row.tier2] = row.percent_traffic;
            } else {
                populationData.tier2[row.tier2] += row.percent_traffic;
            }
            if (!populationRaw.domain[row.tier1]){
                populationRaw.domain[row.tier1] = {}
            }
            if (!populationRaw.domain[row.tier1][row.tier2]){
                populationRaw.domain[row.tier1][row.tier2] = {}
            }
            populationRaw.domain[row.tier1][row.tier2][row.domain] = {
                traffic: row.percent_traffic,
                count: null
            }
        }
    }
    function loadPopulationForumData(year, month) {
        $.ajax({
            url: 'query_mc_forum_population/' + year + '/' + month
        }).then(updatePopulationForumData).then(function() {
            addPopulationChart(forumChart, populationData.forum);
            updateThreadTable();
        })
    }
    function updatePopulationForumData(results) {
        populationData.forum = {};
        for (i=0;i<results.length;i++) {
            var row = results[i];
            if (!populationData.forum[row.forum]) {
                populationData.forum[row.forum] = row.percent_traffic;
            } else {
                populationData.forum[row.forum] += row.percent_traffic;
            }
            if (!populationRaw.thread[row.forum]){
                populationRaw.thread[row.forum] = {}
            }
            populationRaw.thread[row.forum][row.thread] = {
                traffic: row.percent_traffic,
                count: null
            }
        }
    }
    function loadPopulationNetworkData(year, month) {
        $.ajax({
            url: 'query_mc_interest_group_population/' + year + '/' + month
        }).then(updatePopulationNetworkData).then(function() {
            addPopulationChart(networkTypeChart, populationData.network_type);
            updateNetworkTable();
        })
    }
    function updatePopulationNetworkData(results) {
        populationData.network_type = {};
        for (i=0;i<results.length;i++) {
            var row = results[i];
            if (!populationData.network_type[row.network_type]) {
                populationData.network_type[row.network_type] = row.percent_traffic;
            } else {
                populationData.network_type[row.network_type] += row.percent_traffic;
            }
            if (!populationRaw.network_name[row.network_type]){
                populationRaw.network_name[row.network_type] = {}
            }
            populationRaw.network_name[row.network_type][row.network_name] = {
                traffic: row.percent_traffic,
                count: null
            }
        }
    }

    function resetChart(chart) {
        for (i=0;i<chart.data.datasets.length;i++){
            for (j=0;j<chart.data.datasets[i].data.length;j++) {
                chart.data.datasets[i].data[j] = 0;
            }
        }
        chart.update();
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

    function updateChartWithFilter(chart, dataDict, popDataDict, dataLength, mapTable, colourMap, filterValue) {
        var dataDictSub = {};
        for (var key in dataDict) {
            if (dataDict.hasOwnProperty(key) && mapTable[key] == filterValue){
                dataDictSub[key] = dataDict[key];
            }
        }
        updateChart(chart, dataDictSub, popDataDict, dataLength, colourMap[filterValue]);
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

    // function getColourArray(numOfLabels) {
    //     var colourArray = [];
    //     if (numOfLabels == 1) {
    //         colourArray = "hsl(0,100%,75%)"
    //     } else {
    //         for (var i = 0; i < numOfLabels; i++) {
    //             var segmentAngle = parseInt(i * 360 / numOfLabels);
    //             colourArray.push("hsl(" + segmentAngle + ",100%,75%)");
    //         }
    //     }
    //     return colourArray
    // }
    function getColourArray(numOfLabels) {
        var idx = numOfLabels - 1;
        return spectralColourArray2[idx]
    }
    function getColourArray2(numOfLabels) {
        var idx = numOfLabels - 1;
        return spectralLightColourArray[idx]
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
            valueArray.push(convertToPercent(keyValueArray[i][1]))
        }
        return valueArray
    }

    function updateActivityChart(chart, dataDict) {
        if (!dataDict) {
            resetChart(chart);
        }
        for (i=0;i<chart.data.labels.length;i++) {
            var label = chart.data.labels[i];
            chart.data.datasets[0].data[i] = convertToPercent(dataDict.weekday[label]) || 0;
            chart.data.datasets[1].data[i] = convertToPercent(dataDict.weekend[label]) || 0;
        }
        chart.update()
    }
    function updatePopulationActivityChart(chart, dataDict) {
        if (!dataDict) {
            resetChart(chart);
        }
        for (i=0;i<chart.data.labels.length;i++) {
            var label = chart.data.labels[i];
            chart.data.datasets[2].data[i] = convertToPercent(dataDict.weekday[label]) || 0;
            chart.data.datasets[3].data[i] = convertToPercent(dataDict.weekend[label]) || 0;
        }
        chart.update()
    }

    function convertToPercent(value, dp) {
        dp = dp || 2;
        return (value * 100).toFixed(dp);
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
});