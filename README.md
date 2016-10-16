[![Build Status](https://travis-ci.org/aecostas/investment-analyzer.svg?branch=master)](https://travis-ci.org/aecostas/investment-analyzer)

[![Coverage Status](https://coveralls.io/repos/github/aecostas/investment-analyzer/badge.svg?branch=master)](https://coveralls.io/github/aecostas/investment-analyzer?branch=master)


# Investment analyzer
This project parse morningstar data to analyze the diversification, both sectorial and territorial, of the given funds.

# Use 
The backend server exposes a REST API to indicate the funds.

To run the server type:

	node regions.js
	
# Client application
The folder /client includes an openlayers3 application that consumes the data from the server and shows world heatmap indicating the regions and the percentage of investment. 
