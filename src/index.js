'use strict';

var portfoliomng = require('./portfolio-manager');
var fundmng = require('./fund-manager');
var api = require('./api');

api.start();

// data.add('IE00B955KM47', 1000).then(function() {
//     console.warn('Added fund: IE00B955KM47');

//     var stats = data.summary();
//     console.warn('Stats: ',stats);
    
//     //  data.add('IE00B3TB2205', 1000).then(function(result) {
//     //	console.warn('Added fund: IE00B94H8N85 ', result);
//     //	data.remove('IE00B955KM47');
//     //	var stats = data.summary();
//     //	console.warn('Stats: ',stats);
//     //  });

// });
