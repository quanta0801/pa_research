let GLOBALS = require('./app_globals');
let UTILITY = require('./app_utility');

module.exports = {

    padZero: function(n) {
        return n < 10 ? '0' + n : n
    },
    // addDevHeaders: function(res) {
    //     if (GLOBALS.enableCORS) {
    //
    //         // Website you wish to allow to connect
    //         res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    //
    //         // Request methods you wish to allow
    //         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    //
    //         // Request headers you wish to allow
    //         res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //
    //         // Set to true if you need the website to include cookies in the requests sent
    //         // to the API (e.g. in case you use sessions)
    //         res.setHeader('Access-Control-Allow-Credentials', true);
    //
    //         // // Pass to next layer of middleware
    //         // next();
    //     }
    //
    // },

    isEmptyDict: function(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }

};