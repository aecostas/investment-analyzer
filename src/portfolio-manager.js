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


app.param('portfolio_id', function(req, res, next, portfolio_id) {
    // TODO: consider error
    req.portfolio = portfolios[portfolio_id];
    console.warn("portfolio id: ", portfolio_id);
    next();
});

app.post('/portfolio/:portfolio_id/funds/:fundid', function(req, res) {
    let investment = Number.parseInt(req.body.invest);
    // TODO: portfolio not found (404)
    if (Number.isNaN(investment)) {
	res.status(400).send({});
	return;
    }

    req.portfolio.add(req.params.fundid, investment)
	.then(function() {
	    res.status(201).send(req.portfolio.summary());
	})
	.catch(function(err) {
	    // TODO:
	    //   err -> 404 fund not found
	    //   err -> 500 database error
	    console.error('Error adding fund to portfolio: ', err);
	    res.status(500).send();
	});
});


app.delete('/portfolio/:portfolio_id/funds/:fundid', function(req, res) {
    //TODO: not found
    req.portfolio.remove(req.params.fundid);
    res.status(200).send(req.portfolio.summary());
});

app.patch('/portfolio/:portfolio_id/funds/:fundid', function(req, res) {
    let investment = Number.parseInt(req.body.invest);
    req.portfolio.update(req.params.fundid, investment);
    res.status(200).send(req.portfolio.summary());
});


