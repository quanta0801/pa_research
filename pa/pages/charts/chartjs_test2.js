$(function () {
    /* ChartJS 2.4.0
     * -------
     * Here we will create a few charts using ChartJS
     */
    Chart.defaults.doughnut.aspectRatio = 2;

    //-----------
    //- COLOURS -
    //-----------
    // var colorNames = Object.keys(window.chartColors);

    //--------------
    //- LINE CHART -
    //--------------

    // Get context with jQuery - using jQuery's .get() method.
    var lineChartCanvas = $("#lineChart");
        // .get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.

    var lineChartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Weekday",
                fill: false,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [65, 59, 80, 81, 56, 55, 40],
                spanGaps: false,
            },
            {
                label: "Weekend",
                fill: true,
                backgroundColor: "hsla(80, 100%, 70%, 0.5)",
                borderColor: "hsl(80, 100%, 70%)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "hsl(80, 100%, 70%)",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "hsl(80, 100%, 70%)",
                pointHoverBorderColor: "hsl(0, 0%, 75%)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                spanGaps: true,
                data: [35, 41, 20, null, 44, 45, 60],
            }
        ]
    };

    new Chart(lineChartCanvas, {
        type: 'line',
        data: lineChartData,
        options: {
            tooltips:{
                mode: "x",
                intersect: false
            },
            hover:{
                mode: "x",
                intersect: false
            },
            elements: {
                line: {
                    tension: 0.1,
                    fill: "bottom"
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

    //-------------
    //- RADAR CHART -
    //--------------

    var radarChartCanvas = $("#radarChart").get(0).getContext("2d");

    var radarData = {
        labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
        datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBackgroundColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(179,181,198,1)",
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: "My Second dataset",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    var myRadarChart = new Chart(radarChartCanvas, {
        type: 'radar',
        data: radarData,
        option:{
            tooltips: {
                intersect: false
            },
            hover: {
                mode: "x",
                intersect: false
            }
        }
    });



    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
    var pieChart = new Chart(pieChartCanvas);
    var pieData = {
        labels: [
            "Red",
            "Blue",
            "Yellow"
        ],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };
    var myPieChart = new Chart(pieChartCanvas,{
        type: 'doughnut',
        data: pieData,
        // options: options
    });

    //-------------
    //- BAR CHART -
    //-------------
    var barChartCanvas = $("#barChart").get(0).getContext("2d");
    var barChart = new Chart(barChartCanvas, {
        type: 'horizontalBar',
        data: {
            labels: ["col1", "col2", "col3", "col4", "col5", "col6", "col7", "col8", "col9", 'col0', 'col11', 'col12'],
            datasets: [{
                label: '# of Votes',
                data: [10,10,10,10,10,10,10,10,10,10,10,10],
                backgroundColor: [
                    'hsl(0, 100%, 80%)',
                    'hsl(100, 100%, 80%)',
                    'hsl(200, 100%, 80%)',
                    'hsl(300, 100%, 80%)',
                    'hsl(40, 100%, 80%)',
                    'hsl(140, 100%, 80%)',
                    'hsl(240, 100%, 80%)',
                    'hsl(340, 100%, 80%)',
                    'hsl(80, 100%, 80%)',
                    'hsl(180, 100%, 80%)',
                    'hsl(280, 100%, 80%)',
                    'hsl(20, 100%, 80%)'
                ],
                borderColor: [
                    'hsl(0, 100%, 80%)',
                    'hsl(100, 100%, 80%)',
                    'hsl(200, 100%, 80%)',
                    'hsl(300, 100%, 80%)',
                    'hsl(40, 100%, 80%)',
                    'hsl(140, 100%, 80%)',
                    'hsl(240, 100%, 80%)',
                    'hsl(340, 100%, 80%)',
                    'hsl(80, 100%, 80%)',
                    'hsl(180, 100%, 80%)',
                    'hsl(280, 100%, 80%)',
                    'hsl(20, 100%, 80%)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
});