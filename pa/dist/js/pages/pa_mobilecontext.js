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
    var rawData = {
        'domain': [],
        'thread': [],
        'network_name': []
    };
    var aggData = {
        'domainTier1': {},
        'domainTier2': {},
        'network_type': {},
        'forum': {}
    };
    var mapTable = {
        'domainTier2': {}
    };
    var colourMap = {
        'domainTier1': {},
        'network_type': {},
        'forum': {}
    };
    var month = null, year = null;

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
    var horizontalBarChartOptions = {
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };
    // tier1 chart
    var tier1ChartCanvas = $("#tier1Chart");
    var tier1Chart = new Chart(tier1ChartCanvas, {
        type: 'bar',
        data: {
            datasets: [{
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
                data: [1]
            }]
        },
        options: barChartOptions
    });
    var forumChartCanvas = $("#forumChart");
    var forumChart = new Chart(forumChartCanvas, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                data: [1]
            }]
        },
        options: horizontalBarChartOptions
    });
    var networkTypeChartCanvas = $("#networkTypeChart");
    var networkTypeChart = new Chart(networkTypeChartCanvas, {
        type: 'horizontalBar',
        data: {
            datasets: [{
                data: [1]
            }]
        },
        options: horizontalBarChartOptions
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
                query_data(year, month)
            } else {
                parseCurrentFilter(default_options);
                $('#submit').submit();
                $.ajax({
                    url: 'cookie_set_date/2016/7'
                });
                query_data(2016, 7)
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

    tier1ChartCanvas.click(function(evt){
        var activePoints = tier1Chart.getElementsAtEvent(evt);
        var firstPoint = activePoints[0];
        if (firstPoint) {
            var label = tier1Chart.data.labels[firstPoint._index];
            updateChartWithFilter(tier2Chart, aggData.domainTier2, 20, mapTable.domainTier2, colourMap.domainTier1, label);
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
        updateChartWithColourMapping(tier2Chart, aggData.domainTier2, 20, mapTable.domainTier2, colourMap.domainTier1);
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
        query_domain(year, month);
        query_forum(year, month);
        query_interest_group(year, month);
    }

    function query_domain(year, month) {
        $.ajax({
            url: 'query_mc_domain/' + year + '/' + month
        }).success(updateDomainData).success(function() {
            colourMap.domainTier1 = updateChart(tier1Chart, aggData.domainTier1, 10);
            updateChartWithColourMapping(tier2Chart, aggData.domainTier2, 20, mapTable.domainTier2, colourMap.domainTier1);
            updateDomainTable('traffic');
            $('#month_display').text(month + '/' + year);
        });
    }
    function updateDomainData(results) {
        aggData.domainTier1 = {};
        aggData.domainTier2 = {};
        rawData.domain = results;
        for (i = 0; i < results.length; i++) {
            var row = results[i];
            if (!aggData.domainTier1[row.tier1]) aggData.domainTier1[row.tier1] = parseInt(row.traffic);
            else aggData.domainTier1[row.tier1] += parseInt(row.traffic);
            if (!aggData.domainTier2[row.tier2]) aggData.domainTier2[row.tier2] = parseInt(row.traffic);
            else aggData.domainTier2[row.tier2] += parseInt(row.traffic);
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
            rowHtml += "<td style=\"background-color:" + (colourMap.domainTier1[row.tier1] || 'rgba(0,0,0,0.1)') +"\">" + row.tier2 + "</td>";
            rowHtml += "<td style=\"background-color:" + (colourMap.domainTier1[row.tier1] || 'rgba(0,0,0,0.1)') +"\">" + row.tier1 + "</td>";
            rowHtml += "<td>" + row.traffic + "</td>";
            rowHtml += "<td>" + row.count + "</td>";
            rowHtml += "</tr>";
            $("#top_domain_list").append(rowHtml);
            i++;
        }
        domainTable = $("#top_domain_table").DataTable({
            "paging": true,
            "autoWidth": true,
            "pageLength": 10,
            "order": [[ 4, 'desc' ],  [5, 'desc' ]],
            "scrollX": true,
            "retrieve": true
        });
    }

    function query_forum(year, month) {
        $.ajax({
            url: 'query_mc_forum/' + year + '/' + month
        }).success(updateForumData).success(function() {
            colourMap.forum = updateChart(forumChart, aggData.forum);
            updateThreadTable('traffic');
        });
    }
    function updateForumData(results) {
        aggData.forum = {};
        rawData.thread = results;
        for (i = 0; i < results.length; i++) {
            var row = results[i];
            if (!aggData.forum[row.forum]) aggData.forum[row.forum] = parseInt(row.traffic);
            else aggData.forum[row.forum] += parseInt(row.traffic);
        }
    }
    function updateThreadTable(sortedCol, filterValue) {
        var data = sortObject(rawData.thread, sortedCol);
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
            rowHtml += "<td style=\"background-color:" + colourMap.forum[row.forum] +"\">" + row.forum + "</td>";
            rowHtml += "<td>" + row.traffic + "</td>";
            rowHtml += "<td>" + row.count + "</td>";
            rowHtml += "</tr>";
            $("#top_thread_list").append(rowHtml);
            i++;
        }
        threadTable = $("#top_thread_table").DataTable({
            "paging": true,
            "autoWidth": true,
            "pageLength": 5,
            "order": [[ 3, 'desc' ],  [4, 'desc' ]],
            "scrollX": true,
            "retrieve": true,
        });
    }

    function query_interest_group(year, month) {
        $.ajax({
            url: 'query_mc_interest_group/' + year + '/' + month
        }).success(updateNetworkData).success(function() {
            colourMap.network_type = updateChart(networkTypeChart, aggData.network_type);
            updateNetworkTable('traffic');
        });
    }
    function updateNetworkData(results) {
        aggData.network_type = {};
        rawData.network_name = results;
        for (i = 0; i < results.length; i++) {
            var row = results[i];
            if (!aggData.network_type[row.network_type]) aggData.network_type[row.network_type] = parseInt(row.traffic);
            else aggData.network_type[row.network_type] += parseInt(row.traffic);
        }
    }
    function updateNetworkTable(sortedCol, filterValue) {
        var data = sortObject(rawData.network_name, sortedCol);
        networkNameTable.destroy();
        $("#top_networkName_list").html("");
        var i = 0, j = 0;
        while (i<20 && j < data.length) {
            var row = data[j];
            j++;
            if (filterValue) if (row.network_type != filterValue) continue;
            var rowHtml = "<tr>";
            rowHtml += "<td>" + j + "</td>";
            rowHtml += "<td>" + row.network_name + "</td>";
            rowHtml += "<td style=\"background-color:" + colourMap.network_type[row.network_type] +"\">" + row.network_type + "</td>";
            rowHtml += "<td>" + row.traffic + "</td>";
            rowHtml += "<td>" + row.count + "</td>";
            rowHtml += "</tr>";
            $("#top_networkName_list").append(rowHtml);
            i++;
        }
        networkNameTable = $("#top_networkName_table").DataTable({
            "paging": true,
            "autoWidth": true,
            "pageLength": 5,
            "order": [[ 3, 'desc' ],  [4, 'desc' ]],
            "scrollX": true,
            "retrieve": true,
        });
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