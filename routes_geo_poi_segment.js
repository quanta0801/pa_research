let GLOBALS = require('./app_globals');

module.exports = function(app){

    app.get('/db/poisegment', function (req, res) {
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool

        let is_pmet = (typeof req.query.is_parent !== 'undefined') ? (req.query.is_pmet === 'true') : true;
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
        console.log('/db/poisegment', qrystr);
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query({
                text: "SELECT poi_name, AVG(frequency) as avg_frequency, AVG(avg_dwell_time) as avg_dwell_time\
                        FROM smarthub.smarthub_pa.loc_poi\
                        WHERE imsi in (\
                            SELECT imsi " + qrystr + "\
                            )\
                        AND frequency >= $1\
                        AND avg_dwell_time >= $2\
                        AND is_weekend = $3\
                        AND month = $4\
                        GROUP BY poi_name;",
                values: [//is_pmet, is_parent, min_age, max_age, race_wanted, infer_residence,
                    freq_threshold, avg_dwell_time, is_weekend, month_wanted]
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                if (!result) {
                    return res.json({});
                }
                for (var rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                console.log('/db/poisegment RESULTS:', results.length);
                return res.json(results);
            });
        });
    });

};