'use strict';

var Portfolio = require('../src/portfolio');
const assert = require("assert");

describe("Portfolio", function () {
    let data;

    it("Portfolio with one fund", function (done) {
	let portfolio = new Portfolio();
	portfolio.add('IE00B658BK73', 1000).then(function(result) {
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

	}).catch(function(err){
	    console.log(err);
	});
	
    });

    it("Portfolio with several funds", function (done) {
	let portfolio = new Portfolio();
	let fund1 = portfolio.add('IE00B658BK73', 1000);
	let fund2 = portfolio.add('IE00B8KGMC91', 1000);
	
	Promise.all([fund1, fund2]).then(result => {
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
	    
	}).catch(function(err){
	    console.log(err);
	});
	
    });

    it("Adding and removing funds", function (done) {
	let portfolio = new Portfolio();
	let fund1 = portfolio.add('IE00B658BK73', 1000);
	let fund2 = portfolio.add('IE00B8KGMC91', 1000);
	
	Promise.all([fund1, fund2]).then(result => {
	    portfolio.remove('IE00B8KGMC91');
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
	
    });

// TODO: try fund without data
    
});
