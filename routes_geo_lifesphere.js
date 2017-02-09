let GLOBALS = require('./app_globals');

module.exports = function(app){

    app.get('/db/microsegment', function (req, res) {

        let is_pmet = (typeof req.query.is_pmet !== 'undefined') ? (req.query.is_pmet === 'true') : true;
        let is_parent = (typeof req.query.is_parent !== 'undefined') ? (req.query.is_parent === 'true') : false;
        let min_age = (typeof req.query.max_age !== 'undefined') ? parseInt(req.query.max_age) : 35;
        let max_age = (typeof req.query.min_age !== 'undefined') ? parseInt(req.query.min_age) : 200;
        let race_wanted = (typeof req.query.race_wanted !== 'undefined') ? req.query.race_wanted : 'INDIAN';
        let infer_residence = (typeof req.query.infer_residence !== 'undefined') ? req.query.infer_residence : 'Tampines';

        let qrystr = req.cookies.query;
        console.log('/db/microsegment ', qrystr);
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT DISTINCT(infer_residence_grid) " + qrystr,
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

    app.get('/db/visitedpoi', function (req, res) {
        let month_wanted = (typeof req.query.month_wanted !== 'undefined') ? req.query.month_wanted : '2016-07-01';
        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;

        let is_pmet = (typeof req.query.is_pmet !== 'undefined') ? (req.query.is_pmet === 'true') : true;
        let is_parent = (typeof req.query.is_parent !== 'undefined') ? (req.query.is_parent === 'true') : false;
        let min_age = (typeof req.query.max_age !== 'undefined') ? parseInt(req.query.max_age) : 35;
        let max_age = (typeof req.query.min_age !== 'undefined') ? parseInt(req.query.min_age) : 200;
        let race_wanted = (typeof req.query.race_wanted !== 'undefined') ? req.query.race_wanted : 'INDIAN';
        let infer_residence = (typeof req.query.infer_residence !== 'undefined') ? req.query.infer_residence : 'Tampines';

        let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? req.query.grid_wanted : '1410157';

        let qrystr = req.cookies.query;
        console.log('/db/lifesphere', qrystr);
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT DISTINCT(poi_name) FROM smarthub.smarthub_pa.loc_poi\
                       WHERE month = $1 AND is_weekend = $2 \
                       AND imsi in ( \
                            SELECT imsi " + qrystr + "\
                            AND (infer_residence_grid \
                                IN (SELECT neighbour_grid_id FROM smarthub_pa.mapping_table_grid_one_hop WHERE grid_id = $3) \
                                OR infer_residence_grid = $3 \
                            )\
                       )",
                values: [month_wanted, is_weekend,
                    //is_pmet, is_parent, min_age, max_age, race_wanted, infer_residence,
                    grid_wanted],
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

    app.get('/db/lifesphere', function (req, res) {
        let month_wanted = (typeof req.query.month_wanted !== 'undefined') ? req.query.month_wanted : '2016-07-01';
        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;

        let is_pmet = (typeof req.query.is_pmet !== 'undefined') ? (req.query.is_pmet === 'true') : true;
        let is_parent = (typeof req.query.is_parent !== 'undefined') ? (req.query.is_parent === 'true') : false;
        let min_age = (typeof req.query.max_age !== 'undefined') ? parseInt(req.query.max_age) : 35;
        let max_age = (typeof req.query.min_age !== 'undefined') ? parseInt(req.query.min_age) : 200;
        let race_wanted = (typeof req.query.race_wanted !== 'undefined') ? req.query.race_wanted : 'INDIAN';
        let infer_residence = (typeof req.query.infer_residence !== 'undefined') ? req.query.infer_residence : 'Tampines';

        let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? req.query.grid_wanted : '1410157';

        let qrystr = req.cookies.query;
        console.log('/db/lifesphere', qrystr);
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "WITH ranked_test AS ( \
                        SELECT avg_distance, ntile(4) over (order by avg_distance) as quartile, cume_dist() over (order by avg_distance) as percentile \
                        FROM smarthub_pa.loc_life_sphere_residence \
                        WHERE month = $1 AND is_weekend = $2 AND imsi in ( \
                            SELECT imsi " + qrystr + "\
                            AND (infer_residence_grid \
                                IN (SELECT neighbour_grid_id FROM smarthub_pa.mapping_table_grid_one_hop WHERE grid_id = $3) \
                                OR infer_residence_grid = $3 \
                            )\
                        )\
                      )\
                      SELECT max(avg_distance) AS buffer_distance, quartile, max(percentile) FROM ranked_test \
                      GROUP BY quartile ORDER BY quartile;",
                values: [month_wanted, is_weekend,
                    //is_pmet, is_parent, min_age, max_age, race_wanted, infer_residence,
                    grid_wanted]
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