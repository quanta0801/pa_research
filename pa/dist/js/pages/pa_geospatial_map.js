/**********************************
 * MAPBOX EXTRAS *
 **********************************/

// Create a popup, but don't add it to the map yet.
let popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

/**********************************
 * GLOBAL VARIABLES *
 **********************************/

// FOR THE GRID
let isHexGridLoaded = false;
let layer_hexgrid = "layer_hexgrid";
let source_hexgrid = "source_hexgrid";
let data_hexgrid = null;
let map_hexgrid = {};
let isGridRegionLoaded = false;

// FOR THE POI
let isPoiDataLoaded = false;
let layer_poi = "layer_poi";
let source_poi = "source_poi";
let data_poi = null;
let map_poi = {};

let data_poi_segment = null;
let data_poi_segment_weekend = null;

// FOR THE LIFESPHERE
let source_lifesphere = "source_lifesphere";
let layer_lifesphere_buffers = "layer_lifesphere_buffers";
let layer_lifesphere_point = "layer_lifesphere_point";


// FOR THE CC
let isCCPoiDataLoaded = false;
let layer_cc_poi = "layer_cc_poi";
let source_cc_poi = "source_cc_poi";
let data_cc_poi = null;
let map_cc_poi = {};

// FOR THE CC ATTRACTION
let layer_cc_attraction = "layer_cc_attraction";
let source_cc_attraction = "source_cc_attraction";


const MOUSECLICK_HEXGRID = 1;
const MOUSECLICK_POI_SEGMENT = 2;
const MOUSECLICK_LIFESPHERE = 3;
const MOUSECLICK_LIFESPHERE_TEST = 4;
const MOUSECLICK_CC_ATTRACTION_HOME = 5;
const MOUSECLICK_CC_ATTRACTION_WORK = 6;
let mouseclick_mode = MOUSECLICK_CC_ATTRACTION_HOME;



function roundNumber(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0)
        return Math.round(value);

    value = +value;
    exp = +exp;

    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;

    // Shift
    value = value.toString().split('e');
    value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
}

/**********************************
 * MAP START AND CONTROLS*
 **********************************/

function padZero(n) {
    return n < 10 ? '0' + n : n
}

map.on('load', function () {
    renderGrid();
    renderPOI();
    renderCCPOI();
    preloadGridRegion();
});
let cacheGridRegion = null;

function preloadGridRegion() {
    $.getJSON("json/grid_region", function (result) {
        cacheGridRegion = result["data"];
        isGridRegionLoaded = true;
        console.log("preloadGridRegion OK");
    }).fail(function () {
        console.log("preloadGridRegion error");
    });
}



let lastClickedGrid = 0;
let lastClickedPOI = 0;
let lastClickedCCPOI = 0;

map.on('click', function (e) {
    // console.log(e.lngLat, e.lngLat.lat);
    if (isHexGridLoaded && mouseclick_mode == MOUSECLICK_HEXGRID) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_hexgrid]});
        if (!features.length) {
            lastClickedGrid = null;
            clearInfoGraphic();
            return;
        }

        if (features[0].properties["freq"] == 0) {
            popup.remove();
            lastClickedGrid = null;
            clearInfoGraphic();
            return;
        }

        var feature = features[0];
        var centroid = JSON.parse(feature.properties.cent);
        var ll = new mapboxgl.LngLat(centroid[0], centroid[1]);

        lastClickedGrid = feature.properties.gid;
        console.log("Clicked:" ,lastClickedGrid);
        if (isGridRegionLoaded) {
            var planning_area = cacheGridRegion[feature.properties.gid]["planning_area"];
            var region = cacheGridRegion[feature.properties.gid]["region"];

            popup = new mapboxgl.Popup({closeButton: false})
                .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                .setHTML(feature.properties.gid)
                .setHTML("<strong>" + feature.properties.gid + "</strong><p>" + planning_area + " | " + region + "</p>")
                .addTo(map);
        } else {
            popup = new mapboxgl.Popup({closeButton: false})
                .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                .setHTML(feature.properties.gid)
                .addTo(map);
        }


        showLOCHourlyChart();

    } else if (isPoiDataLoaded && mouseclick_mode == MOUSECLICK_POI_SEGMENT) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_poi]});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) {
            popup.remove();
            lastClickedPOI = null;
            clearInfoGraphic();
            return;
        }

        if (features[0].properties["o"] == 0) {
            popup.remove();
            lastClickedPOI = null;
            clearInfoGraphic();
            return;
        }

        let feature = features[0];
        let avg_frequency = 0;
        let avg_dwell_time = 0;

        if (data_poi_segment[feature.properties["n"]] != undefined) {
            avg_frequency = data_poi_segment[feature.properties["n"]]["avg_frequency"];
            avg_dwell_time = data_poi_segment[feature.properties["n"]]["avg_dwell_time"];
        }

        lastClickedPOI = feature;

        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<strong>" + feature.properties["n"] + "</strong>" +
                "<p>" + "Frequency: " + roundNumber(avg_frequency, 2) + "</p>"+
                "<p>" + "Dwell Time: " + roundNumber(avg_dwell_time, 2) + "</p>")
            .addTo(map);

        refreshDwellTimeChart();

    } else if (isHexGridLoaded && isPoiDataLoaded && mouseclick_mode == MOUSECLICK_LIFESPHERE) {
        renderPreviouslyInferredResidenceGrids();

        let features = map.queryRenderedFeatures(e.point, {layers: [layer_hexgrid]});
        if (!features.length) {
            return;
        }
        var feature = features[0];
        if (feature.properties["freq"] == -1) {
            var centroid = JSON.parse(feature.properties.cent);

            lastClickedGrid = feature.properties.gid;
            console.log("lastClickedGrid = ", lastClickedGrid);
            renderGridOneHop();
            renderLifeSphere(centroid[0], centroid[1]);
        } else {
            // clearLifeSphere();
            // showPOI();
            refreshMapForLifeSphere();
        }


    } else if (isPoiDataLoaded && mouseclick_mode == MOUSECLICK_LIFESPHERE_TEST) {
        let latLong = JSON.stringify(e.lngLat);
        addLifeSphere(e.lngLat.lng, e.lngLat.lat);

    } else if (isHexGridLoaded && isCCPoiDataLoaded
        && (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_HOME || mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK)) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_cc_poi]});
        if (!features.length) {
            // clearGrid();
            // showCCPOI();
            if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_HOME) {
                refreshMapForCCAttractionHome();
            } else {
                refreshMapForCCAttractionWork();
            }

            return;
        }
        let feature = features[0];
        highlightCCPOI(feature.properties["n"], false);
        lastClickedCCPOI = feature;

        lastClickedGrid = feature.properties.gid;
        console.log("lastClickedGrid = ", lastClickedGrid);
        renderGridTwoHop();
        // renderGridOneHop();

        showCCAttraction();

        highlightCCPOI(lastClickedCCPOI.properties["n"], true);
    }

});

map.on('mousemove', function (e) {
    if (isHexGridLoaded && mouseclick_mode == MOUSECLICK_HEXGRID) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_hexgrid]});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (lastClickedGrid) {
            return;
        }
        popup.remove();


        if (!features.length) {
            return;
        }

        var feature = features[0];
        if (features[0].properties["freq"] == 0) {
            return;
        }

        var centroid = JSON.parse(feature.properties.cent);
        var ll = new mapboxgl.LngLat(centroid[0], centroid[1]);

        if (isGridRegionLoaded) {
            var planning_area = cacheGridRegion[feature.properties.gid]["planning_area"];
            var region = cacheGridRegion[feature.properties.gid]["region"];

            popup = new mapboxgl.Popup({closeButton: false})
                .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                .setHTML(feature.properties.gid)
                .setHTML("<strong>" + feature.properties.gid + "</strong><p>" + planning_area + " | " + region + "</p>")
                .addTo(map);
        }

    } else if (isPoiDataLoaded && mouseclick_mode == MOUSECLICK_LIFESPHERE) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_poi]});
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) {
            popup.remove();
            return;
        }

        if (features[0].properties["o"] == 0) {
            popup.remove();
            return;
        }

        let feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<strong>" + feature.properties["c"] + "</strong><p>" + feature.properties["n"] + "</p>")
            .addTo(map);
    } else if (isCCPoiDataLoaded && (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_HOME || mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK)) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_cc_poi]});
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (!features.length) {
            popup.remove();
            return;
        }

        if (features[0].properties["o"] == 0) {
            popup.remove();
            return;
        }

        let feature = features[0];

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<strong>" + feature.properties["n"] + "</strong><p>" + feature.properties["a"] + "</p>")
            .addTo(map);
    } else if (isPoiDataLoaded && mouseclick_mode == MOUSECLICK_POI_SEGMENT) {
        let features = map.queryRenderedFeatures(e.point, {layers: [layer_poi]});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

        if (lastClickedPOI) {
            return;
        }

        if (!features.length) {
            popup.remove();
            return;
        }

        if (features[0].properties["o"] == 0) {
            popup.remove();
            return;
        }

        let feature = features[0];
        let avg_frequency = 0;
        let avg_dwell_time = 0;

        if (data_poi_segment[feature.properties["n"]] != undefined) {
            avg_frequency = data_poi_segment[feature.properties["n"]]["avg_frequency"];
            avg_dwell_time = data_poi_segment[feature.properties["n"]]["avg_dwell_time"];
        }

        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<strong>" + feature.properties["n"] + "</strong>" +
                "<p>" + "Frequency: " + roundNumber(avg_frequency, 2) + "</p>"+
                "<p>" + "Dwell Time: " + roundNumber(avg_dwell_time, 2) + "</p>")
            .addTo(map);

    }

});


/**************************************
 * USE CASE 1: GRID FREQ / DWELL TIME *
 **************************************/

function clearGrid() {
    if (isHexGridLoaded) {
        for (let i = 0; i < data_hexgrid.features.length; i++) {
            data_hexgrid.features[i]["properties"]["freq"] = 0;
        }
        map.getSource(source_hexgrid).setData(data_hexgrid);
    }
}



function getLOCDaily() {
    if (isHexGridLoaded) {
        $.getJSON("db/locdaily", function (result) {
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            for (let i = 0; i < result.length; i++) {
                let some_row = result[i];
                // Get GridID as key
                let key = some_row["grid_id"];
                // let key = some_row["infer_residence_grid"];
                if (!key) {
                    continue;
                }
                // key = some_row["infer_workplace_grid"];
                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                data_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["crowd"];
            }

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_hexgrid);
            console.log("getLOCDaily OK");
        }).fail(function () {
            console.log("getLOCDaily error");
        });
    }
}


function showLOCHourlyChart() {
    if (isHexGridLoaded) {
        $.getJSON("db/lochourly?grid_wanted=" + lastClickedGrid, function (result) {
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            console.log(result);
            var time_map = {};
            for (let i = 0; i < result.length; i++) {
                let some_row = result[i];
                time_map[some_row["hour"]] = some_row["crowd"];
            }


            var min_ylimit = 0;
            var time_dataset = [];
            var time_labels = [], i, j;
            for(i=0; i<24; i++) {
                var time_key = padZero(i) + ":" + "00" + ":00";
                var time_key_pretty = '';
                if (i < 12) {
                    time_key_pretty = i + " am";
                } else {
                    time_key_pretty = (i - 12) + " pm";
                }

                if (i == 0) {
                    time_key_pretty = "12" + " am";
                } else if (i == 12) {
                    time_key_pretty = i + " pm";
                }

                time_labels.push(time_key_pretty);
                var crowd_value = 0;
                if (time_key in time_map) {
                    crowd_value = time_map[time_key];
                }

                if (parseInt(crowd_value) > min_ylimit) {
                    min_ylimit = parseInt(crowd_value);
                }
                // console.log(crowd_value, min_ylimit);

                time_dataset.push(crowd_value);

                console.log(time_key_pretty, crowd_value)
            }

            // Update the map layer source
            // map.getSource(source_hexgrid).setData(data_hexgrid);
            for (var j = 0; j < 6; j++){
                time_labels.push(time_labels.shift());
                time_dataset.push(time_dataset.shift());
            }

            refreshCrowdDensityChart(time_labels, time_dataset, min_ylimit);
            console.log("showLOCHourlyChart OK");




        }).fail(function () {
            console.log("showLOCHourlyChart error");
        });
    }
}






var ctxCrowdDensity = document.getElementById("myChartCrowdDensity");
var myLineChart = null;
Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;

function refreshCrowdDensityChart(labels_one, dataset_one, min_ylimit) {
    $("#map-infograph-container").show();
    $("#infograph-spacer-crowd-density").show();


    $("#map-infograph-title").html("Grid " + lastClickedGrid);
    var planning_area = cacheGridRegion[lastClickedGrid]["planning_area"];
    var region = cacheGridRegion[lastClickedGrid]["region"];
    $("#map-infograph-subtitle").html(planning_area + " | " + region);


    // getGridRegion();

    // $("#map-chart").show();


    // Round y-Axis to nearest 10, or 100
    if (min_ylimit < 10) {
        min_ylimit = 10;
    } else if (min_ylimit < 100) {
        min_ylimit = Math.ceil(min_ylimit/10)*10;
    } else {
        min_ylimit = Math.ceil(min_ylimit/100)*100;
    }

    console.log("min_ylimit", min_ylimit);

    var data = {
        labels: labels_one,
        datasets: [
            {
                label: "Weekdays",
                fill: false,
                lineTension: 0.1,
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
                data: dataset_one,
                spanGaps: false
            }
            // },
            // {
            //     label: "Weekends",
            //     fill: false,
            //     lineTension: 0.1,
            //     backgroundColor: "rgba(132,199,42,0.4)",
            //     borderColor: "rgba(132,199,42,1)",
            //     borderCapStyle: 'butt',
            //     borderDash: [],
            //     borderDashOffset: 0.0,
            //     borderJoinStyle: 'miter',
            //     pointBorderColor: "rgba(132,199,42,1)",
            //     pointBackgroundColor: "#fff",
            //     pointBorderWidth: 1,
            //     pointHoverRadius: 5,
            //     pointHoverBackgroundColor: "rgba(132,199,42,1)",
            //     pointHoverBorderColor: "rgba(220,220,220,1)",
            //     pointHoverBorderWidth: 2,
            //     pointRadius: 1,
            //     pointHitRadius: 10,
            //     data: dataset_one,
            //     spanGaps: false
            // }
        ]
    };
    var config = {
        type: 'line',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Hourly Crowd Density',
                fontSize: 12,
                fontColor: "#EEEEEE"

            },
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    fontColor: "#EEEEEE"
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        fontColor: "#EEEEEE",
                        fontSize: 12,
                        beginAtZero: true,
                        max: min_ylimit,
                        maxTicksLimit: 5
                        // steps: 10,
                        // stepValue: 10,
                        // max: 100
                    },
                    gridLines: {
                        display: true,
                        color: "#555555"
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "#EEEEEE",
                        fontSize: 12,
                        beginAtZero: true,
                        maxTicksLimit: 6
                    },
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    };

    if (myLineChart != null)
        myLineChart.destroy();

    myLineChart = new Chart(ctxCrowdDensity, config);
}


function clearInfoGraphic() {
    $("#map-infograph-container").hide();
    $("#map-infograph-title").html("");
    $("#map-infograph-subtitle").html("");
    clearLineChart();
    clearBarChart();
}

function clearLineChart() {
    if (myLineChart != null) {
        myLineChart.destroy();
    }
    $("#infograph-spacer-crowd-density").hide();

    // $("#map-chart").hide();
}



function renderGrid() {
    $.getJSON("json/grid", function (result) {
        data_hexgrid = result;
        // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        for (let i = 0; i < result.features.length; i++) {
            let some_hex = result.features[i];
            let some_grid_id = some_hex["properties"]["gid"];
            map_hexgrid[some_grid_id] = i;
        }


        map.addSource(source_hexgrid, {
            type: 'geojson',
            data: data_hexgrid
        });

        map.addLayer({
            'id': layer_hexgrid,
            'type': 'fill',
            'source': source_hexgrid,
            'layout': {},
            'paint': {
                'fill-color': {
                    "property": "freq",
                    "stops": [
                        // "freq" is 0   -> circle color will be blue
                        [-2, '#888888'],
                        [-1, '#ffffff'],
                        [0, '#ffffff'],
                        [1, '#37FF00'],
                        [100, '#FFFB00'],
                        // "freq" is 100 -> circle color will be red
                        [1000, '#FF0000']
                    ]
                },
                'fill-outline-color': '#bbbbbb',
                'fill-opacity': {
                    "property": "freq",
                    "stops": [
                        // "freq" is 0   -> circle color will be blue
                        [-2, 0.1],
                        [-1, 0.3],
                        [0, 0.0],
                        // "freq" is 100 -> circle color will be red
                        [10, 0.3],
                        [100, 0.5],
                        [1000, 0.7],
                        [10000, 0.9]
                    ]
                },
            }
        }, layer_cc_poi);
        isHexGridLoaded = true;
//            console.log(map_hexgrid, result);
        console.log("renderGrid OK");

    }).fail(function () {
        console.log("error");
    });
}

/************************************
 * USE CASE 2A: POI *
 ************************************/

function clearPOI() {
    if (isPoiDataLoaded) {
        for (let i = 0; i < data_poi.features.length; i++) {
            data_poi.features[i]["properties"]["o"] = 0;
            data_poi.features[i]["properties"]["freq"] = 0;
        }
        map.getSource(source_poi).setData(data_poi);
    }
}


function showPOI() {
    if (isPoiDataLoaded) {
        for (let i = 0; i < data_poi.features.length; i++) {
            data_poi.features[i]["properties"]["o"] = 1;
        }
        map.getSource(source_poi).setData(data_poi);
    }
}


function renderPOI() {
    $.getJSON("json/poi", function (result) {
        data_poi = result;
        // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        for (let i = 0; i < result.features.length; i++) {
            let some_poi = result.features[i];
            let some_poi_name = some_poi["properties"]["n"];
            map_poi[some_poi_name] = i;
        }


        map.addSource(source_poi, {
            type: 'geojson',
            data: data_poi
        });

        map.addLayer({
            'id': layer_poi,
            'type': 'circle',
            'source': source_poi,
            'paint': {
                // make circles larger as the user zooms from z12 to z22
                'circle-radius': {
                    "property": "freq",
                    'stops': [
                        [0, 2],
                        [50, 20]
                    ]
                },
                // color circles by ethnicity, using data-driven styles
                'circle-color': {
                    property: 't',
                    type: 'categorical',
                    stops: [
                        ['Commercial', '#fbb03b'],
                        ['Education', '#223b53'],
                        ['Educational', '#223b53'],
                        ['Government', '#3bb2d0'],
                        ['Health', '#e55e5e'],
                        ['Recreational', '#ff7f00'],
                        ['Residential', '#ccc'],
                        ['Retail', '#4daf4a'],
                        ['Travel', '#984ea3']
                    ]
                },
                'circle-opacity': {
                    'property': 'o',
                    "stops": [
                        // "freq" is 0   -> circle color will be blue
                        [0, 0.0],
                        // "freq" is 100 -> circle color will be red
                        [1, 1.0]
                    ]
                }
            }
        });
        isPoiDataLoaded = true;
//            console.log(map_hexgrid, result);
        console.log("renderPOI OK");
    }).fail(function () {
        console.log("error");
    });
}



function showPOISegment() {
    if (isPoiDataLoaded) {
        var weekdayResults = null;
        var weekendResults = null;

        $.when(
            $.getJSON("db/poisegment?is_weekend=false", function (result) {
                weekdayResults = result
            }).fail(function () {
                console.log("showPOISegment error");
            }),

            $.getJSON("db/poisegment?is_weekend=true", function (result) {
                weekendResults = result
            }).fail(function () {
                console.log("showPOISegment error");
            })
        ).then(function () {
            data_poi_segment = {};


            for (let i = 0; i < weekdayResults.length; i++) {
                let some_row = weekdayResults[i];
                // Get GridID as key
                let key = some_row["poi_name"];
                let avg_frequency = some_row["avg_frequency"];
                let avg_dwell_time = some_row["avg_dwell_time"];

                data_poi_segment[key] = {};
                data_poi_segment[key]["avg_frequency"] = avg_frequency;
                data_poi_segment[key]["avg_dwell_time"] = avg_dwell_time;

                let poi_map_index = map_poi[key];

                if (poi_map_index == undefined){
                    console.log(key, poi_map_index);
                } else {
                    // Update the feature in the feature collection
                    data_poi.features[poi_map_index]["properties"]["freq"] = avg_frequency;
                    data_poi.features[poi_map_index]["properties"]["o"] = 1;
                }

            }
            map.getSource(source_poi).setData(data_poi);

            data_poi_segment_weekend = {};
            for (let i = 0; i < weekendResults.length; i++) {
                let some_row = weekendResults[i];
                // Get GridID as key
                let key = some_row["poi_name"];
                let avg_frequency = some_row["avg_frequency"];
                let avg_dwell_time = some_row["avg_dwell_time"];

                data_poi_segment_weekend[key] = {};
                data_poi_segment_weekend[key]["avg_frequency"] = avg_frequency;
                data_poi_segment_weekend[key]["avg_dwell_time"] = avg_dwell_time;

                // let poi_map_index = map_poi[key];
                //
                // if (poi_map_index == undefined){
                //     console.log(key, poi_map_index);
                // } else {
                //     // Update the feature in the feature collection
                //     data_poi.features[poi_map_index]["properties"]["freq"] = avg_frequency;
                //     data_poi.features[poi_map_index]["properties"]["o"] = 1;
                // }

            }

            console.log("showPOISegment OK", weekdayResults.length, weekendResults.length);
        });


        // $.getJSON("db/poisegment", function (result) {
        //     // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        //     data_poi_segment = {};
        //     for (let i = 0; i < result.length; i++) {
        //         let some_row = result[i];
        //         // Get GridID as key
        //         let key = some_row["poi_name"];
        //         let avg_frequency = some_row["avg_frequency"];
        //         let avg_dwell_time = some_row["avg_dwell_time"];
        //
        //         data_poi_segment[key] = {};
        //         data_poi_segment[key]["avg_frequency"] = avg_frequency;
        //         data_poi_segment[key]["avg_dwell_time"] = avg_dwell_time;
        //
        //         let poi_map_index = map_poi[key];
        //
        //         if (poi_map_index == undefined){
        //             console.log(key, poi_map_index);
        //         } else {
        //             // Update the feature in the feature collection
        //             data_poi.features[poi_map_index]["properties"]["freq"] = avg_frequency;
        //             data_poi.features[poi_map_index]["properties"]["o"] = 1;
        //         }
        //
        //     }
        //     map.getSource(source_poi).setData(data_poi);
        //
        //     console.log("showPOISegment OK", result.length);
        //
        // }).fail(function () {
        //     console.log("showPOISegment error");
        // });
    }
}




var myBarChartDwelling = null;
var ctxDwelling = document.getElementById("myBarChartDwelling");
var myBarChartFrequency = null;
var ctxFrequency = document.getElementById("myBarChartFrequency");


function refreshDwellTimeChart() {
    $("#map-infograph-container").show();
    $("#infograph-spacer-bar-dwelling").show();
    $("#infograph-spacer-bar-frequency").show();

    $("#map-infograph-title").html("<strong> POI Analysis </strong>");
    var poi_key = lastClickedPOI.properties["n"];

    var avg_frequency = 0;
    var avg_dwell_time = 0;
    if (data_poi_segment[poi_key]) {
        avg_frequency = roundNumber(data_poi_segment[poi_key]["avg_frequency"], 2);
        avg_dwell_time = roundNumber(parseFloat(data_poi_segment[poi_key]["avg_dwell_time"]) / 60, 2);
    }
    console.log(avg_frequency_weekend, avg_frequency);

    var avg_frequency_weekend = 0;
    var avg_dwell_time_weekend = 0;
    if (data_poi_segment_weekend[poi_key]) {
        avg_frequency_weekend = roundNumber(data_poi_segment_weekend[poi_key]["avg_frequency"], 2);
        avg_dwell_time_weekend = roundNumber(parseFloat(data_poi_segment_weekend[poi_key]["avg_dwell_time"]) / 60, 2);
    }

    $("#map-infograph-subtitle").html(lastClickedPOI.properties["n"]);


    var dwellingWeekday = [avg_dwell_time, avg_dwell_time_weekend];

    var data = {
        labels: ["Weekday", "Weekend"],
        datasets: [
            {
                label: "Dwell Time",
                backgroundColor: [
                    'rgba(0, 0, 0, 0.0)',
                    'rgba(0, 0, 0, 0.0)'
                ],
                borderColor: [
                    'rgba(75,192,192,1)',
                    'rgba(132,199,42,1)'
                ],
                borderWidth: 2,
                data: dwellingWeekday
            }
        ]
    };

    var config = {
        type: 'bar',
        data: data,
        options: {
            title: {
                display: true,
                text: 'Avg. Dwell Time (min)',
                fontSize: 12,
                fontColor: "#EEEEEE"
            },
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    fontColor: "#EEEEEE"
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        fontColor: "#EEEEEE",
                        fontSize: 12,
                        beginAtZero: true,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        display: true,
                        color: "#555555"
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "#EEEEEE",
                        fontSize: 12,
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    };

    if (myBarChartDwelling != null)
        myBarChartDwelling.destroy();

    myBarChartDwelling = new Chart(ctxDwelling, config);


    var frequencyWeekday = [avg_frequency, avg_frequency_weekend];

    var data2 = {
        labels: ["Weekday", "Weekend"],
        datasets: [
            {
                label: "Frequency",
                backgroundColor: [
                    'rgba(0, 0, 0, 0.0)',
                    'rgba(0, 0, 0, 0.0)'
                ],
                borderColor: [
                    'rgba(75,192,192,1)',
                    'rgba(132,199,42,1)'
                ],
                borderWidth: 2,
                data: frequencyWeekday
            }
        ]
    };

    var config2 = {
        type: 'bar',
        data: data2,
        options: {
            title: {
                display: true,
                text: 'Avg. Frequency',
                fontSize: 12,
                fontColor: "#EEEEEE"
            },
            legend: {
                display: false,
                position: "bottom",
                labels: {
                    fontColor: "#EEEEEE"
                }
            },
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        fontColor: "#EEEEEE",
                        fontSize: 12,
                        beginAtZero: true,
                        maxTicksLimit: 5
                    },
                    gridLines: {
                        display: true,
                        color: "#555555"
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "#EEEEEE",
                        fontSize: 12,
                        beginAtZero: true
                    },
                    gridLines: {
                        display: false
                    }
                }]
            }
        }
    };

    if (myBarChartFrequency != null)
        myBarChartFrequency.destroy();

    myBarChartFrequency = new Chart(ctxFrequency, config2);
}

function clearBarChart() {
    if (myBarChartDwelling != null) {
        myBarChartDwelling.destroy();
    }

    if (myBarChartFrequency != null) {
        myBarChartFrequency.destroy();
    }
    $("#infograph-spacer-bar-dwelling").hide();
    $("#infograph-spacer-bar-frequency").hide();
    // $("#map-chart").hide();
}


/************************************
 * USE CASE 2B: LIFESPHERE *
 ************************************/

function clearLifeSphere() {
    if (map.getLayer(layer_lifesphere_point) != undefined) {
        map.removeLayer(layer_lifesphere_point);
        map.removeLayer(layer_lifesphere_buffers);
    }
}


function renderLifeSphere(long, lat) {
    console.log(long, lat);
    if (isPoiDataLoaded) {
        var lifeSphereResult = null;
        var visitedPOIResult = null;

        $.when(
            $.getJSON("db/lifesphere?grid_wanted=" + lastClickedGrid, function (result) {
                lifeSphereResult = result
            }).fail(function () {
                console.log("error");
            }),

            $.getJSON("db/visitedpoi?grid_wanted=" + lastClickedGrid, function (result) {
                visitedPOIResult = result
            }).fail(function () {
                console.log("error");
            })
        ).then(function () {
            let pt = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [long, lat]
                }
            };
            let unit = 'kilometers';

            let list_of_buffers = [];
            console.log(lifeSphereResult);
            for (let i = 0; i < lifeSphereResult.length; i++) {
                let some_row = lifeSphereResult[i];
                if (parseInt(some_row["quartile"]) <= 3) {
                    let buffer_distance = some_row["buffer_distance"];
                    list_of_buffers.push(turf.buffer(pt, buffer_distance, unit));
                }
            }
            list_of_buffers.push(pt);

            let buff_data = turf.featureCollection(list_of_buffers);

            if (map.getSource(source_lifesphere) == undefined) {
                map.addSource(source_lifesphere, {
                    "type": "geojson",
                    "data": buff_data
                });
            } else {
                map.getSource(source_lifesphere).setData(buff_data);
            }


            if (map.getLayer(layer_lifesphere_point) == undefined) {
                map.addLayer({
                    "id": layer_lifesphere_buffers,
                    "type": "fill",
                    "source": source_lifesphere,
                    "paint": {
                        "fill-color": "rgba(237, 145, 145, 0.15)", // rgba(237, 145, 145, 0.15) // #ed9191
                        "fill-outline-color": "#e55e5e"
                    },
                    "filter": ["==", "$type", "Polygon"]
                });
                map.addLayer({
                    "id": layer_lifesphere_point,
                    "type": "circle",
                    "source": source_lifesphere,
                    "paint": {
                        "circle-radius": 6,
                        "circle-color": "#B42222"
                    },
                    "filter": ["==", "$type", "Point"],
                });
            }

            // MAP Visited POIS
            let visitedPOIMap = {};
            for (let i = 0; i < visitedPOIResult.length; i++) {
                visitedPOIMap[visitedPOIResult[i]["poi_name"]] = true;
                // console.log(visitedPOIResult[i]["poi_name"]);
            }
            // console.log(visitedPOIMap);

            // CHECK ALL POIS If they fall inside the buffer area
            for (let i = 0; i < data_poi.features.length; i++) {
                // Get second last buffer == 75 percentile
                let isInside = turf.inside(data_poi.features[i], list_of_buffers[list_of_buffers.length - 2]); // returns true

                let poiID = data_poi.features[i]["properties"]["n"];
                let isVisited = poiID in visitedPOIMap;

                // console.log(poiID, isVisited);
                if (isInside && isVisited) {
                    data_poi.features[i]["properties"]["o"] = 1;
                } else {
                    data_poi.features[i]["properties"]["o"] = 0;
                }
            }
            map.getSource(source_poi).setData(data_poi);

            console.log("renderLifeSphere OK");
        });

    }
}

function addLifeSphere(long, lat) {
    console.log(long, lat);
    if (isPoiDataLoaded) {
        let pt = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [long, lat]
            }
        };
        let unit = 'kilometers';

        let buffered_one = turf.buffer(pt, 4, unit); // 4 // 7
        let buffered_two = turf.buffer(pt, 7, unit); // 7 // 12
        let buffered_three = turf.buffer(pt, 10, unit); // 10 // 15
        let buff_data = turf.featureCollection([buffered_one, buffered_two, buffered_three, pt]);

        if (map.getSource(source_lifesphere) == undefined) {
            map.addSource(source_lifesphere, {
                "type": "geojson",
                "data": buff_data
            });
        } else {
            map.getSource(source_lifesphere).setData(buff_data);
        }


        if (map.getLayer(layer_lifesphere_point) == undefined) {
            map.addLayer({
                "id": layer_lifesphere_buffers,
                "type": "fill",
                "source": source_lifesphere,
                "paint": {
                    "fill-color": "rgba(237, 145, 145, 0.15)", // rgba(237, 145, 145, 0.15) // #ed9191
                    "fill-outline-color": "#e55e5e"
                },
                "filter": ["==", "$type", "Polygon"]
            });

            map.addLayer({
                "id": layer_lifesphere_point,
                "type": "circle",
                "source": source_lifesphere,
                "paint": {
                    "circle-radius": 6,
                    "circle-color": "#B42222"
                },
                "filter": ["==", "$type", "Point"],
            });
        }


        // CHECK ALL POIS If they fall inside the buffer area
        for (let i = 0; i < data_poi.features.length; i++) {
            let isInside = turf.inside(data_poi.features[i], buffered_three); // returns true

            if (isInside) {
                data_poi.features[i]["properties"]["o"] = 1;
            } else {
                data_poi.features[i]["properties"]["o"] = 0;
            }
        }
        map.getSource(source_poi).setData(data_poi);

    }

}


var previouslyInferredResidence = [];
function renderInferredResidenceGrids() {
    if (isHexGridLoaded) {
        $.getJSON("db/microsegment", function (result) {
            previouslyInferredResidence = result;

            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            for (let i = 0; i < result.length; i++) {
                let some_row = result[i];
                // Get GridID as key
                let key = some_row["infer_residence_grid"];
                if (key != null) {
                    let grid_map_index = map_hexgrid[key];
                    // Update the feature in the feature collection
                    data_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
                }

            }

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_hexgrid);
            console.log("renderInferredResidenceGrids OK");
        }).fail(function () {
            console.log("error");
        });
    }
}

function renderPreviouslyInferredResidenceGrids() {
    if (isHexGridLoaded) {
        var result = previouslyGridOneHop;
        // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        for (let i = 0; i < result.length; i++) {
            let some_row = result[i];
            // Get GridID as key
            let key = some_row["neighbour_grid_id"];
            if (key != null) {
                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                data_hexgrid.features[grid_map_index]["properties"]["freq"] = 0;
            }
        }
        map.getSource(source_hexgrid).setData(data_hexgrid);

        result = previouslyInferredResidence;
        // console.log("previouslyInferredResidence", result);
        for (let i = 0; i < result.length; i++) {
            let some_row = result[i];
            // Get GridID as key
            let key = some_row["infer_residence_grid"];
            if (key != null) {
                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                data_hexgrid.features[grid_map_index]["properties"]["freq"] = -2;
            }
        }

        // Update the map layer source
        map.getSource(source_hexgrid).setData(data_hexgrid);
        console.log("renderPreviouslyInferredResidenceGrids OK");
    }
}

var previouslyGridOneHop = [];
function renderGridOneHop() {
    if (isHexGridLoaded && lastClickedGrid != 0) {
        $.getJSON("db/gridonehop?grid_wanted=" + lastClickedGrid, function (result) {
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            previouslyGridOneHop = result;
            // console.log(result);
            for (let i = 0; i < result.length; i++) {
                let some_row = result[i];
                // Get GridID as key
                let key = some_row["neighbour_grid_id"];
                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_HOME || mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
                    data_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;
                } else if (data_hexgrid.features[grid_map_index]["properties"]["freq"] == -1
                    || data_hexgrid.features[grid_map_index]["properties"]["freq"] == -2) {
                    data_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;
                }
            }
            // Also populate the lastClickedGrid
            let grid_map_index = map_hexgrid[lastClickedGrid];
            // Update the feature in the feature collection
            data_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_hexgrid);
            console.log("renderGridOneHop OK");
        }).fail(function () {
            console.log("error");
        });
    }
}



/*****************************
 * USE CASE 3: CC ATTRACTION *
 *****************************/


function renderCCPOI() {
    if (!isCCPoiDataLoaded) {
        $.getJSON("json/cc_poi", function (result) {
            data_cc_poi = result;
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            for (let i = 0; i < result.features.length; i++) {
                let some_cc_poi = result.features[i];
                let some_cc_poi_name = some_cc_poi["properties"]["n"];
                map_cc_poi[some_cc_poi_name] = i;
            }


            map.addSource(source_cc_poi, {
                type: 'geojson',
                data: data_cc_poi
            });

            map.addLayer({
                'id': layer_cc_poi,
                'type': 'circle',
                'source': source_cc_poi,
                'paint': {
                    // make circles larger as the user zooms from z12 to z22
                    'circle-radius': {
                        'base': 1.75,
                        'stops': [[10, 2], [19, 180]]
                    },
                    // color circles by ethnicity, using data-driven styles
                    'circle-color': {
                        "property": "freq",
                        "stops": [
                            // "freq" is 0   -> circle color will be blue
                            [-1, '#444444'],
                            [0, '#4daf4a'],
                            [1, '#FF0000']
                        ]
                    },
                    'circle-opacity': {
                        'property': 'o',
                        "stops": [
                            // "freq" is 0   -> circle color will be blue
                            [0, 0.0],
                            // "freq" is 100 -> circle color will be red
                            [1, 1.0]
                        ]
                    }
                }
            });
            isCCPoiDataLoaded = true;
//            console.log(map_hexgrid, result);
            console.log("renderCCPOI OK");
            // showCCPOI();
        }).fail(function () {
            console.log("error");
        });
    }
}

function showCCPOI() {
    if (isCCPoiDataLoaded) {
        for (let i = 0; i < data_cc_poi.features.length; i++) {
            data_cc_poi.features[i]["properties"]["freq"] = 0;
            data_cc_poi.features[i]["properties"]["o"] = 1;
        }
        map.getSource(source_cc_poi).setData(data_cc_poi);
    }
}

function highlightCCPOI(some_cc_poi_name, hideTheRest) {
    if (isCCPoiDataLoaded) {
        let key = map_cc_poi[some_cc_poi_name];


        for (let i = 0; i < data_cc_poi.features.length; i++) {
            if (hideTheRest) {
                data_cc_poi.features[i]["properties"]["freq"] = -1;
            } else {
                data_cc_poi.features[i]["properties"]["freq"] = 0;
            }
        }

        data_cc_poi.features[key]["properties"]["freq"] = 1;
        map.getSource(source_cc_poi).setData(data_cc_poi);
    }
}

function clearCCPOI() {
    if (isCCPoiDataLoaded) {
        for (let i = 0; i < data_cc_poi.features.length; i++) {
            data_cc_poi.features[i]["properties"]["o"] = 0;
        }
        map.getSource(source_cc_poi).setData(data_cc_poi);
    }
}


var previouslyGridTwoHop = [];
function renderGridTwoHop() {
    if (isHexGridLoaded && lastClickedGrid != 0) {
        clearGrid();
        $.getJSON("db/gridtwohop?grid_wanted=" + lastClickedGrid, function (result) {
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            previouslyGridTwoHop = result;
            // console.log(result);
            let counter = 0;
            for (let i = 0; i < result.length; i++) {
                let some_row = result[i];
                // Get GridID as key
                let key = some_row["neighbour_grid_id"];
                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_HOME || mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
                    data_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
                    counter += 1;
                } else if (data_hexgrid.features[grid_map_index]["properties"]["freq"] == -1) {
                    data_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
                }

            }

            // Also populate the lastClickedGrid
            let grid_map_index = map_hexgrid[lastClickedGrid];
            // Update the feature in the feature collection
            data_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_hexgrid);
            console.log("renderGridTwoHop OK");
        }).fail(function () {
            console.log("error");
        });
    }
}

function showCCAttraction() {
    if (isHexGridLoaded && isCCPoiDataLoaded) {
        let jsonUrl = "db/ccattraction?grid_wanted=" + lastClickedGrid;
        if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
            jsonUrl = "db/ccattraction?is_from_work=true&grid_wanted=" + lastClickedGrid
        }


        $.getJSON(jsonUrl, function (result) {
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            console.log(result);
            for (let i = 0; i < result.length; i++) {
                let some_row = result[i];
                // Get GridID as key
                // let key = some_row["infer_workplace_grid"];
                let key = some_row["infer_residence_grid"];
                if (!key) {
                    key = some_row["infer_workplace_grid"];
                }

                console.log(key);

                if (key) {
                    let grid_map_index = map_hexgrid[key];
                    // Update the feature in the feature collection
                    data_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count"];
                }
            }

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_hexgrid);

            console.log("showCCAttraction OK");
        }).fail(function () {
            console.log("error");
        });

    }
}

/*********************
 * KEYBOARD CONTROLS *
 *********************/
function clearEverything() {
    clearGrid();
    clearPOI();
    clearCCPOI();
    clearLifeSphere();
    clearInfoGraphic();
    if (popup) {
        popup.remove();
    }
}


function refreshMapForGridSegment() {
    clearEverything();
    getLOCDaily();
    mouseclick_mode = MOUSECLICK_HEXGRID;
}


function refreshMapForPOISegment() {
    clearEverything();
    showPOISegment();
    mouseclick_mode = MOUSECLICK_POI_SEGMENT;
}

function refreshMapForLifeSphere() {
    clearEverything();
    showPOI();
    clearLifeSphere();
    renderInferredResidenceGrids();
    mouseclick_mode = MOUSECLICK_LIFESPHERE;
}

function refreshMapForCCAttractionHome() {
    clearEverything();
    showCCPOI();
    mouseclick_mode = MOUSECLICK_CC_ATTRACTION_HOME;
}

function refreshMapForCCAttractionWork() {
    clearEverything();
    showCCPOI();
    mouseclick_mode = MOUSECLICK_CC_ATTRACTION_WORK;
}

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return; // Should do nothing if the key event was already consumed.
    }
    switch (event.key) {
        case "1":
            mouseclick_mode = MOUSECLICK_HEXGRID;
            clearEverything();
            getLOCDaily();
            break;
        case "2":
            mouseclick_mode = MOUSECLICK_HEXGRID;
            clearEverything();
            // getTrafficCrowd("1478476800.json");
            break;
        case "3":
            clearEverything();
            showPOI();
            mouseclick_mode = MOUSECLICK_LIFESPHERE_TEST;
            break;
        case "4":
            clearGrid();
            clearLifeSphere();
            renderInferredResidenceGrids();
            mouseclick_mode = MOUSECLICK_LIFESPHERE;
            break;
        case "5":
            clearEverything();
            showCCPOI();
            mouseclick_mode = MOUSECLICK_CC_ATTRACTION_HOME;
            break;
        case "6":
            showCCAttraction();
            highlightCCPOI(lastClickedCCPOI.properties["n"], true);
            mouseclick_mode = MOUSECLICK_CC_ATTRACTION_HOME;
            break;
        case "7":
            clearEverything();
            showPOISegment();
            mouseclick_mode = MOUSECLICK_POI_SEGMENT;
            break;
        case "0":
            clearEverything();
            mouseclick_mode = MOUSECLICK_HEXGRID;
            break;
        default:
            return; // Quit when this doesn't handle the key event.
    }

    // Consume the event to avoid it being handled twice
    event.preventDefault();
}, true);






