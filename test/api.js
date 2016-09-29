'use strict';

var request = require('request');

// request.post('http://localhost:3000/portfolio', function(error, response, body) {
//     console.warn("Request done: ", response.statusCode);
//     console.warn(response.body);
// });


request.get('http://localhost:3000/fund', function(error, response, body) {
    console.warn("Request done: ", response.statusCode);
    console.warn(response.body);
});



