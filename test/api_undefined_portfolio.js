'use strict';

var request = require('request');

request.post('http://localhost:3000/portfolio', function(error, response, body) {
    var portfolio = JSON.parse(response.body).id;
    console.warn("Request portfolio: ", response.statusCode);
    console.warn(JSON.parse(response.body).id);
    
    request.post({url:'http://localhost:3000/portfolio/unknown/funds/IE00B658BK73',form:{invest:1000}} , function(error, response, body) {
	
	console.warn(response.statusCode);
	console.warn(response.body);
	console.warn("\n\n\n");
    });

});
