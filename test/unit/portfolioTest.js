'use strict';

var Portfolio = require('../../src/portfolio');
var NotFoundError = require('../../src/error-notfound');
const assert = require("assert");
var database = require('../../src/database');

describe("Portfolio", function () {
    let data;
    var fund1;
    var fund2;

    before(function() {
	fund1 = {};
	fund1.name = 'Mediolanum BB Coupon Strategy Collection L B';
	fund1.isin = 'IE00B658BK73';
	fund1.sectors = [
	    {
		"sector" : "FINANCIAL",
		"percentage" : 15.82
	    },
	    {
		"sector" : "CYCLICALCONSUMER",
		"percentage" : 14
	    },
	    {
		"sector" : "DEFENSIVE",
		"percentage" : 12.71
	    },
	    {
		"sector" : "HEALTH",
		"percentage" : 11.09
	    },
	    {
		"sector" : "INDUSTRY",
		"percentage" : 10.3
	    }
	];

	fund1.regions = [
	    {
		"region" : "USA",
		"percentage" : 47.19
	    },
	    {
		"region" : "EUROZONE",
		"percentage" : 14.59
	    },
	    {
		"region" : "GB",
		"percentage" : 14.1
	    },
	    {
		"region" : "EUROEXEURO",
		"percentage" : 6.74
	    },
	    {
		"region" : "ASIADEVELOPED",
		"percentage" : 5.29
	    }
	];

    });

    before(function() {
	fund2 = {};
	fund2.name = 'Mediolanum BB Carmignac Strategic Selection S Class A Units';
	fund2.isin = 'IE00B8KGMC91';
	fund2.sectors = [
	    {
		"sector" : "HEALTH",
		"percentage" : 18.67
	    },
	    {
		"sector" : "TECHNOLOGY",
		"percentage" : 17.29
	    },
	    {
		"sector" : "FINANCIAL",
		"percentage" : 14.88
	    },
	    {
		"sector" : "CYCLICALCONSUMER",
		"percentage" : 11.48
	    },
	    {
		"sector" : "COM",
		"percentage" : 9.79
	    }
	];

	fund2.regions = [
	    {
		"region" : "EUROZONE",
		"percentage" : 36.6
	    },
	    {
		"region" : "USA",
		"percentage" : 31.21
	    },
	    {
		"region" : "GB",
		"percentage" : 9.9
	    },
	    {
		"region" : "EUROEXEURO",
		"percentage" : 7.93
	    },
	    {
		"region" : "ASIAEMERGING",
		"percentage" : 4.6
	    }
	];
	
    });

    
    it("Portfolio with one fund", function (done) {
	let portfolio = new Portfolio();
	portfolio.add(fund1, 1000);
	let stats = portfolio.summary();
	assert.equal(stats.sectors['FINANCIAL'].percentage.toFixed(2), 15.82);
	assert.equal(stats.sectors['CYCLICALCONSUMER'].percentage.toFixed(), 14);
	assert.equal(stats.sectors['DEFENSIVE'].percentage.toFixed(2), 12.71);
	assert.equal(stats.sectors['HEALTH'].percentage.toFixed(2), 11.09);
	assert.equal(stats.sectors['INDUSTRY'].percentage.toFixed(2), 10.3);
	
	assert.equal(stats.regions['USA'].percentage.toFixed(2), 47.19);
	assert.equal(stats.regions['EUROZONE'].percentage.toFixed(2), 14.59);
	assert.equal(stats.regions['GB'].percentage.toFixed(1), 14.1);
	assert.equal(stats.regions['EUROEXEURO'].percentage.toFixed(2), 6.74);
	assert.equal(stats.regions['ASIADEVELOPED'].percentage.toFixed(2), 5.29);
	done();
    });

    it("Portfolio with several funds", function (done) {
	let portfolio = new Portfolio();
	portfolio.add(fund1, 1000);
	portfolio.add(fund2, 1000);
	
	let stats = portfolio.summary();
	assert.equal(stats.sectors['FINANCIAL'].percentage.toFixed(2),15.35 );
	assert.equal(stats.sectors['CYCLICALCONSUMER'].percentage.toFixed(2), 12.74);
	assert.equal(stats.sectors['DEFENSIVE'].percentage.toFixed(3), 6.355);
	assert.equal(stats.sectors['HEALTH'].percentage.toFixed(2), 14.88);
	assert.equal(stats.sectors['INDUSTRY'].percentage.toFixed(2), 5.15);
	assert.equal(stats.sectors['TECHNOLOGY'].percentage.toFixed(3), 8.645);
	assert.equal(stats.sectors['COM'].percentage.toFixed(3), 4.895);	    
	
	assert.equal(stats.regions['USA'].percentage.toFixed(1), 39.2);
	assert.equal(stats.regions['EUROZONE'].percentage.toFixed(3), 25.595);
	assert.equal(stats.regions['GB'].percentage.toFixed(0), 12);
	assert.equal(stats.regions['EUROEXEURO'].percentage.toFixed(3), 7.335);
	assert.equal(stats.regions['ASIADEVELOPED'].percentage.toFixed(3), 2.645);
	assert.equal(stats.regions['ASIAEMERGING'].percentage.toFixed(1), 2.3);

	done();
	
    });

    it("Adding and removing funds", function (done) {
	let portfolio = new Portfolio();
	portfolio.add(fund1, 1000);
	portfolio.add(fund2, 1000);
	
	portfolio.remove(fund2.isin);
	let stats = portfolio.summary();
	assert.equal(stats.sectors['FINANCIAL'].percentage.toFixed(2), 15.82);
	assert.equal(stats.sectors['CYCLICALCONSUMER'].percentage.toFixed(), 14);
	assert.equal(stats.sectors['DEFENSIVE'].percentage.toFixed(2), 12.71);
	assert.equal(stats.sectors['HEALTH'].percentage.toFixed(2), 11.09);
	assert.equal(stats.sectors['INDUSTRY'].percentage.toFixed(2), 10.3);
	
	assert.equal(stats.regions['USA'].percentage.toFixed(2), 47.19);
	assert.equal(stats.regions['EUROZONE'].percentage.toFixed(2), 14.59);
	assert.equal(stats.regions['GB'].percentage.toFixed(1), 14.1);
	assert.equal(stats.regions['EUROEXEURO'].percentage.toFixed(2), 6.74);
	assert.equal(stats.regions['ASIADEVELOPED'].percentage.toFixed(2), 5.29);
	done();
    });

    it("Update amount of investment in a fund", function (done) {
	let portfolio = new Portfolio();
	portfolio.add(fund1, 1000);
	portfolio.add(fund2, 500);

	portfolio.update(fund2.isin, 1000);
	let stats = portfolio.summary();
	
	assert.equal(stats.sectors['FINANCIAL'].percentage.toFixed(2),15.35 );
	assert.equal(stats.sectors['CYCLICALCONSUMER'].percentage.toFixed(2), 12.74);
	assert.equal(stats.sectors['DEFENSIVE'].percentage.toFixed(3), 6.355);
	assert.equal(stats.sectors['HEALTH'].percentage.toFixed(2), 14.88);
	assert.equal(stats.sectors['INDUSTRY'].percentage.toFixed(2), 5.15);
	assert.equal(stats.sectors['TECHNOLOGY'].percentage.toFixed(3), 8.645);
	assert.equal(stats.sectors['COM'].percentage.toFixed(3), 4.895);	    
	
	assert.equal(stats.regions['USA'].percentage.toFixed(1), 39.2);
	assert.equal(stats.regions['EUROZONE'].percentage.toFixed(3), 25.595);
	assert.equal(stats.regions['GB'].percentage.toFixed(0), 12);
	assert.equal(stats.regions['EUROEXEURO'].percentage.toFixed(3), 7.335);
	assert.equal(stats.regions['ASIADEVELOPED'].percentage.toFixed(3), 2.645);
	assert.equal(stats.regions['ASIAEMERGING'].percentage.toFixed(1), 2.3);
	
	done();
    });


    it("Try to update a unexistent fund", function (done) {
	let portfolio = new Portfolio();
	portfolio.add(fund1, 1000);
	try {
	    portfolio.update('unknown',1000);
	} catch(err) {
	    if (err instanceof NotFoundError) {
		done();
	    }
	}
	
    });
    
    // TODO: try fund without data
});
