$(function () {
    /* ChartJS
     * -------
     * Here we will create a few charts using ChartJS
     */

    var colorPalette = [
        'hsla(0, 100%, 80%, 1)', //col1 //red **
        'hsla(100, 100%, 80%, 1)', //col2 /green
        'hsla(200, 100%, 80%, 1)', //col3 //lightblue
        'hsla(300, 100%, 80%, 1)', //col4 //pink
        'hsla(40, 100%, 80%, 1)', //col5 //orange **
        'hsla(140, 100%, 80%, 1)', //col6 //green
        'hsla(240, 100%, 80%, 1)', //col7 //indigo
        'hsla(340, 100%, 80%, 1)', //col8 //red
        'hsla(80, 100%, 80%, 1)', //col9 //green **
        'hsla(180, 100%, 80%, 1)', //col10 //brightblue
        'hsla(280, 100%, 80%, 1)', //col11 //purple
        'hsla(20, 100%, 80%, 1)', //col12 //orange
        'hsla(120, 100%, 80%, 1)', //col13 //green
        'hsla(220, 100%, 80%, 1)', //col14 //blue **
        'hsla(320, 100%, 80%, 1)', //col15 //pink
        'hsla(60, 100%, 80%, 1)', //col16 //yellow
        'hsla(160, 100%, 80%, 1)', //col17 //teal **
        'hsla(260, 100%, 80%, 1)', //col18 //purple **
    ];

    //fixed decimal places for numbers
    // (100/3).toFixed(2); // for 2 decimal places

    // 18 colours
    var data = {
        labels: ["col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "col10", "col11", "col12", "col13", "col14", "col15", "col16", "col17", "col18"],
            datasets: [{
            label: '# of Votes',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            backgroundColor: [
                'hsla(0, 100%, 80%, 1)', //col1 //red **
                'hsla(100, 100%, 80%, 1)', //col2 /green
                'hsla(200, 100%, 80%, 1)', //col3 //lightblue
                'hsla(300, 100%, 80%, 1)', //col4 //pink
                'hsla(40, 100%, 80%, 1)', //col5 //orange **
                'hsla(140, 100%, 80%, 1)', //col6 //green
                'hsla(240, 100%, 80%, 1)', //col7 //indigo
                'hsla(340, 100%, 80%, 1)', //col8 //red
                'hsla(80, 100%, 80%, 1)', //col9 //green **
                'hsla(180, 100%, 80%, 1)', //col10 //brightblue
                'hsla(280, 100%, 80%, 1)', //col11 //purple
                'hsla(20, 100%, 80%, 1)', //col12 //orange
                'hsla(120, 100%, 80%, 1)', //col13 //green
                'hsla(220, 100%, 80%, 1)', //col14 //blue **
                'hsla(320, 100%, 80%, 1)', //col15 //pink
                'hsla(60, 100%, 80%, 1)', //col16 //yellow
                'hsla(160, 100%, 80%, 1)', //col17 //teal **
                'hsla(260, 100%, 80%, 1)', //col18 //purple **
            ]
        }]
    };

    // 12 colours
    var data2 = {
        labels: ["col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "col10", "col11", "col12"],
        datasets: [{
            label: '# of Votes',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            backgroundColor: [
                'hsla(0, 100%, 80%, 1)', //col1 //red **
                'hsla(120, 100%, 80%, 1)', //col13 //green
                'hsla(240, 100%, 80%, 1)', //col7 //indigo
                'hsla(30, 100%, 80%, 1)', //col5 //orange **
                'hsla(150, 100%, 80%, 1)', //col6 //green
                'hsla(270, 100%, 80%, 1)', //col18 //purple **
                'hsla(60, 100%, 80%, 1)', //col16 //yellow
                'hsla(180, 100%, 80%, 1)', //col10 //brightblue
                'hsla(300, 100%, 80%, 1)', //col4 //pink
                'hsla(90, 100%, 80%, 1)', //col9 //lightgreen **
                'hsla(210, 100%, 80%, 1)', //col3 //blue
                'hsla(330, 100%, 80%, 1)', //col15 //pink
            ]
        }]
    };


    // 12 colours
    var data3 = {
        labels: ["col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", "col10", "col11", "col12"],
        datasets: [{
            label: '# of Votes',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            backgroundColor: [
                'hsla(0, 100%, 80%, 1)', //col1 //red **
                'hsla(30, 100%, 80%, 1)', //col5 //orange **
                'hsla(60, 100%, 80%, 1)', //col16 //yellow
                'hsla(90, 100%, 80%, 1)', //col9 //lightgreen **
                'hsla(120, 100%, 80%, 1)', //col13 //green
                'hsla(150, 100%, 80%, 1)', //col6 //green
                'hsla(180, 100%, 80%, 1)', //col10 //brightblue
                'hsla(210, 100%, 80%, 1)', //col3 //blue
                'hsla(240, 100%, 80%, 1)', //col7 //indigo
                'hsla(270, 100%, 80%, 1)', //col18 //purple **
                'hsla(300, 100%, 80%, 1)', //col4 //pink
                'hsla(330, 100%, 80%, 1)', //col15 //pink
            ]
        }]
    };

    //--------------
    //-  BAR CHART -
    //--------------
    // get bar chart context
    var barChartCanvas = $("#barChart");

    var barChartOptions = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    };

    // var barChart = new Chart(barChartCanvas, {
    //     type: 'bar',
    //     data: data,
    //     options: barChartOptions
    // });

    var barChart = Chart.Bar(barChartCanvas, {
        data: data,
        options: barChartOptions
    });

    //--------------
    //-  PIE CHART -
    //--------------
    // get donut chart context
    var pieChartCanvas = $("#pieChart");

    var pieChartOptions = {

    };

    var pieChart = new Chart(pieChartCanvas, {
        type: 'pie',
        data: data,
        options: pieChartOptions
    });

    //----------------
    //-  PIE CHART 2 -
    //----------------
    // get bar chart context
    var pieChart2Canvas = $("#pieChart2");

    new Chart(pieChart2Canvas, {
        type: 'pie',
        data: data2,
        options: pieChartOptions
    });

    //----------------
    //-  PIE CHART 3 -
    //----------------
    // get bar chart context
    var pieChart3Canvas = $("#pieChart3");

    new Chart(pieChart3Canvas, {
        type: 'pie',
        data: data3,
        options: pieChartOptions
    });
});