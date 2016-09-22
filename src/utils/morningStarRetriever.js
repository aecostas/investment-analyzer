'use strict';

var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var dburl = 'mongodb://localhost:27017/fundsmanager-4-1';
var parser = require('./morningStarParser');

var webfiles = [
    '../../data/mediolanum-1.htm',
    '../../data/mediolanum-2.htm',
    '../../data/mediolanum-3.htm',
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

    $('#ctl00_ctl00_MainContent_Layout_1MainContent_gridResult tr').slice(1).each(function() {
	var children = $(this).children();
	var fund = {
	    url: children[1].children[0].attribs.href,
	    name: children[1].children[0].attribs.title,
	};

	funds.push(fund);
    });
    return funds;
}// parseListOfFunds


/**
 * Returns an array of objects with the name 
 * and the URL of each fund
 *
 * @param {String[]} - Array of filenames. Each file 
 * corresponds to a search performed on MorningStar
 *
 * @return List of funds
 */
function getListOfFunds(files) {
    let totalfunds = [];
    for (let i = 0; i < files.length; i++) {
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
	    uri:url,
	}, function(error, response, body) {
	    if (error) {
		console.warn(error);
		reject(error);
	    }
	    
	    console.warn('[',index,'/',total,']     ', url);

	    // TODO: handle errors
	    resolve(body);
	});
    });// Promise

}// retrieveFundData


let listOfFunds = getListOfFunds(webfiles);
let listOfPromises = [];

for (let i = 0 ; i < 10 ; i++) {
    listOfPromises.push(retrieveFundData(listOfFunds[i].url, i, listOfFunds.length));
}// for

Promise.all(listOfPromises).then(function (fundbodies) {

    for (let i = 0; i < fundbodies.length; i++) {
	let info = parser.parseFundBody(fundbodies[i]);

	if (info != null) {
	    fundsInfo.push(info);
	}
    }

    MongoClient.connect(dburl, function(err, db) {
	if (err) {
	    console.error('Error connection do MongoDB');
	    console.error(err);
	}
	
	var collection = db.collection('funds');

	for (let i = 0; i < fundsInfo.length; i++) {
	    collection.insert(fundsInfo[i], function(errinsert, result) {
		if (errinsert) {
		    console.error('Error inserting document in MongoDB');
		    console.error(err);
		} else {
		    console.warn(result);
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
