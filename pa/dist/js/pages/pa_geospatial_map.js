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

const WEEKMODE_WEEKDAY = 1;
const WEEKMODE_WEEKEND = 2;
let weekMode = WEEKMODE_WEEKDAY;

// FOR THE GRID
let isHexGridLoaded = false;
let layer_hexgrid = "layer_hexgrid";
let source_hexgrid = "source_hexgrid";
let data_render_hexgrid = null;
let map_hexgrid = {};
let isGridRegionLoaded = false;
// == For leaderboard
let leaderboard_grid_segment = null;
// == For infographic
let data_grid_segment = null;
let data_grid_segment_weekend = null;
// == For map
let grid_segment_weekdayResults = null;
let grid_segment_weekendResults = null;

// FOR THE POI
let isPoiDataLoaded = false;
let layer_poi = "layer_poi";
let source_poi = "source_poi";
let data_render_poi = null;
let map_poi = {};
// == For leaderboard
let leaderboard_poi_segment = null;
// == For infographic
let data_poi_segment = null;
let data_poi_segment_weekend = null;
// == For map
let poi_segment_weekdayResults = null;
let poi_segment_weekendResults = null;


// FOR THE LIFESPHERE
let source_lifesphere = "source_lifesphere";
let layer_lifesphere_buffers = "layer_lifesphere_buffers";
let layer_lifesphere_point = "layer_lifesphere_point";
// == For infographic
var lifeSphere_weekdayResult = null;
var visitedPOI_weekdayResult = null;
var lifeSphere_weekendResult = null;
var visitedPOI_weekendResult = null;
// == For map
var buff_data_weekday = null;
var buff_data_weekend = null;
var list_of_buffers_weekday = null;
var list_of_buffers_weekend = null;

// FOR THE CC
let isCCPoiDataLoaded = false;
let layer_cc_poi = "layer_cc_poi";
let source_cc_poi = "source_cc_poi";
let data_cc_poi = null;
let map_cc_poi = {};

// FOR THE CC ATTRACTION
let layer_cc_attraction = "layer_cc_attraction";
let source_cc_attraction = "source_cc_attraction";
// == For leaderboard
let leaderboard_cc_attraction = null;
// == For infographic
let data_cc_attraction = null;
let data_cc_attraction_weekend = null;
// == For map
let cc_attraction_weekdayResults = null;
let cc_attraction_weekendResults = null;

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
            if (data_grid_segment) {
                showLeaderboard("Grid Leaderboard - # of People", "");
            }
            return;
        }

        if (features[0].properties["freq"] == 0) {
            popup.remove();
            lastClickedGrid = null;
            clearInfoGraphic();
            if (data_grid_segment) {
                showLeaderboard("Grid Leaderboard - # of People", "");
            }
            return;
        }

        var feature = features[0];
        var centroid = JSON.parse(feature.properties.cent);
        var ll = new mapboxgl.LngLat(centroid[0], centroid[1]);

        lastClickedGrid = feature.properties.gid;
        console.log("Clicked:", lastClickedGrid);
        if (isGridRegionLoaded) {
            var planning_area = cacheGridRegion[feature.properties.gid]["planning_area"];
            var region = cacheGridRegion[feature.properties.gid]["region"];

            var finalGridSegment = null;
            if (weekMode == WEEKMODE_WEEKDAY) {
                finalGridSegment = data_grid_segment;
            } else if (weekMode == WEEKMODE_WEEKEND) {
                finalGridSegment = data_grid_segment_weekend;
            }

            // IF first load. No grid segment yet
            if (!finalGridSegment) {
                popup = new mapboxgl.Popup({closeButton: false})
                    .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                    .setHTML(feature.properties.gid)
                    .setHTML("<strong>" + feature.properties.gid + "</strong>" +
                        "<p>" + planning_area + " | " + region + "</p>"
                    )
                    .addTo(map);
            } else {
                var count_imsi = 0;
                if (finalGridSegment && finalGridSegment[feature.properties["gid"]] != undefined) {
                    count_imsi = finalGridSegment[feature.properties["gid"]]["count_imsi"];
                    // avg_frequency = data_poi_segment[feature.properties["n"]]["avg_frequency"];
                    // avg_dwell_time = data_poi_segment[feature.properties["n"]]["avg_dwell_time"];
                }

                popup = new mapboxgl.Popup({closeButton: false})
                    .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                    .setHTML(feature.properties.gid)
                    .setHTML("<strong>" + feature.properties.gid + "</strong>" +
                        "<p>" + planning_area + " | " + region + "</p>" +
                        "<p>" + count_imsi + " people" + "</p>"
                    )
                    .addTo(map);

            }


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
            if (data_poi_segment) {
                showLeaderboard("POI Leaderboard", "");
            }
            return;
        }

        if (features[0].properties["o"] == 0) {
            popup.remove();
            lastClickedPOI = null;
            clearInfoGraphic();
            if (data_poi_segment) {
                showLeaderboard("POI Leaderboard", "");
            }
            return;
        }

        let feature = features[0];
        let count_imsi = 0;
        // let avg_frequency = 0;
        // let avg_dwell_time = 0;

        var finalPOISegment = null;
        if (weekMode == WEEKMODE_WEEKDAY) {
            finalPOISegment = data_poi_segment;
        } else if (weekMode == WEEKMODE_WEEKEND) {
            finalPOISegment = data_poi_segment_weekend;
        }

        if (finalPOISegment && finalPOISegment[feature.properties["n"]] != undefined) {
            count_imsi = finalPOISegment[feature.properties["n"]]["count_imsi"];
            // avg_frequency = data_poi_segment[feature.properties["n"]]["avg_frequency"];
            // avg_dwell_time = data_poi_segment[feature.properties["n"]]["avg_dwell_time"];
        }

        lastClickedPOI = feature;

        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<strong>" + feature.properties["n"] + "</strong>" +
                "<p>" + count_imsi + " people" + "</p>")
            // "<p>" + "Frequency: " + roundNumber(avg_frequency, 2) + "</p>"+
            // "<p>" + "Dwell Time: " + roundNumber(avg_dwell_time, 2) + "</p>")
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
            clearInfoGraphic();
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

            var finalGridSegment = null;
            if (weekMode == WEEKMODE_WEEKDAY) {
                finalGridSegment = data_grid_segment;
            } else if (weekMode == WEEKMODE_WEEKEND) {
                finalGridSegment = data_grid_segment_weekend;
            }

            // IF first load. No grid segment yet
            if (!finalGridSegment) {
                popup = new mapboxgl.Popup({closeButton: false})
                    .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                    .setHTML(feature.properties.gid)
                    .setHTML("<strong>" + feature.properties.gid + "</strong><p>" + planning_area + " | " + region + "</p>")
                    .addTo(map);
            } else {
                var count_imsi = 0;
                if (finalGridSegment && finalGridSegment[feature.properties["gid"]] != undefined) {
                    count_imsi = finalGridSegment[feature.properties["gid"]]["count_imsi"];
                    // avg_frequency = data_poi_segment[feature.properties["n"]]["avg_frequency"];
                    // avg_dwell_time = data_poi_segment[feature.properties["n"]]["avg_dwell_time"];
                }

                popup = new mapboxgl.Popup({closeButton: false})
                    .setLngLat(ll) //.setLngLat(map.unproject(e.point))
                    .setHTML(feature.properties.gid)
                    .setHTML("<strong>" + feature.properties.gid + "</strong>" +
                        "<p>" + planning_area + " | " + region + "</p>" +
                        "<p>" + count_imsi + " people" + "</p>"
                    )
                    .addTo(map);

            }

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

        var finalPOISegment = null;
        if (weekMode == WEEKMODE_WEEKDAY) {
            finalPOISegment = data_poi_segment;
        } else if (weekMode == WEEKMODE_WEEKEND) {
            finalPOISegment = data_poi_segment_weekend;
        }

        // IF first load. No lifesphere yet.
        if (!finalPOISegment) {
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(feature.geometry.coordinates)
                .setHTML("<strong>" + feature.properties["n"] + "</strong><p>" + feature.properties["c"] + "</p>")
                .addTo(map);
        } else {
            // ELSE lifesphere exists
            let count_imsi = 0;
            if (finalPOISegment && finalPOISegment[feature.properties["n"]] != undefined) {
                count_imsi = finalPOISegment[feature.properties["n"]]["count_imsi"];
            }
            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(feature.geometry.coordinates)
                .setHTML("<strong>" + feature.properties["n"] + "</strong><p>" + count_imsi + " people" + "</p>")
                .addTo(map);
        }


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
        // let avg_frequency = 0;
        // let avg_dwell_time = 0;
        let count_imsi = 0;

        var finalPOISegment = null;
        if (weekMode == WEEKMODE_WEEKDAY) {
            finalPOISegment = data_poi_segment;
        } else if (weekMode == WEEKMODE_WEEKEND) {
            finalPOISegment = data_poi_segment_weekend;
        }

        if (finalPOISegment && finalPOISegment[feature.properties["n"]] != undefined) {
            count_imsi = finalPOISegment[feature.properties["n"]]["count_imsi"];
            // avg_frequency = data_poi_segment[feature.properties["n"]]["avg_frequency"];
            // avg_dwell_time = data_poi_segment[feature.properties["n"]]["avg_dwell_time"];
        }

        popup.setLngLat(feature.geometry.coordinates)
            .setHTML("<strong>" + feature.properties["n"] + "</strong>" +
                "<p>" + count_imsi + " people" + "</p>")
            .addTo(map);

    }

});


/**************************************
 * USE CASE 1: GRID FREQ / DWELL TIME *
 **************************************/

function clearGrid() {
    if (isHexGridLoaded) {
        for (let i = 0; i < data_render_hexgrid.features.length; i++) {
            data_render_hexgrid.features[i]["properties"]["freq"] = 0;
        }
        map.getSource(source_hexgrid).setData(data_render_hexgrid);
    }
}

function switchRenderGrid(someResults, debugMessage) {
    if (!someResults) {
        return;
    }

    clearGrid();

    for (let i = 0; i < someResults.length; i++) {
        let some_row = someResults[i];
        // Get GridID as key
        let key = some_row["grid_id"];
        if (!key) {
            continue;
        }
        let grid_map_index = map_hexgrid[key];
        // Update the feature in the feature collection
        data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count_imsi"];
    }
    map.getSource(source_hexgrid).setData(data_render_hexgrid);
    console.log("switchRenderGrid " + debugMessage + " OK");

}

function showLOCDaily() {
    if (isHexGridLoaded) {
        grid_segment_weekdayResults = null;
        grid_segment_weekendResults = null;

        var grid_segment_summary_weekdayResults = null;
        var grid_segment_summary_weekendResults = null;


        $.when(
            $.getJSON("db/locdaily?is_weekend=false", function (result) {
                grid_segment_weekdayResults = result
            }).fail(function () {
                console.log("showLOCDaily locdaily Weekday error");
            }),

            $.getJSON("db/locdaily?is_weekend=true", function (result) {
                grid_segment_weekendResults = result
            }).fail(function () {
                console.log("showLOCDaily locdaily Weekend error");
            }),

            $.getJSON("db/gridsegmentsummary?is_weekend=false", function (result) {
                grid_segment_summary_weekdayResults = result
            }).fail(function () {
                console.log("showLOCDaily gridsegmentsummary Weekday error");
            }),

            $.getJSON("db/gridsegmentsummary?is_weekend=true", function (result) {
                grid_segment_summary_weekendResults = result
            }).fail(function () {
                console.log("showLOCDaily gridsegmentsummary Weekend error");
            })
        ).then(function () {
            // console.log(grid_segment_weekdayResults, grid_segment_weekendResults);


            data_grid_segment = {};
            var counter = 0;
            for (let i = 0; i < grid_segment_weekdayResults.length; i++) {
                let some_row = grid_segment_weekdayResults[i];
                // Get GridID as key
                let key = some_row["grid_id"];
                if (!key) {
                    continue;
                }

                var count_imsi = some_row["count_imsi"];
                var planning_area = some_row["planning_area"];
                var region = some_row["region"];

                data_grid_segment[key] = {};
                data_grid_segment[key]["count_imsi"] = count_imsi;

                // if (!(key in combined_data)) {
                //     combined_data[key] = {};
                //     combined_data[key]["weekend"] = {};
                //     combined_data[key]["weekend"]["count_imsi"] = 0;
                //     combined_data[key]["planning_area"] = planning_area;
                //     combined_data[key]["region"] = region;
                // }
                // combined_data[key]["weekday"] = {};
                // combined_data[key]["weekday"]["count_imsi"] = count_imsi;


                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                if (weekMode == WEEKMODE_WEEKDAY) {
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count_imsi"];
                }

            }

            data_grid_segment_weekend = {};
            for (let i = 0; i < grid_segment_weekendResults.length; i++) {
                let some_row = grid_segment_weekendResults[i];
                // Get GridID as key
                let key = some_row["grid_id"];
                if (!key) {
                    continue;
                }

                var count_imsi = some_row["count_imsi"];
                var planning_area = some_row["planning_area"];
                var region = some_row["region"];

                data_grid_segment_weekend[key] = {};
                data_grid_segment_weekend[key]["count_imsi"] = count_imsi;

                // if (!(key in combined_data)) {
                //     combined_data[key] = {};
                //     combined_data[key]["weekday"] = {};
                //     combined_data[key]["weekday"]["count_imsi"] = 0;
                //     combined_data[key]["planning_area"] = planning_area;
                //     combined_data[key]["region"] = region;
                // }
                // combined_data[key]["weekend"] = {};
                // combined_data[key]["weekend"]["count_imsi"] = count_imsi;


                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                if (weekMode == WEEKMODE_WEEKEND) {
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count_imsi"];
                }
            }


            var combined_data = {};
            // Just for the Leaderboard. Grouped By Planning Area
            for (let i = 0; i < grid_segment_summary_weekdayResults.length; i++) {
                let some_row = grid_segment_summary_weekdayResults[i];
                // Get GridID as key
                let key = some_row["planning_area"];
                if (!key) {
                    continue;
                }

                var count_imsi = some_row["count_imsi"];
                var count_grid = some_row["count_grid"];
                var region = some_row["region"];


                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekend"] = {};
                    combined_data[key]["weekend"]["count_imsi"] = 0;
                    combined_data[key]["weekend"]["count_grid"] = 0;
                    combined_data[key]["region"] = region;
                }
                combined_data[key]["weekday"] = {};
                combined_data[key]["weekday"]["count_imsi"] = count_imsi;
                combined_data[key]["weekday"]["count_grid"] = count_grid;

            }

            data_grid_segment_weekend = {};
            for (let i = 0; i < grid_segment_summary_weekendResults.length; i++) {
                let some_row = grid_segment_summary_weekendResults[i];
                // Get GridID as key
                let key = some_row["planning_area"];
                if (!key) {
                    continue;
                }

                var count_imsi = some_row["count_imsi"];
                var count_grid = some_row["count_grid"];
                var region = some_row["region"];

                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekday"] = {};
                    combined_data[key]["weekday"]["count_imsi"] = 0;
                    combined_data[key]["weekday"]["count_grid"] = 0;
                    combined_data[key]["region"] = region;
                }
                combined_data[key]["weekend"] = {};
                combined_data[key]["weekend"]["count_imsi"] = count_imsi;
                combined_data[key]["weekend"]["count_grid"] = count_grid;


            }


            leaderboard_grid_segment = [];
            for (var key in combined_data) {
                var row_array = [];
                row_array.push(key);
                row_array.push(combined_data[key]["region"]);
                row_array.push(combined_data[key]["weekday"]["count_imsi"]);
                row_array.push(combined_data[key]["weekend"]["count_imsi"]);
                leaderboard_grid_segment.push(row_array);
            }

            clearDataTable();

            // if (dataTableForLeaderboard == null) {
            console.log("Making new leaderboard for grid");
            dataTableForLeaderboard = $('#table-leaderboard').DataTable({
                data: leaderboard_grid_segment,
                lengthChange: false,
                searching: false,
                paging: false,
                columns: [
                    {title: "Planning Area"},
                    {title: "Region"},
                    {title: "Weekday"},
                    {title: "Weekend"}
                ],
                order: [[3, 'desc']]
            });

            // } else {
            //     dataTableForLeaderboard.clear().rows.add(leaderboard_grid_segment).draw();
            // }

            showLeaderboard("Grid Leaderboard - # of People", "");


            map.getSource(source_hexgrid).setData(data_render_hexgrid);

        });

    }
}


function showLOCHourlyChart() {
    if (isHexGridLoaded) {

        var weekdayResults = null;
        var weekendResults = null;

        $.when(
            $.getJSON("db/lochourly?is_weekend=false&grid_wanted=" + lastClickedGrid, function (result) {
                weekdayResults = result
            }).fail(function () {
                console.log("showLOCHourlyChart Weekday error");
            }),

            $.getJSON("db/lochourly?is_weekend=true&grid_wanted=" + lastClickedGrid, function (result) {
                weekendResults = result
            }).fail(function () {
                console.log("showLOCHourlyChart Weekend error");
            })
        ).then(function () {
            // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
            var time_map = {};
            if (weekdayResults) {
                for (let i = 0; i < weekdayResults.length; i++) {
                    let some_row = weekdayResults[i];
                    time_map[some_row["hour"]] = some_row["count_imsi"];
                    // console.log("Weekday: ", some_row["hour"], some_row["crowd"]);
                }
            }


            var min_ylimit = 0;
            var time_dataset = [];
            var time_labels = [], i, j;
            for (i = 0; i < 24; i++) {
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

            }

            // Update the map layer source
            // map.getSource(source_hexgrid).setData(data_render_hexgrid);
            for (var j = 0; j < 6; j++) {
                time_labels.push(time_labels.shift());
                time_dataset.push(time_dataset.shift());
            }


            var time_map_weekend = {};
            if (weekendResults) {
                for (let i = 0; i < weekendResults.length; i++) {
                    let some_row = weekendResults[i];
                    time_map_weekend[some_row["hour"]] = some_row["count_imsi"];
                    // console.log("Weekend: ", some_row["hour"], some_row["crowd"]);
                }
            }


            var min_ylimit_weekend = 0;
            var time_dataset_weekend = [];
            var time_labels_weekend = [];
            for (i = 0; i < 24; i++) {
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

                time_labels_weekend.push(time_key_pretty);
                var crowd_value = 0;
                if (time_key in time_map_weekend) {
                    crowd_value = time_map_weekend[time_key];
                }

                if (parseInt(crowd_value) > min_ylimit_weekend) {
                    min_ylimit_weekend = parseInt(crowd_value);
                }

                time_dataset_weekend.push(crowd_value);

            }

            // Update the map layer source
            // map.getSource(source_hexgrid).setData(data_render_hexgrid);
            for (var j = 0; j < 6; j++) {
                time_labels_weekend.push(time_labels_weekend.shift());
                time_dataset_weekend.push(time_dataset_weekend.shift());
            }

            refreshCrowdDensityChart(time_labels, time_dataset, min_ylimit,
                time_labels_weekend, time_dataset_weekend, min_ylimit_weekend);

            console.log("showLOCHourlyChart OK");

        });


    }
}


var ctxCrowdDensity = document.getElementById("myChartCrowdDensity");
var myLineChart = null;
Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = false;

function refreshCrowdDensityChart(labels_one, dataset_one, min_ylimit, labels_two, dataset_two, min_ylimit_two) {
    $("#map-infograph-container").show();
    $("#infograph-spacer-crowd-density").show();

    $("#infograph-spacer-bar-leaderboard").hide();


    $("#map-infograph-title").html("Grid " + lastClickedGrid);
    var planning_area = cacheGridRegion[lastClickedGrid]["planning_area"];
    var region = cacheGridRegion[lastClickedGrid]["region"];
    $("#map-infograph-subtitle").html(planning_area + " | " + region);


    // getGridRegion();

    // $("#map-chart").show();


    // Round y-Axis to nearest 10, or 100

    // Determine only one Y Limit. Get the bigger of two.
    if (min_ylimit < min_ylimit_two) {
        min_ylimit = min_ylimit_two;
    }

    if (min_ylimit < 10) {
        min_ylimit = 10;
    } else if (min_ylimit < 100) {
        min_ylimit = Math.ceil(min_ylimit / 10) * 10;
    } else {
        min_ylimit = Math.ceil(min_ylimit / 100) * 100;
    }

    // console.log("min_ylimit", min_ylimit);
    // console.log("dataset_one", dataset_one);
    // console.log("dataset_one", dataset_two);

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

            },
            {
                label: "Weekends",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(132,199,42,0.4)",
                borderColor: "rgba(132,199,42,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(132,199,42,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(132,199,42,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: dataset_two,
                spanGaps: false
            }
        ]
    };
    var config = {
        type: 'line',
        data: data,
        options: {
            title: {
                display: true,
                text: '# of Repeat Visits',
                fontSize: 12,
                fontColor: "#EEEEEE"

            },
            legend: {
                display: true,
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

    console.log("refreshCrowdDensityChart OK")
}


function clearInfoGraphic() {
    $("#map-infograph-container").hide();
    $("#map-infograph-title").html("");
    $("#map-infograph-subtitle").html("");

    $("#infograph-spacer-bar-leaderboard").hide();
    $("#infograph-spacer-crowd-density").hide();
    $("#infograph-spacer-bar-frequency").hide();
    $("#infograph-spacer-bar-dwelling").hide();

    clearLineChart();
    clearBarChart();
}

function showLeaderboard(someTitle, someSubtitle) {
    $("#map-infograph-container").show();
    $("#map-infograph-title").html(someTitle);
    $("#map-infograph-subtitle").html(someSubtitle);
    $("#infograph-spacer-bar-leaderboard").show();


    $("#infograph-spacer-crowd-density").hide();
    $("#infograph-spacer-bar-frequency").hide();
    $("#infograph-spacer-bar-dwelling").hide();
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
        data_render_hexgrid = result;
        // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        for (let i = 0; i < result.features.length; i++) {
            let some_hex = result.features[i];
            let some_grid_id = some_hex["properties"]["gid"];
            map_hexgrid[some_grid_id] = i;
        }


        map.addSource(source_hexgrid, {
            type: 'geojson',
            data: data_render_hexgrid
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
        for (let i = 0; i < data_render_poi.features.length; i++) {
            data_render_poi.features[i]["properties"]["o"] = 0;
            data_render_poi.features[i]["properties"]["freq"] = 0;
        }
        map.getSource(source_poi).setData(data_render_poi);
    }
}


function showPOI() {
    if (isPoiDataLoaded) {
        for (let i = 0; i < data_render_poi.features.length; i++) {
            data_render_poi.features[i]["properties"]["o"] = 1;
        }
        map.getSource(source_poi).setData(data_render_poi);
    }
}


function renderPOI() {
    $.getJSON("json/poi", function (result) {
        data_render_poi = result;
        // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        for (let i = 0; i < result.features.length; i++) {
            let some_poi = result.features[i];
            let some_poi_name = some_poi["properties"]["n"];
            map_poi[some_poi_name] = i;
        }


        map.addSource(source_poi, {
            type: 'geojson',
            data: data_render_poi
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
                        [100, 10]
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

function switchRenderPOI(someResult, debugMessage) {
    if (!someResult) {
        return;
    }

    for (let i = 0; i < someResult.length; i++) {
        let some_row = someResult[i];
        // Get GridID as key
        let key = some_row["poi_name"];
        let count_imsi = some_row["count_imsi"];
        let avg_frequency = some_row["avg_frequency"];
        let avg_dwell_time = some_row["avg_dwell_time"];

        let poi_map_index = map_poi[key];

        if (poi_map_index == undefined) {
            console.log(key, poi_map_index);
        } else {
            // Update the feature in the feature collection
            data_render_poi.features[poi_map_index]["properties"]["freq"] = count_imsi;
            data_render_poi.features[poi_map_index]["properties"]["o"] = 1;
        }
    }
    map.getSource(source_poi).setData(data_render_poi);
    console.log("switchRenderPOI " + debugMessage + " OK");


}

var dataTableForLeaderboard = null;


function showPOISegment() {
    if (isPoiDataLoaded) {
        poi_segment_weekdayResults = null;
        poi_segment_weekendResults = null;

        $.when(
            $.getJSON("db/poisegment?is_weekend=false", function (result) {
                poi_segment_weekdayResults = result
            }).fail(function () {
                console.log("showPOISegment error");
            }),

            $.getJSON("db/poisegment?is_weekend=true", function (result) {
                poi_segment_weekendResults = result
            }).fail(function () {
                console.log("showPOISegment error");
            })
        ).then(function () {
            var combined_data = {};


            data_poi_segment = {};

            for (let i = 0; i < poi_segment_weekdayResults.length; i++) {
                let some_row = poi_segment_weekdayResults[i];
                // Get GridID as key
                let key = some_row["poi_name"];
                let count_imsi = some_row["count_imsi"];
                let avg_frequency = some_row["avg_frequency"];
                let avg_dwell_time = some_row["avg_dwell_time"];

                data_poi_segment[key] = {};
                data_poi_segment[key]["count_imsi"] = count_imsi;
                data_poi_segment[key]["avg_frequency"] = avg_frequency;
                data_poi_segment[key]["avg_dwell_time"] = avg_dwell_time;

                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekend"] = {};
                    combined_data[key]["weekend"]["count_imsi"] = 0;
                    combined_data[key]["weekend"]["avg_frequency"] = 0;
                    combined_data[key]["weekend"]["avg_dwell_time"] = 0;
                }
                combined_data[key]["weekday"] = {};
                combined_data[key]["weekday"]["count_imsi"] = count_imsi;
                combined_data[key]["weekday"]["avg_frequency"] = avg_frequency;
                combined_data[key]["weekday"]["avg_dwell_time"] = avg_dwell_time;

                let poi_map_index = map_poi[key];

                if (weekMode == WEEKMODE_WEEKDAY) {
                    if (poi_map_index == undefined) {
                        console.log(key, poi_map_index);
                    } else {
                        // Update the feature in the feature collection
                        data_render_poi.features[poi_map_index]["properties"]["freq"] = count_imsi;
                        data_render_poi.features[poi_map_index]["properties"]["o"] = 1;
                    }
                }

            }

            data_poi_segment_weekend = {};
            for (let i = 0; i < poi_segment_weekendResults.length; i++) {
                let some_row = poi_segment_weekendResults[i];
                // Get GridID as key
                let key = some_row["poi_name"];
                let count_imsi = some_row["count_imsi"];
                let avg_frequency = some_row["avg_frequency"];
                let avg_dwell_time = some_row["avg_dwell_time"];

                data_poi_segment_weekend[key] = {};
                data_poi_segment_weekend[key]["count_imsi"] = count_imsi;
                data_poi_segment_weekend[key]["avg_frequency"] = avg_frequency;
                data_poi_segment_weekend[key]["avg_dwell_time"] = avg_dwell_time;

                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekday"] = {};
                    combined_data[key]["weekday"]["count_imsi"] = 0;
                    combined_data[key]["weekday"]["avg_frequency"] = 0;
                    combined_data[key]["weekday"]["avg_dwell_time"] = 0;
                }
                combined_data[key]["weekend"] = {};
                combined_data[key]["weekend"]["count_imsi"] = count_imsi;
                combined_data[key]["weekend"]["avg_frequency"] = avg_frequency;
                combined_data[key]["weekend"]["avg_dwell_time"] = avg_dwell_time;

                let poi_map_index = map_poi[key];

                if (weekMode == WEEKMODE_WEEKEND) {
                    if (poi_map_index == undefined) {
                        console.log(key, poi_map_index);
                    } else {
                        // Update the feature in the feature collection
                        data_render_poi.features[poi_map_index]["properties"]["freq"] = count_imsi;
                        data_render_poi.features[poi_map_index]["properties"]["o"] = 1;
                    }
                }

            }

            map.getSource(source_poi).setData(data_render_poi);

            leaderboard_poi_segment = [];
            for (var key in combined_data) {
                var some_poi = combined_data[key];
                var row_array = [];
                row_array.push(key);
                row_array.push(some_poi["weekday"]["count_imsi"]);
                row_array.push(some_poi["weekend"]["count_imsi"]);
                // row_array.push(some_poi["weekday"]["avg_frequency"]);
                // row_array.push(some_poi["weekend"]["avg_frequency"]);
                // row_array.push(some_poi["weekday"]["avg_dwell_time"]);
                // row_array.push(some_poi["weekend"]["avg_dwell_time"]);
                leaderboard_poi_segment.push(row_array);
            }


            // console.log(leaderboard_poi_segment);

            // Completely destroy the HTML content and reinitialise
            clearDataTable();

            console.log("Making new leaderboard for poi segment");

            dataTableForLeaderboard = $('#table-leaderboard').DataTable({
                data: leaderboard_poi_segment,
                lengthChange: false,
                searching: false,
                paging: false,
                columns: [
                    {title: "POI"},
                    {title: "Weekday"},
                    {title: "Weekend"}
                ],
                order: [[2, 'desc']]
            });

            //dataTableForLeaderboard.clear().rows.add(leaderboard_poi_segment).draw();


            showLeaderboard("POI Leaderboard - # of People", "");

            console.log("showPOISegment OK", poi_segment_weekdayResults.length, poi_segment_weekendResults.length);
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
        //             data_render_poi.features[poi_map_index]["properties"]["freq"] = avg_frequency;
        //             data_render_poi.features[poi_map_index]["properties"]["o"] = 1;
        //         }
        //
        //     }
        //     map.getSource(source_poi).setData(data_render_poi);
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

    $("#infograph-spacer-bar-leaderboard").hide();

    $("#map-infograph-title").html("<strong> POI Analysis </strong>");
    var poi_key = lastClickedPOI.properties["n"];

    var avg_frequency = 0;
    var avg_dwell_time = 0;
    if (data_poi_segment[poi_key]) {
        avg_frequency = roundNumber(data_poi_segment[poi_key]["avg_frequency"], 2);
        avg_dwell_time = roundNumber(parseFloat(data_poi_segment[poi_key]["avg_dwell_time"]) / 60, 2);
    }

    var avg_frequency_weekend = 0;
    var avg_dwell_time_weekend = 0;
    if (data_poi_segment_weekend[poi_key]) {
        avg_frequency_weekend = roundNumber(data_poi_segment_weekend[poi_key]["avg_frequency"], 2);
        avg_dwell_time_weekend = roundNumber(parseFloat(data_poi_segment_weekend[poi_key]["avg_dwell_time"]) / 60, 2);
    }

    $("#map-infograph-subtitle").html(lastClickedPOI.properties["n"]);
    // console.log(avg_frequency_weekend, avg_frequency);


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
                text: 'Total Repeated Visits',
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


function switchRenderLifeSphere(someBuffData, someListOfBuffers, someDataPOISegment, debugMessage) {
    if (!someBuffData) {
        return;
    }

    if (map.getSource(source_lifesphere) == undefined) {
        map.addSource(source_lifesphere, {
            "type": "geojson",
            "data": someBuffData
        });
    } else {
        map.getSource(source_lifesphere).setData(someBuffData);
    }

    // CHECK ALL POIS If they fall inside the buffer area
    for (let i = 0; i < data_render_poi.features.length; i++) {
        // Get second last buffer == 75 percentile
        let isInside = false;
        let isVisited = false;
        let poiID = data_render_poi.features[i]["properties"]["n"];

        isInside = turf.inside(data_render_poi.features[i], someListOfBuffers[someListOfBuffers.length - 2]); // returns true
        isVisited = poiID in someDataPOISegment;


        // console.log(poiID, isVisited);
        if (isInside && isVisited) {
            data_render_poi.features[i]["properties"]["freq"] = someDataPOISegment[poiID]["count_imsi"];
            data_render_poi.features[i]["properties"]["o"] = 1;
        } else {
            data_render_poi.features[i]["properties"]["o"] = 0;
        }
    }
    map.getSource(source_poi).setData(data_render_poi);

    console.log("switchRenderLifeSphere " + debugMessage + " OK!");
}

function renderLifeSphere(long, lat) {
    console.log(long, lat);
    if (isPoiDataLoaded) {
        lifeSphere_weekdayResult = null;
        lifeSphere_weekendResult = null;

        visitedPOI_weekdayResult = null;
        visitedPOI_weekendResult = null;

        $.when(
            $.getJSON("db/lifesphere?is_weekend=false&grid_wanted=" + lastClickedGrid, function (result) {
                lifeSphere_weekdayResult = result
            }).fail(function () {
                console.log("lifeSphere_weekdayResult error");
            }),
            $.getJSON("db/lifesphere?is_weekend=true&grid_wanted=" + lastClickedGrid, function (result) {
                lifeSphere_weekendResult = result
            }).fail(function () {
                console.log("lifeSphere_weekendResult error");
            }),
            $.getJSON("db/visitedpoi?is_weekend=false&grid_wanted=" + lastClickedGrid, function (result) {
                visitedPOI_weekdayResult = result
            }).fail(function () {
                console.log("visitedPOI_weekdayResult error");
            }),
            $.getJSON("db/visitedpoi?is_weekend=true&grid_wanted=" + lastClickedGrid, function (result) {
                visitedPOI_weekendResult = result
            }).fail(function () {
                console.log("visitedPOI_weekendResult error");
            })
        ).then(function () {
            var combined_data = {};


            let pt = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Point",
                    "coordinates": [long, lat]
                }
            };
            let unit = 'kilometers';


            // console.log(lifeSphere_weekdayResult, lifeSphere_weekendResult);
            // Buffer on Weekday
            list_of_buffers_weekday = [];
            for (let i = 0; i < lifeSphere_weekdayResult.length; i++) {
                let some_row = lifeSphere_weekdayResult[i];
                if (parseInt(some_row["quartile"]) <= 3) {
                    let buffer_distance = some_row["buffer_distance"];
                    list_of_buffers_weekday.push(turf.buffer(pt, buffer_distance, unit));
                }
            }
            list_of_buffers_weekday.push(pt);

            buff_data_weekday = turf.featureCollection(list_of_buffers_weekday);


            // Buffer on Weekend
            list_of_buffers_weekend = [];
            for (let i = 0; i < lifeSphere_weekendResult.length; i++) {
                let some_row = lifeSphere_weekendResult[i];
                if (parseInt(some_row["quartile"]) <= 3) {
                    let buffer_distance = some_row["buffer_distance"];
                    list_of_buffers_weekend.push(turf.buffer(pt, buffer_distance, unit));
                }
            }
            list_of_buffers_weekend.push(pt);

            buff_data_weekend = turf.featureCollection(list_of_buffers_weekend);


            if (weekMode == WEEKMODE_WEEKDAY) {
                if (map.getSource(source_lifesphere) == undefined) {
                    map.addSource(source_lifesphere, {
                        "type": "geojson",
                        "data": buff_data_weekday
                    });
                } else {
                    map.getSource(source_lifesphere).setData(buff_data_weekday);
                }
            } else if (weekMode == WEEKMODE_WEEKEND) {
                if (map.getSource(source_lifesphere) == undefined) {
                    map.addSource(source_lifesphere, {
                        "type": "geojson",
                        "data": buff_data_weekend
                    });
                } else {
                    map.getSource(source_lifesphere).setData(buff_data_weekend);
                }
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
            // Weekdays
            data_poi_segment = {};
            for (let i = 0; i < visitedPOI_weekdayResult.length; i++) {
                let key = visitedPOI_weekdayResult[i]["poi_name"];
                data_poi_segment[key] = {};

                var count_imsi = visitedPOI_weekdayResult[i]["count_imsi"];
                var avg_frequency = visitedPOI_weekdayResult[i]["avg_frequency"];
                var avg_dwell_time = visitedPOI_weekdayResult[i]["avg_dwell_time"];

                data_poi_segment[key]["count_imsi"] = count_imsi;
                data_poi_segment[key]["avg_frequency"] = avg_frequency;
                data_poi_segment[key]["avg_dwell_time"] = avg_dwell_time;

                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekend"] = {};
                    combined_data[key]["weekend"]["count_imsi"] = 0;
                    combined_data[key]["weekend"]["avg_frequency"] = 0;
                    combined_data[key]["weekend"]["avg_dwell_time"] = 0;
                }
                combined_data[key]["weekday"] = {};
                combined_data[key]["weekday"]["count_imsi"] = count_imsi;
                combined_data[key]["weekday"]["avg_frequency"] = avg_frequency;
                combined_data[key]["weekday"]["avg_dwell_time"] = avg_dwell_time;

            }

            // Weekends
            data_poi_segment_weekend = {};
            for (let i = 0; i < visitedPOI_weekendResult.length; i++) {
                let key = visitedPOI_weekendResult[i]["poi_name"];
                data_poi_segment_weekend[key] = {};

                var count_imsi = visitedPOI_weekendResult[i]["count_imsi"];
                var avg_frequency = visitedPOI_weekendResult[i]["avg_frequency"];
                var avg_dwell_time = visitedPOI_weekendResult[i]["avg_dwell_time"];

                data_poi_segment_weekend[key]["count_imsi"] = visitedPOI_weekendResult[i]["count_imsi"];
                data_poi_segment_weekend[key]["avg_frequency"] = visitedPOI_weekendResult[i]["avg_frequency"];
                data_poi_segment_weekend[key]["avg_dwell_time"] = visitedPOI_weekendResult[i]["avg_dwell_time"];

                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekday"] = {};
                    combined_data[key]["weekday"]["count_imsi"] = 0;
                    combined_data[key]["weekday"]["avg_frequency"] = 0;
                    combined_data[key]["weekday"]["avg_dwell_time"] = 0;
                }
                combined_data[key]["weekend"] = {};
                combined_data[key]["weekend"]["count_imsi"] = count_imsi;
                combined_data[key]["weekend"]["avg_frequency"] = avg_frequency;
                combined_data[key]["weekend"]["avg_dwell_time"] = avg_dwell_time;
            }


            // CHECK ALL POIS If they fall inside the buffer area
            for (let i = 0; i < data_render_poi.features.length; i++) {
                // Get second last buffer == 75 percentile
                let isInside = false;
                let isVisited = false;
                let poiID = data_render_poi.features[i]["properties"]["n"];

                var final_data_poi_segment = null;
                if (weekMode == WEEKMODE_WEEKDAY) {
                    isInside = turf.inside(data_render_poi.features[i], list_of_buffers_weekday[list_of_buffers_weekday.length - 2]); // returns true
                    isVisited = poiID in data_poi_segment;
                    final_data_poi_segment = data_poi_segment;
                } else if (weekMode == WEEKMODE_WEEKEND) {
                    isInside = turf.inside(data_render_poi.features[i], list_of_buffers_weekend[list_of_buffers_weekend.length - 2]); // returns true
                    isVisited = poiID in data_poi_segment_weekend;
                    final_data_poi_segment = data_poi_segment_weekend;
                }

                // console.log(poiID, isVisited);
                if (isInside && isVisited) {
                    data_render_poi.features[i]["properties"]["freq"] = final_data_poi_segment[poiID]["count_imsi"];
                    data_render_poi.features[i]["properties"]["o"] = 1;
                } else {
                    data_render_poi.features[i]["properties"]["o"] = 0;
                }
            }
            map.getSource(source_poi).setData(data_render_poi);


            leaderboard_poi_segment = [];
            for (var key in combined_data) {
                var some_poi = combined_data[key];
                var row_array = [];
                row_array.push(key);
                row_array.push(some_poi["weekday"]["count_imsi"]);
                row_array.push(some_poi["weekend"]["count_imsi"]);
                // row_array.push(some_poi["weekday"]["avg_frequency"]);
                // row_array.push(some_poi["weekend"]["avg_frequency"]);
                // row_array.push(some_poi["weekday"]["avg_dwell_time"]);
                // row_array.push(some_poi["weekend"]["avg_dwell_time"]);
                leaderboard_poi_segment.push(row_array);
            }


            // console.log(leaderboard_poi_segment);

            // Completely destroy the HTML content and reinitialise
            clearDataTable();

            console.log("Making new leaderboard for lifesphere poi");


            dataTableForLeaderboard = $('#table-leaderboard').DataTable({
                data: leaderboard_poi_segment,
                lengthChange: false,
                searching: false,
                paging: false,
                columns: [
                    {title: "POI"},
                    {title: "Weekday"},
                    {title: "Weekend"}
                ],
                order: [[2, 'desc']]
            });

            // dataTableForLeaderboard.clear().rows.add(leaderboard_poi_segment).draw();


            showLeaderboard("POI LifeSphere Leaderboard - # of People", "");

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
        for (let i = 0; i < data_render_poi.features.length; i++) {
            let isInside = turf.inside(data_render_poi.features[i], buffered_three); // returns true

            if (isInside) {
                data_render_poi.features[i]["properties"]["o"] = 1;
            } else {
                data_render_poi.features[i]["properties"]["o"] = 0;
            }
        }
        map.getSource(source_poi).setData(data_render_poi);

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
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
                }

            }

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_render_hexgrid);
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
                data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = 0;
            }
        }
        map.getSource(source_hexgrid).setData(data_render_hexgrid);

        result = previouslyInferredResidence;
        // console.log("previouslyInferredResidence", result);
        for (let i = 0; i < result.length; i++) {
            let some_row = result[i];
            // Get GridID as key
            let key = some_row["infer_residence_grid"];
            if (key != null) {
                let grid_map_index = map_hexgrid[key];
                // Update the feature in the feature collection
                data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = -2;
            }
        }

        // Update the map layer source
        map.getSource(source_hexgrid).setData(data_render_hexgrid);
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
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;
                } else if (data_render_hexgrid.features[grid_map_index]["properties"]["freq"] == -1
                    || data_render_hexgrid.features[grid_map_index]["properties"]["freq"] == -2) {
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;
                }
            }
            // Also populate the lastClickedGrid
            let grid_map_index = map_hexgrid[lastClickedGrid];
            // Update the feature in the feature collection
            data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_render_hexgrid);
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
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
                    counter += 1;
                } else if (data_render_hexgrid.features[grid_map_index]["properties"]["freq"] == -1) {
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
                }

            }

            // Also populate the lastClickedGrid
            let grid_map_index = map_hexgrid[lastClickedGrid];
            // Update the feature in the feature collection
            data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_render_hexgrid);
            console.log("renderGridTwoHop OK");
        }).fail(function () {
            console.log("error");
        });
    }
}


function switchRenderCCAttraction(someResults, debugMessage) {
    if (!someResults) {
        return;
    }

    clearGrid();

    // Render for Grid Two Hop
    for (let i = 0; i < previouslyGridTwoHop.length; i++) {
        let some_row = previouslyGridTwoHop[i];
        // Get GridID as key
        let key = some_row["neighbour_grid_id"];
        let grid_map_index = map_hexgrid[key];
        // Update the feature in the feature collection
        if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_HOME || mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
            data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
        } else if (data_render_hexgrid.features[grid_map_index]["properties"]["freq"] == -1) {
            data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = -1;
        }
    }

    // Also populate the lastClickedGrid
    let grid_map_index = map_hexgrid[lastClickedGrid];
    // Update the feature in the feature collection
    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = 1000;

    // Update the map layer source
    // map.getSource(source_hexgrid).setData(data_render_hexgrid);

    // Render CC Attraction
    for (let i = 0; i < someResults.length; i++) {
        let some_row = someResults[i];
        // Get GridID as key
        // let key = some_row["infer_workplace_grid"];
        let key = some_row["infer_residence_grid"];
        if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
            key = some_row["infer_workplace_grid"];
        }
        if (!key) {
            continue;
        }

        let grid_map_index = map_hexgrid[key];
        // Update the feature in the feature collection
        data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count_imsi"];

    }
    map.getSource(source_hexgrid).setData(data_render_hexgrid);
    console.log("switchRenderGrid " + debugMessage + " OK");

}

function showCCAttraction() {
    if (isHexGridLoaded && isCCPoiDataLoaded) {
        let jsonUrlCCAttraction = "db/ccattraction?grid_wanted=" + lastClickedGrid;
        if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
            jsonUrlCCAttraction = "db/ccattraction?is_from_work=true&grid_wanted=" + lastClickedGrid
        }

        let jsonUrlCCAttractionSummary = "db/ccattractionsummary?grid_wanted=" + lastClickedGrid;
        if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
            jsonUrlCCAttractionSummary = "db/ccattractionsummary?is_from_work=true&grid_wanted=" + lastClickedGrid
        }


        cc_attraction_weekdayResults = null;
        cc_attraction_weekendResults = null;

        var cc_attraction_summary_weekdayResults = null;
        var cc_attraction_summary_weekendResults = null;


        $.when(
            $.getJSON(jsonUrlCCAttraction + "&is_weekend=false", function (result) {
                cc_attraction_weekdayResults = result
            }).fail(function () {
                console.log("showCCAttraction Weekday error");
            }),

            $.getJSON(jsonUrlCCAttraction + "&is_weekend=true", function (result) {
                cc_attraction_weekendResults = result
            }).fail(function () {
                console.log("showCCAttraction Weekend error");
            }),

            $.getJSON(jsonUrlCCAttractionSummary + "&is_weekend=false", function (result) {
                cc_attraction_summary_weekdayResults = result
            }).fail(function () {
                console.log("showCCAttraction summary Weekday error");
            }),

            $.getJSON(jsonUrlCCAttractionSummary + "&is_weekend=true", function (result) {
                cc_attraction_summary_weekendResults = result
            }).fail(function () {
                console.log("showCCAttraction summary Weekend error");
            })
        ).then(function () {
            for (let i = 0; i < cc_attraction_weekdayResults.length; i++) {
                let some_row = cc_attraction_weekdayResults[i];
                // Get GridID as key
                // let key = some_row["infer_workplace_grid"];
                let key = some_row["infer_residence_grid"];
                if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
                    key = some_row["infer_workplace_grid"];
                }
                if (!key) {
                    continue;
                }

                if (weekMode == WEEKMODE_WEEKDAY) {
                    let grid_map_index = map_hexgrid[key];
                    // Update the feature in the feature collection
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count_imsi"];
                }
            }

            for (let i = 0; i < cc_attraction_weekendResults.length; i++) {
                let some_row = cc_attraction_weekendResults[i];
                // Get GridID as key
                // let key = some_row["infer_workplace_grid"];
                let key = some_row["infer_residence_grid"];
                if (mouseclick_mode == MOUSECLICK_CC_ATTRACTION_WORK) {
                    key = some_row["infer_workplace_grid"];
                }
                if (!key) {
                    continue;
                }

                if (weekMode == WEEKMODE_WEEKEND) {
                    let grid_map_index = map_hexgrid[key];
                    // Update the feature in the feature collection
                    data_render_hexgrid.features[grid_map_index]["properties"]["freq"] = some_row["count_imsi"];
                }
            }



            var combined_data = {};
            // Just for the Leaderboard. Grouped By Planning Area
            for (let i = 0; i < cc_attraction_summary_weekdayResults.length; i++) {
                let some_row = cc_attraction_summary_weekdayResults[i];
                // Get GridID as key
                let key = some_row["planning_area"];
                if (!key) {
                    continue;
                }

                var count_imsi = some_row["count_imsi"];
                var count_grid = some_row["count_grid"];
                var region = some_row["region"];


                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekend"] = {};
                    combined_data[key]["weekend"]["count_imsi"] = 0;
                    combined_data[key]["weekend"]["count_grid"] = 0;
                    combined_data[key]["region"] = region;
                }
                combined_data[key]["weekday"] = {};
                combined_data[key]["weekday"]["count_imsi"] = count_imsi;
                combined_data[key]["weekday"]["count_grid"] = count_grid;

            }

            for (let i = 0; i < cc_attraction_summary_weekendResults.length; i++) {
                let some_row = cc_attraction_summary_weekendResults[i];
                // Get GridID as key
                let key = some_row["planning_area"];
                if (!key) {
                    continue;
                }

                var count_imsi = some_row["count_imsi"];
                var count_grid = some_row["count_grid"];
                var region = some_row["region"];

                if (!(key in combined_data)) {
                    combined_data[key] = {};
                    combined_data[key]["weekday"] = {};
                    combined_data[key]["weekday"]["count_imsi"] = 0;
                    combined_data[key]["weekday"]["count_grid"] = 0;
                    combined_data[key]["region"] = region;
                }
                combined_data[key]["weekend"] = {};
                combined_data[key]["weekend"]["count_imsi"] = count_imsi;
                combined_data[key]["weekend"]["count_grid"] = count_grid;

            }


            leaderboard_cc_attraction = [];
            for (var key in combined_data) {
                var row_array = [];
                row_array.push(key);
                row_array.push(combined_data[key]["region"]);
                row_array.push(combined_data[key]["weekday"]["count_imsi"]);
                row_array.push(combined_data[key]["weekend"]["count_imsi"]);
                leaderboard_cc_attraction.push(row_array);
            }

            clearDataTable();

            // if (dataTableForLeaderboard == null) {
            console.log("Making new leaderboard for ccattraction");
            dataTableForLeaderboard = $('#table-leaderboard').DataTable({
                data: leaderboard_cc_attraction,
                lengthChange: false,
                searching: false,
                paging: false,
                columns: [
                    {title: "Planning Area"},
                    {title: "Region"},
                    {title: "Weekday"},
                    {title: "Weekend"}
                ],
                order: [[3, 'desc']]
            });

            showLeaderboard("CC Attraction Leaderboard - # of People", "");

            // Update the map layer source
            map.getSource(source_hexgrid).setData(data_render_hexgrid);
        });



        // $.getJSON(jsonUrl, function (result) {
        //     // Create a Map where Key = Grid ID, Value = Index in FeatureCollection
        //     console.log(result);
        //
        //
        //     console.log("showCCAttraction OK");
        // }).fail(function () {
        //     console.log("error");
        // });

    }
}

/*********************
 * KEYBOARD CONTROLS *
 *********************/
function clearData() {
    data_grid_segment = null;
    data_poi_segment = null;
    buff_data_weekend = null;
    buff_data_weekday = null;
}

function clearDataTable() {
    if ($.fn.DataTable.isDataTable('#table-leaderboard') ) {
        $('#table-leaderboard').DataTable().destroy();
        $('#table-leaderboard').empty();
    }
}

function clearEverything() {
    clearGrid();
    clearPOI();
    clearCCPOI();
    clearLifeSphere();
    clearInfoGraphic();
    clearData();
    clearDataTable();
    if (popup) {
        popup.remove();
    }
}


function refreshMapForGridSegment() {
    clearEverything();
    showLOCDaily();
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
    clearInfoGraphic();
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
            showLOCDaily();
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


$(function () {
    $(".map-chart-leaderboard").slimScroll({
        height: '510px',
        color: '#999999'
    });
});