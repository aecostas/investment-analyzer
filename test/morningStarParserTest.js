'use strict';

var fs = require('fs')
var parser = require('../src/utils/morningStarParser');
const assert = require("assert");

describe("Parsing morningStar fund", function () {
    let data;
    before(function() {
	let fundbody = fs.readFileSync('fund.html', {encoding:'utf-8'});
	data = parser.parseFundBody(fundbody);
    });
    
    it("should parse isin correctly", function () {
	assert.equal(data.isin, 'IE0009623046');
    });

    it("should parse sectors correctly", function () {
	assert.equal(data.sectors[0].sector, 'TECHNOLOGY');
	assert.equal(data.sectors[0].percentage, 77.42);

	assert.equal(data.sectors[1].sector, 'CYCLICALCONSUMER');
	assert.equal(data.sectors[1].percentage, 5.87);

	assert.equal(data.sectors[2].sector, 'FINANCIAL');
	assert.equal(data.sectors[2].percentage, 4.91);

	assert.equal(data.sectors[3].sector, 'INDUSTRY');
	assert.equal(data.sectors[3].percentage, 4.43);
	
	assert.equal(data.sectors[4].sector, 'HEALTH');
	assert.equal(data.sectors[4].percentage, 3.81);       
    });

    it("should parse regions correctly", function () {
	assert.equal(data.regions[0].region, 'USA');
	assert.equal(data.regions[0].percentage, 78.66);

	assert.equal(data.regions[1].region, 'EUROZONE');
	assert.equal(data.regions[1].percentage, 6.69);

	assert.equal(data.regions[2].region, 'ASIAEMERGING');
	assert.equal(data.regions[2].percentage, 4.91);

	assert.equal(data.regions[3].region, 'ASIADEVELOPED');
	assert.equal(data.regions[3].percentage, 3.49);
	
	assert.equal(data.regions[4].region, 'GB');
	assert.equal(data.regions[4].percentage, 2.82);       

    });

    
});
