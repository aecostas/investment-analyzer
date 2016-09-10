'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');

var funds = [];
var files = [
    '../data/mediolanum-1.htm',
    '../data/mediolanum-2.htm',
    '../data/mediolanum-3.htm'
];

function parseListOfFunds(body) {
    var $ = cheerio.load(body);

    $("#ctl00_ctl00_MainContent_Layout_1MainContent_gridResult tr").slice(1).each(function() {
	var children = $(this).children();
	var fund = {
	    url: children[1].children[0].attribs.href,
	    name: children[1].children[0].attribs.title
	}
	funds.push(fund);
    });
    
}//parseListOfFunds

for (let i=0; i<files.length; i++) {
    fs.readFile(files[i], 'utf8', (err, data) => {
	if (err) throw err;
	parseListOfFunds(data);

	console.warn(funds.length);
    })
}
