"use strict";

class StorageLayer {

    constructor() {
	// object of cached funds
	// {url:{
	//    name:""
	//    body: <body>
	//    sectors: Object (ex.: {USA: 16.3, LATAM: 20})
	//    regions: Object (ex.: {Energy: 20, Technology:12})
	// }
	this.cached = []
    }// constructor


    /**
     * Retrieve data fund by url ()
     * @param {string} url - URL of the fund (works as an identifier)
     * @return {Object} 
     */
    get(url) {
	return this.cached[url]
    }// getFund

    /**
     * Adds a new fund to the cache
     * @param {string} url - URL of the fund
     * @param {Object} funddata - JSON object
     */
    set(url, funddata) {
	// TODO: check funddata format?
	// TODO: check if it already exists?
	this.cached[url] = funddata
    }// addFund
    
}// StorageLayer

module.exports = StorageLayer
