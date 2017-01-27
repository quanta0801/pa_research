$(function () {
    /* ChartJS
     * -------
     * Here we will create a few charts using ChartJS
     */

    //------------------------
    //- GENDER BAR CHART -
    //------------------------
    // Get context with jQuery - using jQuery's .get() method.
    var genderBarChartCanvas = $("#genderBarChart");
    // This will get the first returned node in the jQuery collection.
    var genderBarChart = new Chart(genderBarChartCanvas, {
        type: 'horizontalBar',
        data: {
            labels: ["Female", "Male"],
            datasets: [{
                label: 'Percentage (%)',
                data: [50.89, 49.11],
                backgroundColor: [
                    'hsla(0, 100%, 80%, .7)',
                    'hsla(100, 100%, 80%, .7)',
                ],
                borderColor: [
                    'hsla(0, 100%, 80%, 1)',
                    'hsla(100, 100%, 80%, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                    },
                    gridLines: {
                        display: false
                    }
                }],
            }
        }
    });

    //-----------------
    //- AGE HISTOGRAM -
    //-----------------
    // Get context with jQuery - using jQuery's .get() method.
    var ageHistCanvas = $("#ageHist");
    // This will get the first returned node in the jQuery collection.
    var ageHist = new Chart(ageHistCanvas, {
        type: 'bar',
        data: {
            labels: ["19-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", ">59"],
            datasets: [{
                label: 'Percentage (%)',
                data: [6.77, 6.94, 7.45, 7.71, 8.12, 7.77, 8.07, 7.56, 6.16],
                backgroundColor: 'hsla(200, 100%, 80%, .7)',
                borderColor: 'hsla(200, 100%, 80%, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }],
                xAxes: [{
                    categoryPercentage: 1,
                    barPercentage: 1,
                    gridLines : {
                        display: false
                    }
                }]
            },
        }
    });

    //------------------------
    //- POPULATION BAR CHART -
    //------------------------
    // Get context with jQuery - using jQuery's .get() method.
    var popBarChartCanvas = $("#popBarChart");
    // This will get the first returned node in the jQuery collection.
    var popBarChart = new Chart(popBarChartCanvas, {
        type: 'horizontalBar',
        data: {
            labels: ["Chinese", "Malay", "Indian", "Others"],
            datasets: [{
                label: 'Percentage (%)',
                data: [74.2, 13.3, 9.2, 3.3],
                backgroundColor: [
                    'hsla(40, 100%, 80%, .7)',
                    'hsla(140, 100%, 80%, .7)',
                    'hsla(240, 100%, 80%, .7)',
                    'hsla(340, 100%, 80%, .7)',
                ],
                borderColor: [
                    'hsla(40, 100%, 80%, 1)',
                    'hsla(140, 100%, 80%, 1)',
                    'hsla(240, 100%, 80%, 1)',
                    'hsla(340, 100%, 80%, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    },
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    });

});