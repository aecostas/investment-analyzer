'use strict';

var request = require('request');

request.post('http://localhost:3000/portfolio', function(error, response, body) {
    var portfolio = JSON.parse(response.body).id;
    console.warn("Request portfolio: ", response.statusCode);
    console.warn(JSON.parse(response.body).id);
   
    request.post({url:'http://localhost:3000/portfolio/' + portfolio + '/funds/IE00B658BK73',form:{invest:1000}} , function(error, response, body) {

	console.warn(response.statusCode);
	console.warn("---------------------------------");

	request.post({url:'http://localhost:3000/portfolio/' + portfolio + '/funds/IE00B8KGMC91',form:{invest:1000}} , function(error, response, body) {

	    console.warn("Request portfolio/funds: ", response.statusCode);
	    console.warn(response.body);
	    console.warn(response.body);
	    request.delete('http://localhost:3000/portfolio/' + portfolio + '/funds/IE00B8KGMC91' , function(error, response, body) {
		
		console.warn("Request portfolio/funds: ", response.statusCode);
		console.warn(response.body);
		
	    });

	    
	    
	});
    });
});


// request.get('http://localhost:3000/fund', function(error, response, body) {
//     console.warn("Request done: ", response.statusCode);
//     console.warn(response.body);
// });

// request.get('http://localhost:3000/fund/IE0004621052ffff', function(error, response, body) {
//     console.warn("Request done: ", response.statusCode);
//     console.warn(response.body);
// });
