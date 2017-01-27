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

    //--------------
    //-  BAR CHART -
    //--------------
    // get bar chart context
    var barChartCanvas = $("#barChart");
    new Chart(barChartCanvas, {
        type: 'horizontalBar',
        data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });

    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

    L.tileLayer(osmUrl, {
        attribution: osmAttrib,
        maxZoom: 18,
    }).addTo(mymap);

    var marker = L.marker([51.5, -0.09]).addTo(mymap);
    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);
    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(mymap);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    var popup = L.popup();
    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }
    mymap.on('click', onMapClick);
});