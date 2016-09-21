'use strict';

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/fundsmanager';

/**
 * A portfolio is the list of funds where the investment
 * is performed
 * 
 */
class Portfolio {

    constructor() {
	this.token = 'aaaaa';
	this.funds = {};
	this.stats = {};
    }

    _calculate() {
	var self = this;
	let results = {};
	results['regions'] = {};
	results['sectors'] = {};
	let keys = Object.keys(this.funds);

 	keys.forEach(function(key) {
	    let fund = self.funds[key];
	    fund.regions.forEach(function(data) {
		if (results.regions[data.region] === undefined) {
		    results.regions[data.region] = {};
		    results.regions[data.region].percentage = data.percentage / keys.length;
		} else {
		    results.regions[data.region].percentage += data.percentage / keys.length;
		}
	    });

	    fund.sectors.forEach(function(data) {
		if (results.sectors[data.sector] === undefined) {
		    results.sectors[data.sector] = data.percentage / keys.length;
		} else {
		    results.sectors[data.sector] += data.percentage / keys.length;
		}
	    });
	});
	
	return results;
	
    }// _calculate

    /**
     * Remove a fund from the portfolio. Stats are
     * updated automatically
     *
     * @param {String} isin - ISIN of the fund to remove
     */    
    remove(isin) {
	delete this.funds[isin];
	this.stats = this._calculate();
    }

    /**
     * Add a new fund to the portfolio. Stats are
     * updated automatically
     *
     * @param {String} isin - ISIN of the fund to add
     * @return {Promise}
     */
    add(isin) {
	var self = this;
	return new Promise(function(resolve, reject) {

	    MongoClient.connect(dburl, function(errconnect, db) {
		if (errconnect) {
		    console.error('Error connection do MongoDB');
		    console.error(errconnect);
		    reject();
		}
		
		var collection = db.collection('funds');
		
		collection.findOne({isin:isin}, function(err, docs) {
		    if (err) {
			reject();
		    }
		    self.funds[isin] = docs;
		    db.close();
		    self.stats = self._calculate();
		    resolve();
		});
	    });
	});
    }// add


    /**
     * Returns a summary with the stats calculated
     * for this portfolio
     * @return {Object} 
     */
    summary() {
	return this.stats;
    }
}

module.exports = Portfolio;
