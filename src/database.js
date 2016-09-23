'use strict';

var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/fundsmanager';

module.exports = {

    getFund: function(isin) {
	return new Promise(function(resolve, reject) {
	    MongoClient.connect(dburl, function(errconnect, db) {
		if (errconnect) {
		    console.error(errconnect);
		    reject(errconnect);
		}
		
		var collection = db.collection('funds');
		
		collection.findOne({isin:isin}, function(err, docs) {
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
