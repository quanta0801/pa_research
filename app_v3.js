var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
// var filtering;

let GLOBALS = require('./app_globals');
let UTILITY = require('./app_utility');


var urlencodedParser = bodyParser.urlencoded();
var jsonParser = bodyParser.json();

app.use(urlencodedParser);
app.use(jsonParser);
app.use(cookieParser());

// var connectionString = 'postgres://username:password@host:port/database';
var conString = {
    host: '10.205.5.29', // server name or IP address;
    port: 5432,
    database: 'smarthub',
    user: 'paadmin',
    password: 'Paadm@sswd',
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
var client = new pg.Client(conString);
client.connect();
GLOBALS.pool = new pg.Pool(conString);
GLOBALS.pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
});


var options = {
    index: 'pa_demographics.html'
};

app.use(express.static('pa', options));
// app.use(express.static('pa'));

// query CRM, group by column name
app.get('/query_crm/:column_name', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        let column_name = req.params.column_name;
        console.log('Querying CRM, group by ' + column_name);
        let qrystr = req.cookies.query;

        client.query({
            text: "SELECT " + column_name + ", COUNT(*)" + qrystr +
            " GROUP BY " + column_name + " ORDER BY " + column_name
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

// query Population CRM
app.get('/query_population', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        console.log('Querying Population CRM');

        client.query({
            text: "SELECT * FROM smarthub_pa.crm_population ORDER BY field, value"
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
app.get('/query_mc_domain/:year/:month', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = req.params.year + '-' + req.params.month + '-1';
        console.log('Querying domain for month: ' + date);
        var qrystr = req.cookies.query;

        var qrystr2 = "SELECT tier1, tier2, domain, COUNT(DISTINCT imsi), SUM(frequency) traffic" +
            " FROM smarthub_pa.mc_domain_v3" +
            " WHERE month = $1::DATE" +
            " AND imsi IN (SELECT imsi" + qrystr + ")" +
            " GROUP BY tier1, tier2, domain";

        client.query({
            text: qrystr2,
            values: [date]
        }, function (err, result) {
            // call `done()` to release the client back to the pool
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

// query mc_network for specific month
app.get('/query_mc_interest_group/:year/:month', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = req.params.year + '-' + req.params.month + '-1';
        console.log('Querying network for month: ' + date);
        var qrystr = req.cookies.query;

        var qrystr2 = "SELECT network_type, network_name, COUNT(DISTINCT imsi), SUM(frequency) traffic, AVG(avg_duration) avg_duration" +
            " FROM smarthub_pa.mc_interest_group_v3" +
            " WHERE month = $1::DATE" +
            " AND imsi IN (SELECT imsi" + qrystr + ")" +
            " GROUP BY network_type, network_name" +
            " ORDER BY traffic DESC, count DESC";

        client.query({
            text: qrystr2,
            values: [date]
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

// query mc_forum for specific month
app.get('/query_mc_forum/:year/:month', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        let date = req.params.year + '-' + req.params.month + '-1';
        console.log('Querying forum for month: ' + date);
        let qrystr = req.cookies.query;
        let qrystr2 = "SELECT forum, thread, COUNT(DISTINCT imsi), SUM(frequency) traffic, AVG(avg_duration) as avg_duration" +
            " FROM smarthub_pa.mc_forum_v3" +
            " WHERE month = $1::DATE" +
            " AND imsi IN (SELECT imsi" + qrystr + ")" +
            " GROUP BY forum, thread" +
            " ORDER BY traffic DESC, count DESC";

        client.query({
            text: qrystr2,
            values: [date]
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

// query loc_grid_daily for specific month
app.get('/query_loc_grid_daily/:year/:month', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        var date = req.params.year + '-' + req.params.month + '-1';
        console.log('Querying grid_daily for month: ' + date);
        var qrystr = req.cookies.query;
        var qrystr2 = "SELECT grid_id, is_weekend, COUNT(DISTINCT imsi)," +
            " AVG(avg_dwell_time) avg_dwell_time, SUM(frequency) traffic" +
            " FROM smarthub_pa.loc_grid_daily" +
            " WHERE month = $1::DATE" +
            " AND imsi IN (SELECT imsi" + qrystr + ")" +
            " GROUP BY grid_id, is_weekend";
        client.query({
            text: qrystr2,
            values: [date]
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

// query loc_poi for specific month
app.get('/query_loc_poi/:year/:month', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        let date = req.params.year + '-' + req.params.month + '-1';
        console.log('Querying POI for month: ' + date);
        let qrystr = req.cookies.query;
        let qrystr2 = "SELECT poi_type, poi_cat, poi_name, lat, long, is_weekend, COUNT(DISTINCT imsi)," +
            " AVG(avg_dwell_time) avg_dwell_time, SUM(frequency) traffic" +
            " FROM smarthub_pa.loc_poi" +
            " WHERE month = $1::DATE" +
            " AND imsi IN (SELECT imsi" + qrystr + ")" +
            " GROUP BY poi_type, poi_cat, poi_name, lat, long, is_weekend";
        client.query({
            text: qrystr2,
            values: [date]
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

// query mc_data_activity for specific month
app.get('/query_mc_data_activity/:year/:month', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        let date = req.params.year + '-' + req.params.month + '-1';
        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;
        console.log('Querying data_activity for month: ' + date);
        let qrystr = req.cookies.query;
        let qrystr2 = "SELECT start_timeband, AVG(percentage_usage) percentage_usage" +
            " FROM smarthub_pa.mc_data_activity_v3" +
            " WHERE month = $1::DATE" +
            " AND is_weekend = $2" +
            " AND imsi IN (SELECT imsi" + qrystr + ")" +
            " GROUP BY start_timeband" +
            " ORDER BY start_timeband";
        client.query({
            text: qrystr2,
            values: [date, is_weekend]
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

// query mc_data_activity for specific month
app.get('/query_mc_data_activity_population', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        let is_weekend = (typeof req.query.is_weekend !== 'undefined') ? (req.query.is_weekend === 'true') : false;
        console.log('Querying data_activity_population');
        let qrystr = "SELECT start_timeband, percentage_usage" +
            " FROM smarthub_pa.mc_data_activity_population" +
            " WHERE is_weekend = $1" +
            " ORDER BY start_timeband";
        client.query({
            text: qrystr,
            values: [is_weekend]
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

function parseFormToQuery(options) {
    let qrystr = " FROM smarthub_pa.crm_v3 WHERE ";
    let segmentD = {"Parents": "is_parent IS TRUE", "PMET": "is_pmet IS TRUE"};
    qrystr += segmentD[options.segment];
    if (options.filter_type == "demographics") {
        qrystr += parseDemoOptions(options);
    } else if (options.filter_type == "planning_area") {
        qrystr += parsePAreaOptions(options);
    }
    return qrystr
}

function parseDemoOptions(options) {
    let ageRange = options.age.split(',').map(Number);
    let qrystr = " AND age BETWEEN " + ageRange[0] + " AND " + ageRange[1];
    qrystr += parseMultiValues("gender", 2, options.gender);
    qrystr += parseMultiValues("race", 5, options.race);
    qrystr += parseMultiValues("infer_residence_region", 5, options.infer_residence_region);
    qrystr += parseMultiValues("infer_workplace_region", 5, options.infer_workplace_region);
    return qrystr;
}


function parsePAreaOptions(options) {
    return parseMultiValues(options.area_filter + "planning_area", 55, options.planning_area)
}


function parseMultiValues(col, maxNum, multiValues) {
    let qrystr = "";
    let addColAndQuotes = function addColAndQuotes(value) {
        return "'" + value + "'";
    };
    if (multiValues) {
        if (typeof multiValues === "string") {
            qrystr += " AND " + col + " IN (" + addColAndQuotes(multiValues) + ")";
        } else if (multiValues.length != maxNum) {
            arr = multiValues.map(addColAndQuotes);
            qrystr += " AND " + col + " IN (" + arr.join(", ") + ")";
        }
    }
    return qrystr;
}

app.post('/apply_filter', function (req, res) {
    GLOBALS.pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        console.log("Parsing form submission and querying filter options on CRM table.");
        var qrystr = parseFormToQuery(req.body);
        console.log(qrystr);

        client.query({
            text: "SELECT COUNT(*), MAX(age) maxage, MIN(age) minage" + qrystr
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
            res.cookie('filter_settings', req.body, {maxAge: 30 * 24 * 60 * 60 * 1000});
            res.cookie('crmProp', results[0], {maxAge: 30 * 24 * 60 * 60 * 1000});
            res.cookie('query', qrystr, {maxAge: 30 * 24 * 60 * 60 * 1000});
            return res.json({'filter_settings': req.body, 'crmProp': results[0], 'query': qrystr});
        });
    });
    // res.end();
});

app.get('/read_cookie', function (req, res) {
    console.log(req.cookies.query);
    console.log('Reading cookie data');
    return res.send(req.cookies);
});

app.get('/clear_cookie', function (req, res) {
    console.log('Clearing cookie data');
    res.clearCookie('filter_settings');
    return res.send(req.cookies);
});

app.get('/cookie_set_date/:year/:month', function (req, res) {
    let dateParams = {year: req.params.year, month: req.params.month};
    res.cookie('dateParams', dateParams, {maxAge: 30 * 24 * 60 * 60 * 1000});
    return res.end();
});









/************************
 * The GEOSPATIAL STUFF *
 ************************/

require('./routes_json')(app);
require('./routes_geo_hops')(app);

require('./routes_geo_grid_segment')(app);
require('./routes_geo_poi_segment')(app);

require('./routes_geo_lifesphere')(app);
require('./routes_geo_cc_attraction')(app);
// END OF GEOSPATIAL STUFF






let server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log('pa portal is listening at http://%s:%s', host, port)
});