'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true,
}));


module.exports = {

    endpoint: function() {
	return app;
    },
    
    start: function() {
	app.listen(3000, function () {
	    console.log('Example app listening on port 3000!');
	});
    },
};
