'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');
var jsonfile = require('jsonfile')
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var dburl = 'mongodb://localhost:27017/fundsmanager';

var files = [
    '../data/mediolanum-1.htm',
    '../data/mediolanum-2.htm',
    '../data/mediolanum-3.htm'
];

var fundsInfo = [];

/**
 * Parse a file result of a search on
 * MorningStar with the aim of getting
 * a list of funds with the name and
 * the URL with the details of it
 *
 * @param String MorningStart search in HTML
 *
 * @return Array[Object] {url, name}
 */
function parseListOfFunds(body) {
    let funds = [];
    var $ = cheerio.load(body);

    $("#ctl00_ctl00_MainContent_Layout_1MainContent_gridResult tr").slice(1).each(function() {
	var children = $(this).children();
	var fund = {
	    url: children[1].children[0].attribs.href,
	    name: children[1].children[0].attribs.title
	}

	funds.push(fund);
    });
    return funds;
}// parseListOfFunds


function getListOfFunds(files) {
    let totalfunds = [];
    for (let i=0; i<files.length; i++) {
	let filecontents = fs.readFileSync(files[i], 'utf8');
	var funds = parseListOfFunds(filecontents);
	Array.prototype.push.apply(totalfunds, funds);
    } // for

    return totalfunds;
}// getListOfFunds


/**
 * Retrieve the URL indicated in the fund
 * @param {Object} fund - fund.url URL to retrieve
 * @return {Promise}
 */
function retrieveFundData(url, index, total) {

    return new Promise(function(resolve, reject) {
	request({
	    uri:url
	}, function(error, response, body) {
	    if (error) {
		console.warn(error);
	    }
	    
	    console.warn("[",index,"/",total,"]     ", url);

	    // TODO: handle errors
	    resolve(body);
	})
    })// Promise

}// retrieveFundData


/**
 * Parse the body of a fund retrieved from MorningStar
 * 
 * @param {String} fund - Fund body
 * @return {Object} - JSON with name, isin, sectors and  
 *                    regions; null if an error occurs
 */
function parseFundBody(fund) {
    var $ = cheerio.load(fund);
    var info = {};
    info.sectors = [];
    info.regions = [];

    try{
	info.name = $(".snapshotTitleBox h1")[0].children[0].data;
    }catch (err) {
	console.error("Error parsing name. Continuing...");
	console.error(err);
	return null;
    }

    info.isin = $(".overviewKeyStatsTable tr").slice(4).children()[2].children[0].data;

    $(".overviewTopRegionsTable tr").slice(1).each(function() {
	var children = $(this).children();

	try {
	    info.regions.push({
		"region": children[0].children[0].data,
		"percentage": parseFloat(children[1].children[0].data.replace(',','.'))
	    });
	} catch(err) {
	    console.warn("Error parsing region");
	    console.error(err);
	    info.regions.push({});
	}
    });

    $(".overviewTopRegionsTable tr").slice(1).each(function() {
	var children = $(this).children();
	try {
	    info.sectors.push({
		"sector": children[0].children[0].data,
		"percentage": parseFloat(children[1].children[0].data.replace(',','.')),
	    });
	} catch(err) {
	    console.error("Error parsing sector");
	    console.error(err);
	    info.sectors.push({});
	}
    });

    return info;
}// parseFundBody

let listOfFunds = getListOfFunds(files);
let listOfPromises = [];

for (let i=0; i<listOfFunds.length; i++) {
    listOfPromises.push(retrieveFundData(listOfFunds[i].url, i, listOfFunds.length));
}// for

Promise.all(listOfPromises).then(function (fundbodies) {

    for (let i=0; i<fundbodies.length; i++) {
	let info = parseFundBody(fundbodies[i]);
	if (info!=null) {
	    fundsInfo.push(info);
	}
    }

    MongoClient.connect(dburl, function(err, db) {
	if (err) {
	    console.error("Error connection do MongoDB");
	    console.error(err);
	};
	
	var collection = db.collection('funds');

	for (let i=0; i<fundsInfo.length; i++) {
	    collection.insert(fundsInfo[i], function(err, result) {
		if (err) {
		    console.error("Error inserting document in MongoDB");
		    console.error(err);
		}
	    });
	}// for

	db.close();
    });
    
});

process.on('uncaughtException', function (exception) {
    console.log(exception); // to see your exception details in the console
    // if you are on production, maybe you can send the exception details to your
    // email as well ?
});
