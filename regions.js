"use strict;"

var request = require('request');
var cheerio = require('cheerio');

var funds = [];
var promiseFunds = [];
var results = {}

funds.push({url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000MKIO&tab=3"})
funds.push({url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000HLBC&tab=3"})
funds.push({url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F0GBR04SLW&tab=3"})
funds.push({url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000HLB6&tab=3"})
funds.push({url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F0GBR04G6K&tab=3"})
funds.push({url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F000001AAQ&tab=3"})

function parseFundRegions(url) {
    return new Promise(function(resolve, reject) {
	request({
	    uri: url,
	}, function(error, response, body) {
	    // TODO: get source from URL (ex.: morningstarg) and
	    // call the require parser
	    var $ = cheerio.load(body);
	    var regions=[]
	    $(".portfolioRegionalBreakdownTable tr").slice(3).each(function() {
		var children = $(this).children();
		var region;
		try {
		    region = {
			"region": children[0].children[0].data,
			"percentage": parseFloat(children[1].children[0].data.replace(',','.')),
		    }
		    regions.push(region);
		} catch(err) {
		    console.error(err)
		}

	    });
	    resolve(regions);
	})
    })// Promise
}

funds.forEach(function(fund) {
    promiseFunds.push(parseFundRegions(fund.url));
})


Promise.all(promiseFunds).then(function(values) {
    // aggregate data
    values.forEach(function(dataFromFund) {
	dataFromFund.forEach(function(data) {
	    if (results[data.region] === undefined) {
		results[data.region] = data.percentage
	    } else {
		results[data.region] += data.percentage
	    }
	})
    })

    console.warn(results);
})
