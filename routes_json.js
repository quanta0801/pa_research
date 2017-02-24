let GLOBALS = require('./app_globals');
let UTILITY = require('./app_utility');
let fs = require("fs"), json;
let dirPathPrefix = './pa/static/';
module.exports = function (app) {

    /**************************
     * Data Cached on Server
     ***************************/
    let data_grid = null;
    let data_grid_region = null;
    let data_poi = null;
    let data_cc_poi = null;
    let data_pArea = null;

    let data_traffic = null;

    /**************************
     * JSON Pages
     **************************/

    app.get('/json/grid', function (req, res) {
        // UTILITY.addDevHeaders(res);

        if (!data_grid) {
            let dirPath = dirPathPrefix + 'data_grid/';
            let filename = 'grid_hex_WKT.geojson';

            data_grid = JSON.parse(fs.readFileSync(dirPath + filename, 'utf8'));
            console.log(filename + " loaded!\n");
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data_grid));
        res.end();
    });
    app.get('/json/planning_area', function (req, res) {
        // UTILITY.addDevHeaders(res);

        if (!data_pArea) {
            let dirPath = dirPathPrefix + 'data_planning_area/';
            let filename = 'planning_area.geojson';

            data_pArea = JSON.parse(fs.readFileSync(dirPath + filename, 'utf8'));
            console.log(filename + " loaded!\n");
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data_pArea));
        res.end();
    });

    app.get('/json/grid_region', function (req, res) {
        // UTILITY.addDevHeaders(res);

        if (!data_grid_region) {
            let dirPath = dirPathPrefix + 'data_grid_region/';
            let filename = 'data_grid_region.json';

            data_grid_region = JSON.parse(fs.readFileSync(dirPath + filename, 'utf8'));
            console.log(filename + " loaded!\n");
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data_grid_region));
        res.end();
    });

    app.get('/json/poi', function (req, res) {
        // UTILITY.addDevHeaders(res);

        if (!data_poi) {
            let dirPath = dirPathPrefix + 'data_poi/';
            let filename = 'poi_latlng.geojson';

            data_poi = JSON.parse(fs.readFileSync(dirPath + filename, 'utf8'));
            console.log(filename + " loaded!\n");
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data_poi));
        res.end();
    });

    // 1453075200 == 1/18/2016, 8:00:00 AM
    // 1478476800 == 11/7/2016, 8:00:00 AM

    app.get('/json/data_traffic', function (req, res) {
        // UTILITY.addDevHeaders(res);
        let time_wanted = (typeof req.query.time_wanted !== 'undefined') ? req.query.time_wanted : "test";

        if (!data_traffic) {
            data_traffic = {};
            let dirPath = dirPathPrefix + 'data_traffic_fixed/';
            let filenames = fs.readdirSync(dirPath);

            let counter = 0;
            filenames.forEach(filename => {
                counter += 1;
                data_traffic[filename] = JSON.parse(fs.readFileSync(dirPath + filename, 'utf8'));
                // data_traffic[filename]["data"] = JSON.parse(data_traffic[filename]["data"]);
                console.log(filename + " loaded!\n");
            });
            console.log(counter + " custom files detected!\n");
        }

        res.setHeader('Content-Type', 'application/json');
        if (time_wanted == "test") {
            res.write(JSON.stringify({"result": "OK"}));
        } else {
            // http://localhost:8443/json/data_traffic?time_wanted=1453075200.json
            // http://localhost:8443/json/data_traffic?time_wanted=1478476800.json
            res.write(JSON.stringify(data_traffic[time_wanted]));
        }
        res.end();

    });

    app.get('/json/cc_poi', function (req, res) {
        // UTILITY.addDevHeaders(res);

        if (!data_cc_poi) {
            let dirPath = dirPathPrefix + 'data_cc_poi/';
            let filename = 'poi_cc.geojson';

            data_cc_poi = JSON.parse(fs.readFileSync(dirPath + filename, 'utf8'));
            console.log(filename + " loaded!\n");
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data_cc_poi));
        res.end();
    });


};