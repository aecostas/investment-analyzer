'use strict';

var Portfolio = require('./portfolio');
var api = require('./api');

var portfolios = {};

var app = api.endpoint();

app.get('/portfolio/:id', function(req, res) {
    res.send('Hello World!');
});

// TODO: autocomplete funds in portfolio
// from given criteria, for instance,
// constraints in the region/sectors

app.post('/portfolio', function(req, res) {
    let portfolio = new Portfolio();
    portfolios[portfolio.token] = portfolio;
    res.status(201).send({id:portfolio.token});
});

app.post('/portfolio/:id/funds/:fundid', function(req, res) {
    // use app.param /portfolio/:id
    res.send('Hello World!');
});


app.delete('/portfolio/:id/funds/:fundid', function(req, res) {
    res.send('Hello World!');
});


module.exports = {
    
    start: function() {
	app.listen(3000, function () {
	    console.log('Example app listening on port 3000!');
	});
    },
};
