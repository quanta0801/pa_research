let GLOBALS = require('./app_globals');

module.exports = function(app){




    app.get('/db/locdaily', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool

        let is_pmet = (typeof req.query.is_pmet !== 'undefined') ? (req.query.is_pmet === 'true') : true;
        let is_parent = (typeof req.query.is_parent !== 'undefined') ? (req.query.is_parent === 'true') : false;
        let min_age = (typeof req.query.max_age !== 'undefined') ? parseInt(req.query.max_age) : 35;
        let max_age = (typeof req.query.min_age !== 'undefined') ? parseInt(req.query.min_age) : 200;
        let race_wanted = (typeof req.query.race_wanted !== 'undefined') ? req.query.race_wanted : 'INDIAN';
        let infer_residence = (typeof req.query.infer_residence !== 'undefined') ? req.query.infer_residence : 'Tampines';

        let freq_threshold = (typeof req.query.freq_threshold !== 'undefined') ? req.query.freq_threshold : 0;
        let avg_dwell_time = (typeof req.query.avg_dwell_time !== 'undefined') ? req.query.avg_dwell_time : 1800;
        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;
        let month_wanted = (typeof req.query.month_wanted !== 'undefined') ? req.query.month_wanted : '2016-07-01';

        let qrystr = req.cookies.query;
        console.log('/db/locdaily', qrystr);
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT grid_id, COUNT(imsi) as crowd FROM smarthub_pa.loc_grid_daily \
                       WHERE imsi in (\
                            SELECT imsi " + qrystr + "\
                        )\
                        AND frequency >= $1\
                        AND avg_dwell_time >= $2\
                        AND is_weekend = $3\
                        AND month = $4\
                        GROUP BY grid_id;",
                values: [//is_pmet, is_parent, min_age, max_age, race_wanted, infer_residence,
                    freq_threshold, avg_dwell_time, is_weekend, month_wanted],
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

    app.get('/db/lochourly', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool

        let is_pmet = (typeof req.query.is_pmet !== 'undefined') ? (req.query.is_pmet === 'true') : true;
        let is_parent = (typeof req.query.is_parent !== 'undefined') ? (req.query.is_parent === 'true') : false;
        let min_age = (typeof req.query.max_age !== 'undefined') ? parseInt(req.query.max_age) : 35;
        let max_age = (typeof req.query.min_age !== 'undefined') ? parseInt(req.query.min_age) : 200;
        let race_wanted = (typeof req.query.race_wanted !== 'undefined') ? req.query.race_wanted : 'INDIAN';
        let infer_residence = (typeof req.query.infer_residence !== 'undefined') ? req.query.infer_residence : 'Tampines';

        let freq_threshold = (typeof req.query.freq_threshold !== 'undefined') ? req.query.freq_threshold : 0;
        let avg_dwell_time = (typeof req.query.avg_dwell_time !== 'undefined') ? req.query.avg_dwell_time : 1800;
        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;
        let month_wanted = (typeof req.query.month_wanted !== 'undefined') ? req.query.month_wanted : '2016-07-01';
        let grid_wanted = (typeof req.query.grid_wanted !== 'undefined') ? req.query.grid_wanted : '1410157';


        let qrystr = req.cookies.query;
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT hour, SUM(frequency) as crowd FROM smarthub_pa.loc_grid_hourly\
                       WHERE imsi in (\
                            SELECT imsi " + qrystr + "\
                        )\
                        AND frequency >= $1\
                        AND avg_dwell_time >= $2\
                        AND is_weekend = $3\
                        AND month = $4\
                        AND grid_id = $5\
                        GROUP BY hour ORDER BY hour;",
                values: [//is_pmet, is_parent, min_age, max_age, race_wanted, infer_residence,
                    freq_threshold, avg_dwell_time, is_weekend, month_wanted, grid_wanted],
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send('Error encountered while reading DB');
                } else {
                    let results = [];
                    for (var rowIndex in result.rows) {
                        results.push(result.rows[rowIndex]);
                    }
                    return res.json(results);
                }

            });
        });
    });

};