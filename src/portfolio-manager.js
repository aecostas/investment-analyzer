'use strict';

var Portfolio = require('./portfolio');
var api = require('./api');
var NotFoundError = require('./error-notfound');

var portfolios = {};

var app = api.endpoint();

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(501).send('Something broke!');
});

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

app.post('/portfolio/:portfolio_id/funds/:fundid', function(req, res,  next) {
    let investment = Number.parseInt(req.body.invest);
 
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


