'use strict';

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/fundsmanager2';
var assert = require('assert');

class Aggregator {

    constructor() {
	this.token = "aaaaa";
	this.isins = {};
    }

    calculate() {
	console.warn(this.isins);
    }
    
    remove(isin) {
	delete this.isins[isin];
	this.calculate();
    }
    
    add(isin) {
	// TODO: return Promise
	var self = this;
	MongoClient.connect(dburl, function(err, db) {
	    if (err) {
		console.error("Error connection do MongoDB");
		console.error(err);
	    };
	    
	    var collection = db.collection('funds');

	    collection.find({isin:isin}).toArray(function(err, docs) {
		assert.equal(err,null);
		self.isins[isin] = docs;
		db.close();
		self.calculate();
	    })
	});
    }
}

module.exports = Aggregator;
