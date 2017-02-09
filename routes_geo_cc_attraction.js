let GLOBALS = require('./app_globals');

module.exports = function(app){

    app.get('/db/cc', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool

        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT * FROM smarthub.smarthub_pa.mapping_table_cc;",
                name: 'cc'
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

    app.get('/db/ccattraction', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        let is_from_work = (typeof req.query.is_from_work !== 'undefined') ? (req.query.is_from_work === 'true') : false;

        let avg_dwell_time = (typeof req.query.avg_dwell_time !== 'undefined') ? req.query.avg_dwell_time : 1800;
        let month_wanted = (typeof req.query.month_wanted !== 'undefined') ? req.query.month_wanted : '2016-07-01';
        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;
        let freq_threshold = (typeof req.query.freq_threshold !== 'undefined') ? req.query.freq_threshold : 1;
        let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? req.query.grid_wanted : '1220124';

        let which_grid = "infer_residence_grid";
        if (is_from_work) {
            which_grid = "infer_workplace_grid";
        }

        let qrystr = req.cookies.query;
        let whereOrAnd = ' WHERE ';
        if (qrystr.toLowerCase().indexOf('where') !== -1){
            whereOrAnd = ' AND ';
        }


        console.log('/db/ccattraction', qrystr);
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT " + which_grid + ", COUNT(imsi) " + qrystr + whereOrAnd + " imsi in (\
                            SELECT imsi FROM smarthub_pa.loc_grid_daily\
                            WHERE avg_dwell_time >= $1 \
                            AND month = $2\
                            AND is_weekend = $3\
                            AND frequency >= $4 \
                            AND grid_id in (\
                                SELECT neighbour_grid_id FROM smarthub.smarthub_pa.mapping_table_grid_two_hop WHERE grid_id = $5\
                            )\
                       ) GROUP BY " + which_grid + ";",
                values: [avg_dwell_time, month_wanted, is_weekend, freq_threshold, grid_wanted],
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