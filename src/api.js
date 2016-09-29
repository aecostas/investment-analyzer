'use strict';

var express = require('express');
var app = express();

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
