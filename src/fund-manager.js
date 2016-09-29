'use strict';

var api = require('./api');
var database = require('./database');

var app = api.endpoint();

app.post('/fund', function(req, res) {   
    res.send('Hello World!');
});

app.get('/fund', function (req, res) {
    // TODO: query string to smart search
    // fund that best match a given criteria
    database.getListOfFunds().then(function(docs){
	res.status(200).send(docs);
    });
});
