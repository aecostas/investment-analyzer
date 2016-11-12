'use strict';

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/fundsmanager';

module.exports = {

    getListOfFunds: function() {
	return new Promise(function(resolve, reject) {
	    MongoClient.connect(dburl, function(errconnect, db) {
		if (errconnect) {
		    console.error(errconnect);
		    reject(errconnect);
		}
		
		var collection = db.collection('funds');
		
		collection.find({},{_id:0, name:1, isin:1}).toArray(function(err, docs) {
		    if (err) {
			reject(err);
		    }
		    db.close();
		    resolve(docs);
		});
		
	    });

	});

    },

    
    getFund: function(isin) {
	return new Promise(function(resolve, reject) {
	    MongoClient.connect(dburl, function(errconnect, db) {
		if (errconnect) {
		    console.error(errconnect);
		    reject(errconnect);
		}
		
		var collection = db.collection('funds');

		collection.findOne({isin:isin}, {_id:0,name:1, isin:1, regions:1, sectors:1}, function(err, docs) {
		    if (err) {
			reject(err);
		    }

		    db.close();
		    resolve(docs);
		});
		
	    });

	});
    },

};
