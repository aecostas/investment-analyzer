'use strict';

var Portfolio = require('./portfolio');
var api = require('./api');
var database = require('./database');

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
    req.portfolio = portfolios[portfolio_id];
    if (req.portfolio === undefined) {
	res.status(404).send('Unknown portfolio');
    } else {
    	next();
    }
});

app.param('fund_id', function(req, res, next, fund_id) {
    database.getFund(fund_id).then(function(docs){
	if (docs == null) {
	    res.status(404).send('Unknown fund');
	} else {
	    req.fund = docs;
	    next();
	}
    });
});
    
app.post('/portfolio/:portfolio_id/funds/:fund_id', function(req, res) {
    let investment = Number.parseInt(req.body.invest);

    if (Number.isNaN(investment)) {
	res.status(400).send({});
	return;
    }

    req.portfolio.add(req.fund, investment);
    res.status(201).send(req.portfolio.summary());
});


app.delete('/portfolio/:portfolio_id/funds/:fund_id', function(req, res) {
    //TODO: not found
    req.portfolio.remove(req.params.fund_id);
    res.status(200).send(req.portfolio.summary());
});

app.patch('/portfolio/:portfolio_id/funds/:fund_id', function(req, res) {
    let investment = Number.parseInt(req.body.invest);
    req.portfolio.update(req.params.fund_id, investment);
    res.status(200).send(req.portfolio.summary());
});


