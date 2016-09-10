'use strict';

var jsonfile = require('jsonfile');
var getopt = require('node-getopt');
var request = require('request');
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require('body-parser');
var RGBScale = require('rgb-scale');
var app = express()
var promiseFunds = [];
var results = {};

const StorageLayer = require('./StorageLayer');

app.use(express.static('client'));
app.use(bodyParser.json());

// RGB Scale
var colors = [[255,0,0,1], [0,0,255,0]];
var positions = [0, 0.25, 0.75, 1];
var domain = [0, 100];
var scale = RGBScale(colors, positions, domain);

var cache = new StorageLayer()

var regionCodes = {};
var sectorCodes = {};
var coords = {}

coords['USA'] = {lat: 37.090240, lng:-95.712891, count: 3};
coords['LATAM'] = {lat: -14.235004, lng: -51.925280, count: 3};
coords['GB'] = {lat: 51.507351, lng: -0.127758, count:3}; 
coords['CANADA'] = {lat: 56.130366, lng: -106.346771, count: 3}; 
coords['EUROZONE'] = {lat: 46.227638, lng: 2.213749, count :3}; 
coords['EUROEXEURO'] = {}; 
coords['AFRICA'] = {lat: -8.783195, lng: 34.508523, count:3}; 
coords['MIDDLEEAST'] = {lat: 29.298528, lng: 42.550960, count:3}; 
coords['JAPAN'] = {lat: 36.204824, lng: 138.252924, count:3}; 
coords['AUSTRALASIA'] = {lat: -29.532804, lng: 145.491477, count: 3}; 
coords['ASIADEVELOPED'] = {lat: 23.697810, lng: 120.960515, count: 3}; 
coords['ASIAEMERGING'] = {lat: 27.514162, lng: 90.433601, count:3}; 
coords['EUROEMERGING'] = {lat: 51.919438, lng: 19.145136, count:3}; 

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


/**
 * Retrieve the URL indicated in the fund
 * @param {Object} fund - fund.url URL to retrieve
 * @return {Promise}
 */
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
    var $ = cheerio.load(fund.body);
    var sectors=[]
    $(".portfolioSectorBreakdownTable tr").slice(3).each(function() {
	var children = $(this).children()
	try {
	    var sector = {
		"sector": getSectorCode(children[0].children[1].data),
		"percentage": parseFloat(children[1].children[0].data.replace(',','.'))
	    }
	    sectors.push(sector);
	} catch(err) {
	   // console.error(err)
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
		"percentage": parseFloat(children[1].children[0].data.replace(',','.')),
	    }
	    regions.push(region);
	} catch(err) {
//	    console.error(err)		
	}
    });
    return regions;
}// parseFundRegions


function performAnalysis(funds, nocache) {
    // === MAIN LOOP ===
    //  1.- receive list of funds
    //  2.- retrieve the unknown
    //  3.- parse unknown
    //  4.- save data from unknown
    //  5.- join data from unknown and cached
    //  6.- data mining
    var unretrievedFunds = [];
    var fundData = [];
    var results = {};
    return new Promise(function(resolve, reject) {    
	results["regions"] = {}
	results["sectors"] = {}
	console.warn("========== ", nocache);
	funds.forEach(function(url) {
	    let fundinfo;
	    if (nocache || (fundinfo=cache.get(url) === undefined)) {
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
		fundData.push(fund);
		cache.set(fund.url, fund);
	    })

	    // mining
	    fundData.forEach(function(dataFromFund) {
		dataFromFund.regions.forEach(function(data) {
		    if (results.regions[data.region] === undefined) {
			results.regions[data.region] = {}
			results.regions[data.region].percentage = data.percentage * dataFromFund.percentage/100;
		    } else {
			results.regions[data.region].percentage += data.percentage * dataFromFund.percentage/100;
		    }
		})
		
		dataFromFund.sectors.forEach(function(data) {
		    if (results.sectors[data.sector] === undefined) {
			results.sectors[data.sector] = data.percentage * dataFromFund.percentage/100;
		    } else {
			results.sectors[data.sector] += data.percentage * dataFromFund.percentage/100;
		    }
		})
	    })

	    Object.keys(results.regions).forEach(function(key) {
		results.regions[key].coords = coords[key];
		results.regions[key].coords.count = results.regions[key].percentage;
		results.regions[key].color = scale(results.regions[key].percentage);
		results.regions[key].value = results.regions[key].percentage;
		delete results.regions[key].percentage;
	    })

	    resolve(results);
	})
    })// new Promise
}// performAnalysis

app.get('/dummy', function(req, res) {
    res.send({data:"todo ok por aqui"})
});

app.post('/analysis', function(req, res) {
    performAnalysis(req.body, cmdoptions.options.nocache).then(function(data) {
	res.send(data);
    })
});



var cmdoptions = new getopt([
    ['s' ,'', 'short option'],
    ['i','interactive', 'Interactive mode'],
    ['','nocache', 'Retrieve new data']
])
    .bindHelp()
    .parseSystem()


if (cmdoptions.options.interactive) {
    try {
	var json_funds = jsonfile.readFileSync("funds.json");
	performAnalysis(json_funds, cmdoptions.options.nocache).then(function(data){
	    console.warn(data);
	})

    } catch (err) {
//	console.log(err);
    }
    console.warn(json_funds);

} else {
    var server = app.listen(8000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Investment analyzer listening at http://%s:%s', host, port);
    });
}
