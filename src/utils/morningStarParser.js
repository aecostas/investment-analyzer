'use strict';

var cheerio = require('cheerio');
var locales = require('../locales');

module.exports = {

    /**
     * Parse the body of a fund retrieved from MorningStar
     * 
     * @param {String} fund - Fund body
     * @return {Object} - JSON with name, isin, sectors and  
     *                    regions; null if an error occurs
     */
    parseFundBody: function(fund) {
	var $ = cheerio.load(fund);
	var info = {};
	info.sectors = [];
	info.regions = [];

	try{
	    info.name = $('.snapshotTitleBox h1')[0].children[0].data;
	}catch (err) {
	    console.error('Error parsing name. Continuing...');
	    console.error(err);
	    return null;
	}

	info.isin = $('.overviewKeyStatsTable tr').slice(4).children()[2].children[0].data;

	$('.overviewTopRegionsTable tr').slice(1).each(function() {
	    var children = $(this).children();

	    try {
		info.regions.push({
		    'region': locales.getRegionCode(children[0].children[0].data),
		    'percentage': parseFloat(children[1].children[0].data.replace(',','.')),
		});
	    } catch(err) {
		console.warn('Error parsing region');
		console.error(err);
		info.regions.push({});
	    }
	});

	$('.overviewTopSectorsTable tr').slice(1).each(function() {
	    var children = $(this).children();
	    try {
		info.sectors.push({
		    'sector': locales.getSectorCode(children[1].children[0].data),
		    'percentage': parseFloat(children[2].children[0].data.replace(',','.')),
		});
	    } catch(err) {
		console.error('Error parsing sector');
		console.error(err);
		info.sectors.push({});
	    }
	});

	return info;
    },
};
