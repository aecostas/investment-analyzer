'use strict';

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/fundsmanager';
var assert = require('assert');

class Portfolio {

    constructor() {
	this.token = "aaaaa";
	this.funds = {};
	this.stats = {};
	var self = this;
    }

    _calculate() {
	var self = this;
	let results = {};
	results["regions"] = {};
	results["sectors"] = {};
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
	    })

	    fund.sectors.forEach(function(data) {
		if (results.sectors[data.sector] === undefined) {
		    results.sectors[data.sector] = data.percentage / keys.length;
		} else {
		    results.sectors[data.sector] += data.percentage / keys.length;
		}
	    })
	})
	
	return results;
	
    }// calculate

    remove(isin) {
	delete this.funds[isin];
	this.stats = this._calculate();
    }

    add(isin) {
	var self = this;
	return new Promise(function(resolve, reject) {

	    MongoClient.connect(dburl, function(err, db) {
		if (err) {
		    console.error("Error connection do MongoDB");
		    console.error(err);
		};
		
		var collection = db.collection('funds');
		
		collection.findOne({isin:isin}, function(err, docs) {
		    assert.equal(err,null);
		    self.funds[isin] = docs;
		    db.close();
		    self.stats = self._calculate();
		    resolve();
		})
	    });
	})
    }// add

    summary() {
	return this.stats;
    }
}

module.exports = Portfolio;
