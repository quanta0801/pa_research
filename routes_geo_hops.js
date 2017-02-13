let GLOBALS = require('./app_globals');
let UTILITY = require('./app_utility');

module.exports = function (app) {

    // http://localhost:8443/db/gridonehop?grid_wanted=
    app.get('/db/gridregion', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? parseInt(req.query.grid_wanted) : 1440156;
            client.query({
                text: "SELECT * FROM smarthub.smarthub_pa.mapping_table_grid_planning_area_region WHERE grid_id = $1",
                values: [grid_wanted],
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (var rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

    // http://localhost:8443/db/gridonehop?grid_wanted=
    app.get('/db/gridonehop', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? parseInt(req.query.grid_wanted) : 1440156;
            client.query({
                text: "SELECT neighbour_grid_id FROM smarthub_pa.mapping_table_grid_one_hop WHERE grid_id = $1",
                values: [grid_wanted],
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (var rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

    // http://localhost:8443/db/gridtwohop?grid_wanted=
    app.get('/db/gridtwohop', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? parseInt(req.query.grid_wanted) : 1440156;
            client.query({
                text: "SELECT neighbour_grid_id FROM smarthub_pa.mapping_table_grid_two_hop WHERE grid_id = $1",
                values: [grid_wanted],
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (var rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

};