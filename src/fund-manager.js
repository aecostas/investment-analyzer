'use strict';

var api = require('./api');
var database = require('./database');

var app = api.endpoint();

app.post('/fund', function(req, res) {   
    res.status(501).send();
});

app.get('/fund', function (req, res) {
    // TODO: query string to smart search
    // fund that best match a given criteria
    database.getListOfFunds().then(function(docs){
	res.status(200).send(docs);
    });
});

app.get('/fund/:funid', function (req, res) {
    database.getFund(req.params.funid)
	.then(function(docs){
	    if (docs != null) {
		res.status(200).send(docs);
	    } else {
		res.status(404).send();
	    }
	})
	.catch(function(err) {
	    console.warn('Database error:', err);
	    res.status(500).send();
	});
});
