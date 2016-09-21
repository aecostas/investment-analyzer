'use strict';

var Portfolio = require('./portfolio');

var data = new Portfolio();

data.add('IE00B955KM47').then(function() {
    console.warn('Added fund: IE00B955KM47');

    data.add('IE00B3TB2205').then(function(result) {
	console.warn('Added fund: IE00B94H8N85 ', result);
	data.remove('IE00B955KM47');
	var stats = data.summary();
	console.warn('Stats: ',stats);
    });

});


