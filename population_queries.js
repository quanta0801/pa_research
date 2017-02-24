/**
 * Created by StarHub on 22/2/2017.
 */
let GLOBALS = require('./app_globals');

module.exports = function (app) {

    // query Population CRM
    app.get('/query_population', function (req, res) {
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            console.log('Querying Population CRM');

            client.query({
                text: "SELECT * FROM smarthub_pa.crm_population_v3 ORDER BY field, value"
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (let rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

    // query mc_data_activity_population for specific month
    app.get('/query_mc_data_activity_population/:year/:month', function (req, res) {
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            var date = req.params.year + '-' + req.params.month + '-1';
            let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;
            console.log('Querying data_activity_population_v3');
            let qrystr = "SELECT start_timeband, percentage_usage" +
                " FROM smarthub_pa.mc_data_activity_population_v3" +
                " WHERE is_weekend = $1" +
                " AND month = $2::DATE"
                " ORDER BY start_timeband";
            client.query({
                text: qrystr,
                values: [is_weekend, date]
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (let rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

    // query mc_domain_population for specific month
    app.get('/query_mc_domain_population/:year/:month', function (req, res) {
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            var date = req.params.year + '-' + req.params.month + '-1';
            console.log('Querying domain_population_v3');
            console.log(date);
            let qrystr = "SELECT * , frequency * count_imsi traffic, frequency * count_imsi / " +
                " (SELECT SUM(frequency * count_imsi) FROM smarthub_pa.mc_domain_population_v3" +
                " WHERE month = $1::DATE) percent_traffic" +
                " FROM smarthub_pa.mc_domain_population_v3" +
                " WHERE month = $2::DATE" +
                " ORDER BY traffic DESC";
            console.log(qrystr);
            client.query({
                text: qrystr,
                values: [date, date]
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (let rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

    // query mc_forum_population for specific month
    app.get('/query_mc_forum_population/:year/:month', function (req, res) {
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            var date = req.params.year + '-' + req.params.month + '-1';
            console.log('Querying forum_population_v3');
            console.log(date);
            let qrystr = "SELECT * , frequency * count_imsi traffic, frequency * count_imsi / " +
                " (SELECT SUM(frequency * count_imsi) FROM smarthub_pa.mc_forum_population_v3" +
                " WHERE month = $1::DATE) percent_traffic" +
                " FROM smarthub_pa.mc_forum_population_v3" +
                " WHERE month = $2::DATE" +
                " ORDER BY traffic DESC";
            client.query({
                text: qrystr,
                values: [date, date]
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (let rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });

    // query mc_domain for specific month
    app.get('/query_mc_interest_group_population/:year/:month', function (req, res) {
        GLOBALS.pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }

            var date = req.params.year + '-' + req.params.month + '-1';
            console.log('Querying domain_population_v3');
            let qrystr = "SELECT * , frequency * count_imsi traffic, frequency * count_imsi / " +
                " (SELECT SUM(frequency * count_imsi) FROM smarthub_pa.mc_interest_group_population_v3" +
                " WHERE month = $1::DATE) percent_traffic" +
                " FROM smarthub_pa.mc_interest_group_population_v3" +
                " WHERE month = $2::DATE" +
                " ORDER BY traffic DESC";
            client.query({
                text: qrystr,
                values: [date, date]
            }, function (err, result) {
                //call `done()` to release the client back to the pool
                done();
                if (err) {
                    res.status(400).send('Error encountered while reading DB');
                }
                let results = [];
                for (let rowIndex in result.rows) {
                    results.push(result.rows[rowIndex]);
                }
                return res.json(results);
            });
        });
    });
};