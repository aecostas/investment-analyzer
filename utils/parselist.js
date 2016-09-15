'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');


var files = [
    '../data/mediolanum-1.htm',
    '../data/mediolanum-2.htm',
    '../data/mediolanum-3.htm'
];

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
function retrieveFundData(url) {
//    console.warn("Getting url: ", url);
    return new Promise(function(resolve, reject) {
	request({
	    uri:url
	}, function(error, response, body) {
	    if (error) {
		console.warn(error);
	    }
	    // TODO: handle errors
	    resolve(body);
	})
    })// Promise

}// retrieveFundData


function parseFund(fund) {
    var $ = cheerio.load(fund);
    var sectors=[];
    var regions=[];

    $(".overviewTopRegionsTable tr").slice(1).each(function() {
	var children = $(this).children();

	try {
	    regions.push({
		"region": children[0].children[0].data,
		"percentage": parseFloat(children[1].children[0].data.replace(',','.'))
	    });
	} catch(err) {
	    console.error(err);
	}
    });

    $(".overviewTopRegionsTable tr").slice(1).each(function() {
	var children = $(this).children();
	try {
	    sectors.push({
		"sector": children[0].children[0].data,
		"percentage": parseFloat(children[1].children[0].data.replace(',','.')),
	    });
	} catch(err) {
	    console.error(err);
	}
    });
    return {sectors:sectors, regions:regions};
}// parseFunds

let listOfFunds = getListOfFunds(files);

retrieveFundData("http://www.morningstar.es/es/funds/snapshot/snapshot.aspx?id=F00000MKIO").then(function(body) {
    let info = parseFund(body);
    console.warn(info);
});


//for (let i=0; i<listOfFunds.length; i++) {
  //  console.warn("Parsing: ", listOfFunds[i].url, "   ", listOfFunds[i].url.includes("F00000MKIO"));
    
    //    retrieveFundData(listOfFunds[i].url).then(function(body) {
    //	let info = parseFund(body);
    //	console.warn(info);
    //    })w
//}// for

// http://docs.sequelizejs.com/en/v3/
// TODO: crear objeto con los datos de cada fondo
// y meterlo en bbdd mediante el ORM
