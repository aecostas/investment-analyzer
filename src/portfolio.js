'use strict';

var database = require('./database');
var uuid = require('node-uuid');
var NotFoundError = require('./error-notfound');

/**
 * A portfolio is the list of funds with investments
 */
class Portfolio {

    constructor() {
	this._token = uuid.v4();
	this.funds = {};
	this.stats = {};
	this.total_investment = 0;
    }

    _calculate() {
	var self = this;
	let results = {};
	results['regions'] = {};
	results['sectors'] = {};
	let keys = Object.keys(this.funds);

	// update total investment
	let temp_total_investment = 0;
 	keys.forEach(function(key) {
	    temp_total_investment += self.funds[key].investment;
	});
	this.total_investment = temp_total_investment;

 	keys.forEach(function(key) {
	    let fund = self.funds[key];
	    fund.data.regions.forEach(function(data) {
		if (results.regions[data.region] === undefined) {
		    results.regions[data.region] = {};
		    results.regions[data.region].investment = data.percentage / 100 * fund.investment;
		} else {
		    results.regions[data.region].investment += data.percentage / 100 * fund.investment;
		}
		results.regions[data.region].percentage = (results.regions[data.region].investment / self.total_investment) * 100;
	    });

	    fund.data.sectors.forEach(function(data) {

		if (results.sectors[data.sector] === undefined) {
		    results.sectors[data.sector] = {}; 
		    results.sectors[data.sector].investment = data.percentage / 100 * fund.investment;
		} else {
		    results.sectors[data.sector].investment += data.percentage / 100 * fund.investment;
		}
		results.sectors[data.sector].percentage = (results.sectors[data.sector].investment / self.total_investment) * 100;
		
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
     * @param {Number} investment - Amount of money invested
     *                          in this fund
     * @return {Promise}
     */
    add(isin, investment) {
	var self = this;
	return new Promise(function(resolve, reject) {
	    database.getFund(isin).then(function(docs){
		if (docs == null) {
		    reject();
		}
		self.funds[isin] = {};
		self.funds[isin].data = docs;
		self.funds[isin].investment = investment;
		self.stats = self._calculate();
		resolve();
	    }, function(err){
		console.error(err);
		reject();
	    });

	});
    }// add

    /**
     * Update the investment of the given fund
     *
     * @param {String} isin - ISIN of the fund to update
     * @param {Number} investment - New amount of money invested
     *                          in this fund
     */    
    update(isin, investment) {
	// TODO: study the best way to handle errors
	if (this.funds[isin] == null) {
	    throw new NotFoundError();
	}

	this.funds[isin].investment = investment;
	this.stats = this._calculate();	
    }

    
    get token() {
	return this._token;
    }
    
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
