"use strict;"

var request = require('request');
var cheerio = require('cheerio');

var funds = [];
var promiseFunds = [];
var results = {};

var regionCodes = {};

regionCodes['Estados Unidos'] = 'USA';
regionCodes['Iberoamérica'] = 'LATAM';
regionCodes['Reino Unido'] = 'GB';
regionCodes['Canadá'] = 'CANADA';
regionCodes['Zona Euro'] = 'EUROZONE';
regionCodes['Europe - ex Euro'] = 'EUROEXEURO';
regionCodes['África'] = 'AFRICA';
regionCodes['Oriente Medio'] = 'MIDDLEEAST';
regionCodes['Japón'] = 'JAPAN';
regionCodes['Australasia'] = 'AUSTRALASIA';
regionCodes['Asia - Desarrollada'] = 'ASIADEVELOPED';
regionCodes['Asia - Emergente'] = 'ASIAEMERGING';
regionCodes['Europe emergente'] = 'EUROEMERGING'

funds.push({
    url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000MKIO&tab=3",
    amount: 1000,
    percentage: 20,
})
funds.push({
    url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000HLBC&tab=3",
    amount: 1000,
    percentage: 10,
})
funds.push({
    url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F0GBR04SLW&tab=3",
    amount: 3000,
    percentage: 10,
})
funds.push({
    url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000HLB6&tab=3",
    amount: 5000,
    percentage: 15,
})
funds.push({
    url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F0GBR04G6K&tab=3",
    amount:2000,
    percentage: 20,
})
funds.push({
    url:"http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F000001AAQ&tab=3",
    amount:1000,
    percentage: 35
})

function getRegionCode(region) {
    if (regionCodes[region] ) {
	return regionCodes[region]
    } else {
	return region
    }
}


function parseFundRegions(fund) {
    return new Promise(function(resolve, reject) {
	request({
	    uri: fund.url,
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
			"region": getRegionCode(children[0].children[0].data),
			"percentage": parseFloat(children[1].children[0].data.replace(',','.')) * fund.percentage/100,
		    }
		    regions.push(region);
		} catch(err) {
		    console.error(err)
		}

	    });
	    resolve(regions);
	})
    })// Promise

}// parseFundRegions


funds.forEach(function(fund) {
    promiseFunds.push(parseFundRegions(fund));
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
