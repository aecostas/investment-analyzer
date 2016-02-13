"use strict;"

var request = require('request');
var cheerio = require('cheerio');

request({
    uri: "http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000MKIO&tab=3",
}, function(error, response, body) {
    var $ = cheerio.load(body);
    var regions=[]
    $(".portfolioRegionalBreakdownTable tr").slice(3).each(function() {
	var children = $(this).children();
	var region;
	try {
	    region = {
		"region": children[0].children[0].data,
		"percentage": parseFloat(children[1].children[0].data),
	    }
	    regions.push(region);	    
	} catch(err) {
	    console.warn
	}

    });

    console.warn(regions);
});
