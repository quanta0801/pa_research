/*
 http://expressjs.com/api.html#cookieParser
 http://expressjs.com/api.html#res.cookie
 http://expressjs.com/api.html#req.cookies
 */
var express = require('express');
var app = module.exports = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// parses request cookies, populating
// req.cookies and req.signedCookies
// when the secret is passed, used
// for signing the cookies.
app.use(cookieParser());

// parses json, x-www-form-urlencoded, and multipart/form-data
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
    if (req.cookies.abcd) {
        console.log(req.cookies);
        res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
    } else {
        res.send('<form method="post"><p>Check to <label>'
            + '<input type="checkbox" name="bcde"/> remember me</label> '
            + '<input type="submit" value="Submit"/>.</p></form>');
    }
});

app.get('/forget', function(req, res){
    res.clearCookie('abcd');
    res.redirect('back');
});

app.post('/', function(req, res){
    var minute = 60 * 1000;
    console.log(req.body.bcde);
    if (req.body.bcde) res.cookie('abcd', 'aaa', { maxAge: minute });
    res.redirect('back');
});


app.listen(80);
console.log('Express started on port %d', 80);