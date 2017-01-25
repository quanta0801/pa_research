$(function () {
    /* ChartJS
     * -------
     * Here we will create a few charts using ChartJS
     */

    //--------------
    //- AREA CHART -
    //--------------

    // Get context with jQuery - using jQuery's .get() method.
    var areaChartCanvas = $("#areaChart");
    // This will get the first returned node in the jQuery collection.
    // var areaChart = new Chart(areaChartCanvas);

    // var ctx = $("#areaChart");
    // var myChart = new Chart(ctx, {
    //     type: 'horizontalBar',
    //     data: {
    //         labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //         datasets: [{
    //             label: '# of Votes',
    //             data: [12, 19, 3, 5, 2, 3],
    //             backgroundColor: [
    //                 'rgba(255, 99, 132, 0.2)',
    //                 'rgba(54, 162, 235, 0.2)',
    //                 'rgba(255, 206, 86, 0.2)',
    //                 'rgba(75, 192, 192, 0.2)',
    //                 'rgba(153, 102, 255, 0.2)',
    //                 'rgba(255, 159, 64, 0.2)'
    //             ],
    //             borderColor: [
    //                 'rgba(255,99,132,1)',
    //                 'rgba(54, 162, 235, 1)',
    //                 'rgba(255, 206, 86, 1)',
    //                 'rgba(75, 192, 192, 1)',
    //                 'rgba(153, 102, 255, 1)',
    //                 'rgba(255, 159, 64, 1)'
    //             ],
    //             borderWidth: 1
    //         }]
    //     },
    //     options: {
    //         scales: {
    //             yAxes: [{
    //                 ticks: {
    //                     beginAtZero:true
    //                 }
    //             }]
    //         }
    //     }
    // });

    var areaChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Electronics",
                backgroundColor: "rgba(210, 214, 222, 0.2)",
                borderColor: "rgba(210, 214, 222, 1)",
                pointBackgroundColor: "rgba(210, 214, 222, 1)",
                pointBorderColor: "#c1c7d1",
                pointHoverBackgroundColor: "rgba(210, 214, 222, 1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: "Digital Goods",
                backgroundColor: "rgba(60,141,188,0.2)",
                borderColor: "rgba(60,141,188, 1)",
                pointBackgroundColor: "#3b8bba",
                pointBorderColor: "rgba(60,141,188,1)",
                pointHoverBackgroundColor: "rgba(60,141,188,1)",
                pointHoverBorderColor: "rgba(60,141,188,1)",
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    // var areaChartOptions = {
    //     //Boolean - If we should show the scale at all
    //     showScale: true,
    //     //Boolean - Whether grid lines are shown across the chart
    //     scaleShowGridLines: false,
    //     //String - Colour of the grid lines
    //     scaleGridLineColor: "rgba(0,0,0,.05)",
    //     //Number - Width of the grid lines
    //     scaleGridLineWidth: 1,
    //     //Boolean - Whether to show horizontal lines (except X axis)
    //     scaleShowHorizontalLines: true,
    //     //Boolean - Whether to show vertical lines (except Y axis)
    //     scaleShowVerticalLines: true,
    //     //Boolean - Whether the line is curved between points
    //     bezierCurve: true,
    //     //Number - Tension of the bezier curve between points
    //     bezierCurveTension: 0.3,
    //     //Boolean - Whether to show a dot for each point
    //     pointDot: false,
    //     //Number - Radius of each point dot in pixels
    //     pointDotRadius: 4,
    //     //Number - Pixel width of point dot stroke
    //     pointDotStrokeWidth: 1,
    //     //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    //     pointHitDetectionRadius: 20,
    //     //Boolean - Whether to show a stroke for datasets
    //     datasetStroke: true,
    //     //Number - Pixel width of dataset stroke
    //     datasetStrokeWidth: 2,
    //     //Boolean - Whether to fill the dataset with a color
    //     datasetFill: true,
    //     //String - A legend template
    //     legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    //     //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    //     maintainAspectRatio: true,
    //     //Boolean - whether to make the chart responsive to window resizing
    //     responsive: true
    // };

    //Create the line chart
    new Chart(areaChartCanvas, {
        type: 'line',
        data: areaChartData,
        options: {
            tooltips: {
                intersect: false,
                mode: "x"
            },
            hover: {
                intersect: false,
                mode: "x"
            },
            elements: {
                line: {
                    tension: 0.2,
                    fill: false
                }
            }
        }
    });

/*
    //-------------
    //- LINE CHART -
    //--------------
    var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
    var lineChart = new Chart(lineChartCanvas);
    var lineChartOptions = areaChartOptions;
    lineChartOptions.datasetFill = false;
    lineChart.Line(areaChartData, lineChartOptions);

    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
    var pieChart = new Chart(pieChartCanvas);
    var PieData = [
        {
            value: 700,
            color: "#f56954",
            highlight: "#f56954",
            label: "Chrome"
        },
        {
            value: 500,
            color: "#00a65a",
            highlight: "#00a65a",
            label: "IE"
        },
        {
            value: 400,
            color: "#f39c12",
            highlight: "#f39c12",
            label: "FireFox"
        },
        {
            value: 600,
            color: "#00c0ef",
            highlight: "#00c0ef",
            label: "Safari"
        },
        {
            value: 300,
            color: "#3c8dbc",
            highlight: "#3c8dbc",
            label: "Opera"
        },
        {
            value: 100,
            color: "#d2d6de",
            highlight: "#d2d6de",
            label: "Navigator"
        }
    ];
    var pieOptions = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    pieChart.Doughnut(PieData, pieOptions);

    //-------------
    //- BAR CHART -
    //-------------
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    var barChart = new Chart(barChartCanvas);
    var barChartData = areaChartData;
    barChartData.datasets[1].fillColor = "#00a65a";
    barChartData.datasets[1].strokeColor = "#00a65a";
    barChartData.datasets[1].pointColor = "#00a65a";
    var barChartOptions = {
        //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: true,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - If there is a stroke on each bar
        barShowStroke: true,
        //Number - Pixel width of the bar stroke
        barStrokeWidth: 2,
        //Number - Spacing between each of the X value sets
        barValueSpacing: 5,
        //Number - Spacing between data sets within X values
        barDatasetSpacing: 1,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        //Boolean - whether to make the chart responsive
        responsive: true,
        maintainAspectRatio: true
    };

    barChartOptions.datasetFill = false;
    barChart.Bar(barChartData, barChartOptions);
*/
});