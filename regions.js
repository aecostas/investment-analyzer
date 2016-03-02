'use strict';

var request = require('request');
var cheerio = require('cheerio');

var funds = [];
var funds2 = [];
var promiseFunds = [];
var results = {};

const StorageLayer = require('./StorageLayer');

var cache = new StorageLayer()

var regionCodes = {};
var sectorCodes = {};

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
regionCodes['Europe emergente'] = 'EUROEMERGING';

sectorCodes['Materiales Básicos'] ='BASICMATERIALS';
sectorCodes['Consumo Cíclico'] ='CYCLICALCONSUMER';
sectorCodes['Servicios Financieros'] ='FINANCIAL';
sectorCodes['Inmobiliario'] ='INMO';
sectorCodes['Consumo Defensivo'] ='DEFENSIVE';
sectorCodes['Salud'] ='HEALTH';
sectorCodes['Servicios Públicos'] ='PUBLICSERVICES';
sectorCodes['Servicios de Comunicación'] ='COM';
sectorCodes['Energía'] ='ENERGY';
sectorCodes['Industria'] ='INDUSTRY';
sectorCodes['Tecnología'] ='TECHNOLOGY';

funds2.push({
    url:"http://localhost:8000/sample.html",
    amount: 1000,
    percentage: 100
});

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


/**
 * Translates the given string into 
 * an internal code representing
 * a sector
 *
 * @param {string} sector - Parsed sector
 * @return {string} Translated string
 */
function getRegionCode(region) {
    if (regionCodes[region] ) {
	return regionCodes[region]
    } else {
	return region
    }
}// getRegionCode


/**
 * Translates the given string into 
 * an internal code representing
 * a sector
 *
 * @param {string} sector - Parsed sector
 * @return {string} Translated string
 */
function getSectorCode(sector) {
    if (sectorCodes[sector] ) {
	return sectorCodes[sector]
    } else {
	return sector
    }
}// getSectorCode


function retrieveFundData(fund) {
    
    return new Promise(function(resolve, reject) {
	request({
	    uri:fund.url
	}, function(error, response, body) {
	    if (error) {
		console.warn(error);
	    }
	    // TODO: handle errors
	    fund.body = body
	    resolve(fund);
	})
    })// Promise
    		
}// retrieveFundData


/**
 * Parse morningstar 'MiCartera' to get the percentage
 * of sectors
 * 
 * @param fund
 * @return Promise
 */
function parseFundSectors(fund) {
    // TODO: applied percentage afterwards
    var $ = cheerio.load(fund.body);
    var sectors=[]
    $(".portfolioSectorBreakdownTable tr").slice(3).each(function() {
	var children = $(this).children()
	try {
	    var sector = {
		"sector": getSectorCode(children[0].children[1].data),
		"percentage": parseFloat(children[1].children[0].data.replace(',','.')) * fund.percentage/100,
	    }
	    sectors.push(sector);
	} catch(err) {
	    console.error(err)
	}
    });

    return sectors;
}// parseFundsSectors


/**
 * Parse morningstar 'MiCartera' to get the percentage
 * of regions
 * 
 * @param fund
 * @return Promise
 */
function parseFundRegions(fund) {
    var $ = cheerio.load(fund.body);
    var regions = []
    $(".portfolioRegionalBreakdownTable tr").slice(3).each(function() {
	var children = $(this).children();
	try {
	    var region = {
		"region": getRegionCode(children[0].children[0].data),
		"percentage": parseFloat(children[1].children[0].data.replace(',','.')) * fund.percentage/100,
	    }
	    regions.push(region);
	} catch(err) {
	    console.error(err)		
	}
    });
    return regions;
}// parseFundRegions
							   

    
// === MAIN LOOP ===
//  1.- receive list of funds
//  2.- retrieve the unknown
//  3.- parse unknown
//  4.- save data from unknown
//  5.- join data from unknown and cached
//  6.- data mining

var unretrievedFunds = []
var fundData = []
var results = {}
results["regions"] = {}
results["sectors"] = {}

funds.forEach(function(url) {
    let fundinfo;
    if (fundinfo=cache.get(url) === undefined) {
	unretrievedFunds.push(retrieveFundData(url))
    } else {
	fundData.push(fundinfo)
    }
})

// TODO: fundbodies should include the fund identifier
// TODO: refactor this to not chain the actions in this way,
//       chain the promises instead
Promise.all(unretrievedFunds).then(function (fundbodies) {

    // parsing and caching
    fundbodies.forEach(function(fund) {
	fund.regions = parseFundRegions(fund);
	fund.sectors = parseFundSectors(fund);
	fundData.push(fund)
	cache.set(fund.url, fund)
    })
    
    // mining
    fundData.forEach(function(dataFromFund) {
	dataFromFund.regions.forEach(function(data) {
	    if (results.regions[data.region] === undefined) {
		results.regions[data.region] = data.percentage
	    } else {
		results.regions[data.region] += data.percentage
	    }
	})

	dataFromFund.sectors.forEach(function(data) {
	    if (results.sectors[data.sector] === undefined) {
		results.sectors[data.sector] = data.percentage
	    } else {
		results.sectors[data.sector] += data.percentage
	    }
	})

    })

    console.warn(results)
})
